import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Smartphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Penguin } from "./Penguin";
import { Confetti } from "./Confetti";
import { createStripeCheckout, getPaymentConfig, createRazorpayOrder, verifyRazorpayPayment } from "../lib/api";
import { openLeadModal } from "./LeadFormModal";

const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });

export const PaymentModal = ({ plan, onClose }) => {
    const [loading, setLoading] = useState("");
    const [paid, setPaid] = useState(false);
    const [config, setConfig] = useState(null);

    useEffect(() => {
        getPaymentConfig().then(({ data }) => setConfig(data)).catch(() => setConfig({ razorpay: false }));
    }, []);

    if (!plan) return null;

    const payStripe = async () => {
        setLoading("stripe");
        try {
            const { data } = await createStripeCheckout(plan.id);
            window.location.href = data.checkout_url;
        } catch {
            toast.error("Could not start Stripe checkout. Please try again.");
            setLoading("");
        }
    };

    const payRazorpay = async () => {
        setLoading("razorpay");
        try {
            const ok = await loadRazorpayScript();
            if (!ok) throw new Error("script");
            const { data } = await createRazorpayOrder(plan.id);
            const rzp = new window.Razorpay({
                key: data.key_id,
                amount: data.amount,
                currency: data.currency,
                order_id: data.order_id,
                name: "SPHEN DIGITAL",
                description: `${data.package_name} — Monthly Plan`,
                theme: { color: "#6D3BFF" },
                modal: { ondismiss: () => setLoading("") },
                handler: async (resp) => {
                    try {
                        await verifyRazorpayPayment(resp);
                        setPaid(true);
                        toast.success("Payment successful! Welcome aboard.");
                    } catch {
                        toast.error("Payment verification failed. Contact us if money was deducted.");
                    } finally {
                        setLoading("");
                    }
                },
            });
            rzp.open();
        } catch {
            toast.error("Could not start Razorpay checkout. Please try Stripe instead.");
            setLoading("");
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                data-testid="payment-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[960] flex items-center justify-center p-5 bg-black/75 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.85, y: 40 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md glass-strong rounded-[30px] p-8 pt-16"
                >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <Penguin pose={paid ? "celebrate" : "point"} size={96} />
                    </div>
                    <button data-testid="payment-modal-close" onClick={onClose} aria-label="Close payment" className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white">
                        <X size={16} />
                    </button>
                    {paid ? (
                        <div data-testid="razorpay-success" className="text-center relative">
                            <Confetti count={30} />
                            <h3 className="font-display text-2xl font-extrabold text-white mt-2">Payment Successful!</h3>
                            <p className="text-sm text-white/55 mt-3">Welcome to the {plan.name} Plan! Our team will reach out within 24 hours to kick things off.</p>
                            <button
                                data-testid="razorpay-success-close"
                                onClick={onClose}
                                className="mt-6 rounded-full bg-gradient-to-r from-sphen-purple to-[#8b5cf6] px-7 py-3 text-sm font-bold text-white glow-purple hover:scale-105 transition-transform"
                            >
                                Let's Grow
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center">
                                <p className="text-xs uppercase tracking-[0.25em] text-sphen-orange font-semibold">Checkout</p>
                                <h3 className="font-display text-2xl font-extrabold text-white mt-2">{plan.name} Plan</h3>
                                <p className="mt-2">
                                    <span className="font-display text-4xl font-extrabold text-gradient">{plan.price}</span>
                                    <span className="text-white/45 text-sm"> /month</span>
                                </p>
                            </div>
                            <div className="mt-7 flex flex-col gap-3">
                                <button
                                    data-testid="pay-with-stripe-button"
                                    onClick={payStripe}
                                    disabled={!!loading}
                                    className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sphen-purple to-[#8b5cf6] py-4 text-sm font-bold text-white glow-purple hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-60"
                                >
                                    {loading === "stripe" ? <Loader2 size={17} className="animate-spin" /> : <CreditCard size={17} />}
                                    Pay with Stripe — Cards
                                </button>
                                {config?.razorpay && (
                                    <button
                                        data-testid="pay-with-razorpay-button"
                                        onClick={payRazorpay}
                                        disabled={!!loading}
                                        className="w-full inline-flex items-center justify-center gap-3 rounded-2xl glass-strong py-4 text-sm font-bold text-white hover:border-sphen-orange/60 hover:glow-orange transition-all disabled:opacity-60"
                                    >
                                        {loading === "razorpay" ? <Loader2 size={17} className="animate-spin" /> : <Smartphone size={17} className="text-sphen-orange" />}
                                        Pay with Razorpay — UPI & Cards
                                    </button>
                                )}
                            </div>
                            <button
                                data-testid="payment-consult-instead"
                                onClick={() => { onClose(); openLeadModal({ source: "pricing_inquiry", title: "Pricing Inquiry", subtitle: `Ask us anything about the ${plan.name} Plan.`, defaultService: `${plan.name} Plan` }); }}
                                className="mt-5 w-full text-center text-xs text-white/45 hover:text-sphen-orange transition-colors"
                            >
                                Not ready to pay? Book a free consultation instead
                            </button>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
