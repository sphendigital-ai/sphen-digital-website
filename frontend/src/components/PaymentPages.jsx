import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, XCircle } from "lucide-react";
import { Penguin } from "./Penguin";
import { Confetti } from "./Confetti";
import { getPaymentStatus } from "../lib/api";

export const PaymentSuccess = () => {
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");
    const [state, setState] = useState("verifying");

    useEffect(() => {
        if (!sessionId) {
            setState("failed");
            return;
        }
        let attempts = 0;
        const poll = async () => {
            try {
                const { data } = await getPaymentStatus(sessionId);
                if (data.payment_status === "paid") {
                    setState("paid");
                    return;
                }
            } catch { /* keep polling */ }
            attempts += 1;
            if (attempts < 12) setTimeout(poll, 2000);
            else setState("failed");
        };
        poll();
    }, [sessionId]);

    return (
        <div data-testid="payment-success-page" className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute w-[500px] h-[500px] rounded-full bg-sphen-purple/15 blur-[150px]" />
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 15 }}
                className="relative glass-strong rounded-[30px] p-10 max-w-md w-full text-center"
            >
                {state === "paid" && <Confetti count={36} />}
                <Penguin pose={state === "paid" ? "celebrate" : state === "failed" ? "idle" : "wave"} size={160} className="mx-auto" />
                {state === "verifying" && (
                    <>
                        <h1 className="font-display text-3xl font-extrabold text-white mt-5">Confirming Payment…</h1>
                        <p className="text-white/55 mt-3 flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> SPHEN is checking with Stripe</p>
                    </>
                )}
                {state === "paid" && (
                    <>
                        <h1 data-testid="payment-success-heading" className="font-display text-3xl font-extrabold text-white mt-5">Payment Successful!</h1>
                        <p className="text-white/55 mt-3">Welcome aboard! The SPHEN DIGITAL team will reach out within 24 hours to kick off your growth plan.</p>
                    </>
                )}
                {state === "failed" && (
                    <>
                        <h1 className="font-display text-3xl font-extrabold text-white mt-5">Couldn't Confirm</h1>
                        <p className="text-white/55 mt-3">If your payment went through, don't worry — contact us at +91 8595110551 and we'll sort it out.</p>
                    </>
                )}
                <Link
                    to="/"
                    data-testid="payment-success-home-button"
                    className="mt-7 inline-block rounded-full bg-gradient-to-r from-sphen-purple to-[#8b5cf6] px-7 py-3.5 text-sm font-bold text-white glow-purple hover:scale-105 transition-transform"
                >
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
};

export const PaymentCancel = () => (
    <div data-testid="payment-cancel-page" className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-sphen-orange/10 blur-[150px]" />
        <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 15 }}
            className="relative glass-strong rounded-[30px] p-10 max-w-md w-full text-center"
        >
            <Penguin pose="idle" size={150} className="mx-auto" />
            <XCircle size={32} className="text-sphen-orange mx-auto mt-4" />
            <h1 className="font-display text-3xl font-extrabold text-white mt-4">Payment Cancelled</h1>
            <p className="text-white/55 mt-3">No worries — nothing was charged. SPHEN will be right here whenever you're ready to grow.</p>
            <Link
                to="/"
                data-testid="payment-cancel-home-button"
                className="mt-7 inline-block rounded-full glass-strong px-7 py-3.5 text-sm font-bold text-white hover:border-sphen-purple/60 transition-colors"
            >
                Back to Home
            </Link>
        </motion.div>
    </div>
);
