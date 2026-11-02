import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Send, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { toast } from "sonner";
import { SectionHead } from "./SectionHead";
import { Penguin } from "./Penguin";
import { SuccessView } from "./LeadFormModal";
import { submitLead } from "../lib/api";
import { sound } from "../lib/sound";

const details = [
    { icon: Phone, label: "Phone", value: "+91 8595110551", href: "tel:+918595110551", testId: "contact-phone-link" },
    { icon: Mail, label: "Email", value: "info@sphendigital.com", href: "mailto:info@sphendigital.com", testId: "contact-email-link" },
    { icon: MapPin, label: "Location", value: "27-28, Phase IV, Udyog Vihar, Sector 18, Gurugram, Haryana 122015", href: null, testId: "contact-location" },
];

const inputCls = "w-full rounded-2xl bg-white/[0.05] border border-white/10 px-5 py-3.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-sphen-purple focus:shadow-[0_0_25px_rgba(109,59,255,0.25)] transition-[border-color,box-shadow] duration-300";

export const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", business_type: "", service: "", budget: "", message: "" });
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        const onPlan = (e) => setForm((f) => ({ ...f, service: `${e.detail} Plan` }));
        window.addEventListener("select-plan", onPlan);
        return () => window.removeEventListener("select-plan", onPlan);
    }, []);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await submitLead({ ...form, source_page: "contact" });
            setDone(true);
            sound.success();
            toast.success("Message sent! SPHEN is celebrating — we'll reach out within 24 hours.");
        } catch {
            toast.error("Something went wrong. Please try WhatsApp or call us directly.");
        } finally {
            setSending(false);
        }
    };

    return (
        <section id="contact" data-testid="contact-section" className="relative py-16 sm:py-28 lg:py-36 overflow-hidden noise bg-[#070709]">
            <div className="absolute -top-40 left-1/3 w-[560px] h-[560px] rounded-full bg-sphen-purple/12 blur-[170px]" />
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <SectionHead
                    testId="contact-heading"
                    kicker="Contact"
                    title="Let's Build Something"
                    accent="Amazing Together."
                    sub="Tell us where you are. We'll show you how far you can go."
                />
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-5"
                    >
                        {details.map((d) => {
                            const Inner = (
                                <>
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sphen-purple/30 to-sphen-orange/15 border border-white/10 flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500">
                                        <d.icon size={20} className="text-sphen-orange" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{d.label}</p>
                                        <p className="text-base font-semibold text-white mt-0.5">{d.value}</p>
                                    </div>
                                </>
                            );
                            return d.href ? (
                                <a key={d.label} href={d.href} data-testid={d.testId} className="group glass rounded-3xl p-5 flex items-center gap-4 hover:border-sphen-purple/50 transition-colors duration-500">
                                    {Inner}
                                </a>
                            ) : (
                                <div key={d.label} data-testid={d.testId} className="group glass rounded-3xl p-5 flex items-center gap-4">
                                    {Inner}
                                </div>
                            );
                        })}
                        <div className="glass rounded-3xl p-6 flex items-center justify-between">
                            <div>
                                <p className="font-display font-bold text-white">Follow the penguin</p>
                                <div className="flex gap-3 mt-3">
                                    {[
                                        { Icon: Instagram, href: "https://instagram.com/sphendigital", id: "contact-social-instagram" },
                                        { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61592640367989", id: "contact-social-facebook" },
                                        { Icon: Linkedin, href: "https://linkedin.com/company/sphendigital", id: "contact-social-linkedin" },
                                        { Icon: Youtube, href: "https://youtube.com/@sphendigital", id: "contact-social-youtube" },
                                    ].map(({ Icon, href, id }) => (
                                        <a key={id} href={href} target="_blank" rel="noreferrer" data-testid={id} aria-label={id} className="w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white/70 hover:text-white hover:border-sphen-orange/60 hover:-translate-y-1 hover:rotate-6 transition-all duration-300">
                                            <Icon size={17} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <Penguin pose={typing ? "type" : "point"} size={110} glow={false} />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        className="glass-strong rounded-[28px] p-7 sm:p-10 relative overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {done ? (
                                <SuccessView
                                    testId="contact-success"
                                    onClose={() => { setDone(false); setForm({ name: "", email: "", phone: "", company: "", business_type: "", service: "", budget: "", message: "" }); }}
                                />
                            ) : (
                                <motion.form key="form" data-testid="contact-form" onSubmit={onSubmit} onKeyDown={() => { if (sound.throttled("key", 80)) sound.key(); }} onFocusCapture={() => setTyping(true)} onBlurCapture={() => setTyping(false)} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <input data-testid="contact-name-input" required placeholder="Your Name *" value={form.name} onChange={set("name")} className={inputCls} />
                                        <input data-testid="contact-email-input" required type="email" placeholder="Email Address *" value={form.email} onChange={set("email")} className={inputCls} />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <input data-testid="contact-phone-input" placeholder="Phone Number" value={form.phone} onChange={set("phone")} className={inputCls} />
                                        <input data-testid="contact-company-input" placeholder="Company Name" value={form.company} onChange={set("company")} className={inputCls} />
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <select data-testid="contact-business-type-select" value={form.business_type} onChange={set("business_type")} className={`${inputCls} appearance-none [&>option]:bg-[#121214]`}>
                                            <option value="">Business Type</option>
                                            <option>Startup</option>
                                            <option>Small Business</option>
                                            <option>E-commerce / D2C</option>
                                            <option>Enterprise</option>
                                            <option>Personal Brand</option>
                                            <option>Other</option>
                                        </select>
                                        <select data-testid="contact-service-select" value={form.service} onChange={set("service")} className={`${inputCls} appearance-none [&>option]:bg-[#121214]`}>
                                            <option value="">I'm interested in…</option>
                                            <option>Starter Plan</option>
                                            <option>Growth Plan</option>
                                            <option>Premium Plan</option>
                                            <option>Social Media Management</option>
                                            <option>Branding & Design</option>
                                            <option>Meta / Google Ads</option>
                                            <option>Website Development</option>
                                            <option>SEO</option>
                                            <option>Something Else</option>
                                        </select>
                                        <select data-testid="contact-budget-select" value={form.budget} onChange={set("budget")} className={`${inputCls} appearance-none [&>option]:bg-[#121214]`}>
                                            <option value="">Monthly Budget</option>
                                            <option>Under ₹10,000</option>
                                            <option>₹10,000 – ₹25,000</option>
                                            <option>₹25,000 – ₹50,000</option>
                                            <option>₹50,000+</option>
                                        </select>
                                    </div>
                                    <textarea data-testid="contact-message-input" rows={4} placeholder="Tell us about your business and goals…" value={form.message} onChange={set("message")} className={`${inputCls} resize-none`} />
                                    <button
                                        data-testid="contact-submit-button"
                                        disabled={sending}
                                        className="group mt-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-sphen-purple to-[#8b5cf6] py-4 text-base font-bold text-white glow-purple hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(109,59,255,0.55)] active:scale-95 transition-all duration-300 disabled:opacity-60"
                                    >
                                        {sending ? "Sending…" : "Send Message"}
                                        <Send size={17} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
