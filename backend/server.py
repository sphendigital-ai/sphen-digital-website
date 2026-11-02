from fastapi import FastAPI, APIRouter, HTTPException, Header, Request, Response
from fastapi.responses import PlainTextResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
import razorpay as razorpay_sdk
import os
import re
import csv
import io
import asyncio
import logging
import httpx
import bcrypt
import jwt as pyjwt
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "sphen-digital-backend"}

ADMIN_KEY = os.environ.get('ADMIN_KEY', '')
OWNER_EMAIL = os.environ.get('OWNER_EMAIL', '')
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]

logger = logging.getLogger(__name__)

LEAD_STATUSES = ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"]


def clean(value: Optional[str], max_len: int = 500) -> Optional[str]:
    if value is None:
        return None
    v = re.sub(r"[<>]", "", str(value)).strip()
    return v[:max_len] if v else None


async def send_email(recipient: str, subject: str, html: str, reply_to: Optional[str] = None):
    payload = {"to": [recipient], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to:
        payload["contact_email"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=30) as http:
            resp = await http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        logger.info(f"Email sent to {recipient}: {resp.json().get('id')}")
    except Exception as e:
        logger.error(f"Email send failed to {recipient}: {e}")


def owner_email_html(lead: dict) -> str:
    rows = "".join(
        f'<tr><td style="padding:8px 12px;color:#8b8b9e;font-size:13px;">{label}</td>'
        f'<td style="padding:8px 12px;color:#ffffff;font-size:13px;font-weight:600;">{value or "—"}</td></tr>'
        for label, value in [
            ("Name", lead.get("name")), ("Phone", lead.get("phone")), ("Email", lead.get("email")),
            ("Company", lead.get("company")), ("Business Type", lead.get("business_type")),
            ("Interested Service", lead.get("service")), ("Budget", lead.get("budget")),
            ("Message", lead.get("message")), ("Submitted From", lead.get("source_page")),
            ("Date & Time", lead.get("created_at")),
        ]
    )
    return f'''
    <div style="background:#050505;padding:32px;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#121214;border:1px solid #2a2a35;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(90deg,#6D3BFF,#FF8A3D);padding:18px 24px;">
          <span style="color:#fff;font-size:18px;font-weight:800;">SPHEN DIGITAL</span>
        </div>
        <div style="padding:24px;">
          <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">New Lead Received</h2>
          <table style="width:100%;border-collapse:collapse;background:#0b0b10;border-radius:12px;">{rows}</table>
        </div>
      </div>
    </div>'''


def autoreply_email_html(name: str) -> str:
    return f'''
    <div style="background:#050505;padding:32px;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#121214;border:1px solid #2a2a35;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(90deg,#6D3BFF,#FF8A3D);padding:18px 24px;">
          <span style="color:#fff;font-size:18px;font-weight:800;">SPHEN DIGITAL</span>
        </div>
        <div style="padding:28px 24px;color:#d7d7e0;font-size:14px;line-height:1.7;">
          <p style="font-size:16px;color:#fff;">Hi {name},</p>
          <p>Thank you for contacting <strong style="color:#a78bfa;">SPHEN DIGITAL</strong>.</p>
          <p>We've successfully received your request. One of our marketing experts will contact you shortly.</p>
          <p>Meanwhile, feel free to explore our services.</p>
          <p style="margin-top:24px;">Regards,<br/><strong style="color:#fff;">SPHEN DIGITAL</strong><br/>
          <span style="color:#8b8b9e;">Ideas That Move Markets.</span></p>
          <p style="color:#8b8b9e;font-size:13px;">Phone: +91 8595110551<br/>Email: info@sphendigital.com</p>
        </div>
      </div>
    </div>'''


class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    business_type: Optional[str] = None
    service: Optional[str] = None
    budget: Optional[str] = None
    message: Optional[str] = None
    source_page: str = "contact"
    status: str = "New"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=20)
    company: Optional[str] = Field(default=None, max_length=120)
    business_type: Optional[str] = Field(default=None, max_length=80)
    service: Optional[str] = Field(default=None, max_length=120)
    budget: Optional[str] = Field(default=None, max_length=80)
    message: Optional[str] = Field(default=None, max_length=2000)
    source_page: Optional[str] = Field(default="contact", max_length=60)


class NewsletterCreate(BaseModel):
    email: EmailStr


submit_attempts = {}
login_attempts = {}


def rate_limited(bucket: dict, key: str, max_hits: int, window_sec: int) -> bool:
    now = datetime.now(timezone.utc).timestamp()
    hits = [t for t in bucket.get(key, []) if now - t < window_sec]
    bucket[key] = hits
    if len(hits) >= max_hits:
        return True
    hits.append(now)
    return False


@api_router.get("/")
async def root():
    return {"message": "SPHEN DIGITAL API — Ideas That Move Markets."}


@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate, request: Request):
    ip = request.client.host if request.client else "unknown"
    if rate_limited(submit_attempts, ip, 5, 600):
        raise HTTPException(status_code=429, detail="Too many submissions. Please try again in a few minutes.")
    data = input.model_dump()
    for key in ("name", "phone", "company", "business_type", "service", "budget", "message", "source_page"):
        data[key] = clean(data.get(key), 2000 if key == "message" else 150)
    if data.get("phone") and not re.match(r"^[+\d][\d\s\-()]{5,19}$", data["phone"]):
        raise HTTPException(status_code=422, detail="Invalid phone number")
    lead = Lead(**data)
    await db.website_leads.insert_one(lead.model_dump())
    lead_dict = lead.model_dump()
    asyncio.create_task(send_email(OWNER_EMAIL, "🚀 New Website Lead - SPHEN DIGITAL", owner_email_html(lead_dict), reply_to=lead.email))
    asyncio.create_task(send_email(lead.email, "Thanks for contacting SPHEN DIGITAL 💜", autoreply_email_html(lead.name)))
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(x_admin_key: Optional[str] = Header(default=None)):
    if not ADMIN_KEY or x_admin_key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    leads = await db.website_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return leads


@api_router.post("/newsletter")
async def subscribe_newsletter(input: NewsletterCreate):
    existing = await db.newsletter.find_one({"email": input.email}, {"_id": 0})
    if existing:
        return {"success": True, "message": "Already subscribed"}
    await db.newsletter.insert_one({
        "id": str(uuid.uuid4()),
        "email": input.email,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    asyncio.create_task(send_email(OWNER_EMAIL, "🚀 New Website Lead - SPHEN DIGITAL", owner_email_html({
        "name": "Newsletter Subscriber", "email": input.email, "source_page": "newsletter",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }), reply_to=input.email))
    return {"success": True, "message": "Subscribed"}


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_admin_token(email: str) -> str:
    payload = {"sub": email, "type": "admin", "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def require_admin(request: Request) -> str:
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "admin":
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload["sub"]
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class AdminLoginReq(BaseModel):
    email: EmailStr
    password: str


@api_router.post("/admin/login")
async def admin_login(input: AdminLoginReq, request: Request):
    ip = request.client.host if request.client else "unknown"
    if rate_limited(login_attempts, f"{ip}:{input.email.lower()}", 5, 900):
        raise HTTPException(status_code=429, detail="Too many failed attempts. Locked for 15 minutes.")
    user = await db.users.find_one({"email": input.email.lower(), "role": "admin"})
    if not user or not verify_password(input.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    login_attempts.pop(f"{ip}:{input.email.lower()}", None)
    return {"token": create_admin_token(user["email"]), "email": user["email"], "name": user.get("name", "Admin")}


@api_router.get("/admin/me")
async def admin_me(request: Request):
    email = require_admin(request)
    return {"email": email}


@api_router.get("/admin/leads")
async def admin_leads(request: Request, search: str = "", status: str = "", source: str = ""):
    require_admin(request)
    query = {}
    if status and status in LEAD_STATUSES:
        query["status"] = status
    if source:
        query["source_page"] = source
    if search:
        regex = {"$regex": re.escape(search), "$options": "i"}
        query["$or"] = [{"name": regex}, {"email": regex}, {"phone": regex}, {"company": regex}]
    leads = await db.website_leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return leads


class StatusUpdateReq(BaseModel):
    status: str


@api_router.patch("/admin/leads/{lead_id}")
async def admin_update_lead(lead_id: str, input: StatusUpdateReq, request: Request):
    require_admin(request)
    if input.status not in LEAD_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.website_leads.update_one({"id": lead_id}, {"$set": {"status": input.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"success": True}


@api_router.delete("/admin/leads/{lead_id}")
async def admin_delete_lead(lead_id: str, request: Request):
    require_admin(request)
    result = await db.website_leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"success": True}


@api_router.get("/admin/leads-export")
async def admin_export_leads(request: Request):
    require_admin(request)
    leads = await db.website_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Date", "Name", "Phone", "Email", "Company", "Business", "Service", "Budget", "Message", "Source", "Status"])
    for l in leads:
        writer.writerow([l.get("created_at"), l.get("name"), l.get("phone"), l.get("email"), l.get("company"),
                         l.get("business_type"), l.get("service"), l.get("budget"), l.get("message"),
                         l.get("source_page"), l.get("status")])
    return PlainTextResponse(
        output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sphen_leads.csv"},
    )


@api_router.get("/admin/stats")
async def admin_stats(request: Request):
    require_admin(request)
    leads = await db.website_leads.find({}, {"_id": 0, "created_at": 1, "status": 1, "name": 1, "email": 1, "service": 1, "source_page": 1}).sort("created_at", -1).to_list(5000)
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    def parse(l):
        try:
            return datetime.fromisoformat(l["created_at"])
        except Exception:
            return now

    today = sum(1 for l in leads if parse(l) >= today_start)
    week = sum(1 for l in leads if parse(l) >= today_start - timedelta(days=7))
    month = sum(1 for l in leads if parse(l) >= today_start - timedelta(days=30))
    daily = []
    for i in range(13, -1, -1):
        day = (today_start - timedelta(days=i)).date().isoformat()
        daily.append({"date": day[5:], "count": sum(1 for l in leads if parse(l).date().isoformat() == day)})
    by_status = {s: sum(1 for l in leads if l.get("status") == s) for s in LEAD_STATUSES}
    by_source = {}
    for l in leads:
        by_source[l.get("source_page", "contact")] = by_source.get(l.get("source_page", "contact"), 0) + 1
    return {
        "total": len(leads), "today": today, "week": week, "month": month,
        "daily": daily, "by_status": by_status, "by_source": by_source,
        "latest": leads[:6],
    }


PLANS = {
    "starter": {"name": "Starter Plan", "amount": 6500.0},
    "growth": {"name": "Growth Plan", "amount": 10000.0},
    "premium": {"name": "Premium Plan", "amount": 15000.0},
}


class StripeCheckoutReq(BaseModel):
    package_id: str
    origin_url: str


def _stripe(request: Request) -> StripeCheckout:
    host_url = str(request.base_url)
    return StripeCheckout(
        api_key=os.environ["STRIPE_API_KEY"],
        webhook_url=f"{host_url}api/webhook/stripe",
    )


@api_router.post("/payments/stripe/checkout")
async def create_stripe_checkout(input: StripeCheckoutReq, request: Request):
    pkg = PLANS.get(input.package_id)
    if not pkg:
        raise HTTPException(status_code=400, detail="Unknown package")
    stripe_checkout = _stripe(request)
    session = await stripe_checkout.create_checkout_session(CheckoutSessionRequest(
        amount=pkg["amount"],
        currency="inr",
        success_url=f"{input.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{input.origin_url}/payment/cancel",
        metadata={"package_id": input.package_id, "package_name": pkg["name"], "gateway": "stripe"},
    ))
    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "package_id": input.package_id,
        "package_name": pkg["name"],
        "amount": pkg["amount"],
        "currency": "inr",
        "gateway": "stripe",
        "status": "initiated",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"checkout_url": session.url, "session_id": session.session_id}


@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, request: Request):
    record = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if record.get("payment_status") != "paid":
        try:
            status = await _stripe(request).get_checkout_status(session_id)
            if status.payment_status == "paid":
                await db.payment_transactions.update_one(
                    {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                    {"$set": {"status": "completed", "payment_status": "paid",
                              "updated_at": datetime.now(timezone.utc).isoformat()}},
                )
                record = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        except Exception:
            pass
    return {"session_id": record["session_id"], "status": record["status"], "payment_status": record["payment_status"]}


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    try:
        response = await _stripe(request).handle_webhook(body, request.headers.get("Stripe-Signature", ""))
    except Exception:
        raise HTTPException(status_code=400, detail="Webhook error")
    if response.event_type == "checkout.session.completed" and response.payment_status == "paid":
        await db.payment_transactions.update_one(
            {"session_id": response.session_id, "payment_status": {"$ne": "paid"}},
            {"$set": {"status": "completed", "payment_status": "paid",
                      "updated_at": datetime.now(timezone.utc).isoformat()}},
        )
    return {"status": "ok"}


RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "")
razorpay_client = (
    razorpay_sdk.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
    else None
)


@api_router.get("/payments/config")
async def payments_config():
    return {
        "stripe": True,
        "razorpay": razorpay_client is not None,
        "razorpay_key_id": RAZORPAY_KEY_ID or None,
    }


class RazorpayOrderReq(BaseModel):
    package_id: str


@api_router.post("/razorpay/create-order")
async def create_razorpay_order(input: RazorpayOrderReq):
    if not razorpay_client:
        raise HTTPException(status_code=503, detail="Razorpay is not configured yet")
    pkg = PLANS.get(input.package_id)
    if not pkg:
        raise HTTPException(status_code=400, detail="Unknown package")
    order = razorpay_client.order.create({
        "amount": int(pkg["amount"] * 100),
        "currency": "INR",
        "payment_capture": 1,
        "receipt": f"sphen_{uuid.uuid4().hex[:12]}",
        "notes": {"package_id": input.package_id, "package_name": pkg["name"]},
    })
    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "order_id": order["id"],
        "package_id": input.package_id,
        "package_name": pkg["name"],
        "amount": pkg["amount"],
        "currency": "inr",
        "gateway": "razorpay",
        "status": "initiated",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })
    return {
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
        "key_id": RAZORPAY_KEY_ID,
        "package_name": pkg["name"],
    }


class RazorpayVerifyReq(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@api_router.post("/razorpay/verify")
async def verify_razorpay_payment(input: RazorpayVerifyReq):
    if not razorpay_client:
        raise HTTPException(status_code=503, detail="Razorpay is not configured yet")
    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": input.razorpay_order_id,
            "razorpay_payment_id": input.razorpay_payment_id,
            "razorpay_signature": input.razorpay_signature,
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    await db.payment_transactions.update_one(
        {"order_id": input.razorpay_order_id, "payment_status": {"$ne": "paid"}},
        {"$set": {"status": "completed", "payment_status": "paid",
                  "razorpay_payment_id": input.razorpay_payment_id,
                  "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    return {"status": "paid"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    admin_email = os.environ.get("ADMIN_EMAIL", "").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    if admin_email and admin_password:
        existing = await db.users.find_one({"email": admin_email})
        if not existing:
            await db.users.insert_one({
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "SPHEN Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        elif not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
