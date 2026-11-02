import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift } from "lucide-react";
import { toast } from "sonner";
import { Penguin } from "./Penguin";
import { submitLead } from "../lib/api";

export const LeadPopup = () => {
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("sphen_popup_seen")) return;
        const t = setTimeout(() => setShow(true), 14000);
        return () => clearTimeout(t);
    }, []);

    const close = () => {
        setShow(false);
        sessionStorage.setItem("sphen_popup_seen", "1");
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await submitLead({ ...form, source_page: "popup", message: "Free strategy call request (popup)" });
            toast.success("You're booked in! We'll call you within 24 hours.");
            close();
        } catch {
            toast.error("Something went wrong — try the contact form instead.");
        } finally {
            setSending(false);
        }
    };

    const inputCls = "w-full rounded-2xl bg-white/[0.06] border border-white/10 px-5 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-sphen-purple transition-colors";

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    data-testid="lead-popup"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[950] flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm"
                    onClick={close}
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.85, y: 40 }}
                        transition={{ type: "spring", stiffness: 180, damping: 18 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md glass-strong rounded-[30px] p-8 pt-14 shadow-[0_40px_120px_rgba(109,59,255,0.3)]"
                    >
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                            <Penguin pose="wave" size={100} />
                        </div>
                        <button data-testid="lead-popup-close-button" onClick={close} aria-label="Close popup" className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white">
                            <X size={16} />
                        </button>
                        <div className="text-center">
                            <span className="inline-flex items-center gap-2 rounded-full bg-sphen-orange/15 border border-sphen-orange/30 px-4 py-1.5 text-xs font-bold text-sphen-orange">
                                <Gift size={13} /> FREE STRATEGY CALL
                            </span>
                            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-4 tracking-tight">
                                Wait! Your Growth Plan is <span className="text-gradient">on the house.</span>
                            </h3>
                            <p className="text-sm text-white/55 mt-3">Get a free 30-minute marketing audit worth ₹4,999 — no strings attached.</p>
                        </div>
                        <form data-testid="lead-popup-form" onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
                            <input data-testid="lead-popup-name-input" required placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                            <input data-testid="lead-popup-email-input" required type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
                            <input data-testid="lead-popup-phone-input" placeholder="Phone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
                            <button
                                data-testid="lead-popup-submit-button"
                                disabled={sending}
                                className="mt-1 rounded-full bg-gradient-to-r from-sphen-purple to-sphen-orange py-3.5 text-sm font-bold text-white glow-purple hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-60"
                            >
                                {sending ? "Claiming…" : "Claim My Free Audit"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
