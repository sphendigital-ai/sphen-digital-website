import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Home } from "lucide-react";
import { toast } from "sonner";
import { Penguin } from "./Penguin";
import { Confetti } from "./Confetti";
import { submitLead } from "../lib/api";
import { sound } from "../lib/sound";

const WHATSAPP_URL = "https://wa.me/918595110551?text=" + encodeURIComponent("Hello SPHEN DIGITAL,\n\nI have just submitted the website inquiry.\n\nI'd like to discuss my project.");

const inputCls = "w-full rounded-2xl bg-white/[0.05] border border-white/10 px-5 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-sphen-purple transition-colors";

export const SuccessView = ({ onClose, testId = "lead-success" }) => (
    <motion.div
        data-testid={testId}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 15 }}
        className="relative flex flex-col items-center text-center py-6"
    >
        <Confetti count={32} />
        <Penguin pose="celebrate" size={150} />
        <h3 className="font-display text-3xl font-extrabold text-white mt-3">🎉 Thank You!</h3>
        <p className="text-white/55 mt-3 max-w-xs text-sm leading-relaxed">Your request has been received. Our team will contact you shortly.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
                data-testid={`${testId}-go-home`}
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-full glass-strong px-6 py-3 text-sm font-bold text-white hover:border-sphen-purple/60 transition-colors"
            >
                <Home size={15} /> Go Home
            </button>
            <a
                data-testid={`${testId}-whatsapp`}
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(37,211,102,0.4)] hover:scale-105 transition-transform"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm4.45 12.03c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.5.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.21.88 2.37 1 2.53.12.16 1.72 2.63 4.18 3.69 2.46 1.06 2.96.71 3.5.66.53-.05 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28z"/></svg>
                Chat on WhatsApp
            </a>
        </div>
    </motion.div>
);

export const LeadFormModal = ({ config, onClose }) => {
    const [form, setForm] = useState({
        name: "", email: "", phone: "", company: "",
        business_type: "", service: config.defaultService || "", budget: "", message: "",
    });
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        const payload = { ...form, source_page: config.source };
        try {
            await submitLead(payload);
        } catch {
            try {
                await submitLead(payload);
            } catch {
                toast.error("Something went wrong. Please try WhatsApp or call us directly.");
                setSending(false);
                return;
            }
        }
        setSending(false);
        setDone(true);
        sound.success();
    };

    return (
        <AnimatePresence>
            <motion.div
                data-testid="lead-form-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[960] flex items-center justify-center p-4 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.85, y: 40 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg glass-strong rounded-[28px] p-6 sm:p-8 my-8"
                >
                    <button data-testid="lead-form-modal-close" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white z-10">
                        <X size={16} />
                    </button>
                    {done ? (
                        <SuccessView onClose={onClose} />
                    ) : (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                <Penguin pose="point" size={64} glow={false} />
                                <div>
                                    <h3 className="font-display text-2xl font-extrabold text-white">{config.title}</h3>
                                    <p className="text-sm text-white/50 mt-0.5">{config.subtitle}</p>
                                </div>
                            </div>
                            <form data-testid="lead-modal-form" onSubmit={onSubmit} className="flex flex-col gap-3">
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <input data-testid="lead-modal-name" required placeholder="Your Name *" value={form.name} onChange={set("name")} className={inputCls} />
                                    <input data-testid="lead-modal-email" required type="email" placeholder="Email Address *" value={form.email} onChange={set("email")} className={inputCls} />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <input data-testid="lead-modal-phone" placeholder="Phone / WhatsApp" value={form.phone} onChange={set("phone")} className={inputCls} />
                                    <input data-testid="lead-modal-company" placeholder="Company Name" value={form.company} onChange={set("company")} className={inputCls} />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {config.showBusinessType && (
                                        <select data-testid="lead-modal-business-type" value={form.business_type} onChange={set("business_type")} className={`${inputCls} appearance-none [&>option]:bg-[#121214]`}>
                                            <option value="">Business Type</option>
                                            <option>Startup</option>
                                            <option>Small Business</option>
                                            <option>E-commerce / D2C</option>
                                            <option>Enterprise</option>
                                            <option>Personal Brand</option>
                                            <option>Other</option>
                                        </select>
                                    )}
                                    <select data-testid="lead-modal-service" value={form.service} onChange={set("service")} className={`${inputCls} appearance-none [&>option]:bg-[#121214]`}>
                                        <option value="">Interested Service</option>
                                        <option>Starter Plan</option>
                                        <option>Growth Plan</option>
                                        <option>Premium Plan</option>
                                        <option>Social Media Management</option>
                                        <option>Branding & Design</option>
                                        <option>Meta / Google Ads</option>
                                        <option>Website Development</option>
                                        <option>SEO</option>
                                        <option>Full Marketing</option>
                                    </select>
                                    {config.showBudget && (
                                        <select data-testid="lead-modal-budget" value={form.budget} onChange={set("budget")} className={`${inputCls} appearance-none [&>option]:bg-[#121214]`}>
                                            <option value="">Monthly Budget</option>
                                            <option>Under ₹10,000</option>
                                            <option>₹10,000 – ₹25,000</option>
                                            <option>₹25,000 – ₹50,000</option>
                                            <option>₹50,000+</option>
                                        </select>
                                    )}
                                </div>
                                <textarea data-testid="lead-modal-message" rows={3} placeholder="Tell us about your project…" value={form.message} onChange={set("message")} className={`${inputCls} resize-none`} />
                                <button
                                    data-testid="lead-modal-submit"
                                    disabled={sending}
                                    className="mt-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-sphen-purple to-[#8b5cf6] py-3.5 text-sm font-bold text-white glow-purple hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-60"
                                >
                                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                                    {sending ? "Sending…" : "Submit Request"}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export const openLeadModal = (config) => window.dispatchEvent(new CustomEvent("open-lead-modal", { detail: config }));
