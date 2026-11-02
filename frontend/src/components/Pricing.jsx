import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Star } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { Penguin } from "./Penguin";
import { Confetti } from "./Confetti";
import { PaymentModal } from "./PaymentModal";
import { openLeadModal } from "./LeadFormModal";

const plans = [
    {
        id: "starter",
        name: "Starter",
        price: "₹6,500",
        tagline: "Perfect for startups.",
        cta: "Get Started",
        popular: false,
        features: ["Social Media Management", "12 Creative Posts", "12 Stories", "Content Writing", "Basic Branding Support", "Monthly Report"],
    },
    {
        id: "growth",
        name: "Growth",
        price: "₹10,000",
        tagline: "Everything in Starter plus:",
        cta: "Grow My Business",
        popular: true,
        features: ["Social Media Management", "Meta Ads Management", "Campaign Optimization", "Audience Research", "Creative Designs", "Performance Reports", "Priority Support"],
    },
    {
        id: "premium",
        name: "Premium",
        price: "₹15,000",
        tagline: "Complete Marketing Solution",
        cta: "Let's Scale",
        popular: false,
        features: ["Social Media Management", "Meta Ads", "Google Ads", "Branding", "Graphic Designing", "Content Strategy", "SEO Basics", "Website Support", "Monthly Growth Report", "Dedicated Account Manager"],
    },
];

export const Pricing = () => {
    const [hovered, setHovered] = useState(null);
    const [payPlan, setPayPlan] = useState(null);
    const premiumRef = useRef(null);
    const premiumInView = useInView(premiumRef, { once: true, margin: "-120px" });

    const mascotFor = (p) => {
        if (hovered === p.name) return "thumbsup";
        if (p.name === "Starter") return "point";
        if (p.name === "Growth") return "celebrate";
        return "celebrate";
    };

    return (
        <section id="pricing" data-testid="pricing-section" className="relative py-16 sm:py-28 lg:py-36 overflow-hidden noise">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-sphen-purple/12 blur-[170px]" />
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <SectionHead
                    testId="pricing-heading"
                    kicker="Pricing"
                    title="Simple Pricing."
                    accent="Powerful Results."
                    sub="No hidden costs. No lock-ins. Just growth, month after month."
                />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 items-stretch max-w-6xl mx-auto">
                    {plans.map((p, i) => (
                        <motion.div
                            key={p.name}
                            data-testid={`pricing-card-${p.name.toLowerCase()}`}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -12, scale: p.popular ? 1.03 : 1.02 }}
                            onHoverStart={() => setHovered(p.name)}
                            onHoverEnd={() => setHovered(null)}
                            ref={p.name === "Premium" ? premiumRef : undefined}
                            className={`group relative rounded-[28px] p-8 flex flex-col backdrop-blur-2xl transition-shadow duration-500 ${i === 2 ? "md:col-span-2 lg:col-span-1 md:max-w-xl md:w-full md:mx-auto lg:max-w-none" : ""} ${
                                p.popular
                                    ? "bg-white/[0.07] border-2 border-sphen-purple shadow-[0_0_70px_rgba(109,59,255,0.4)] lg:-my-5 lg:py-12 z-10"
                                    : "bg-white/[0.04] border border-white/10 hover:border-white/25 hover:shadow-[0_0_50px_rgba(109,59,255,0.2)]"
                            }`}
                        >
                            <div data-testid={`pricing-mascot-${p.name.toLowerCase()}`} className={`absolute ${p.popular ? "-top-[86px]" : "-top-[72px]"} right-4 hidden sm:block`}>
                                <Penguin pose={mascotFor(p)} size={p.popular ? 96 : 82} glow={false} />
                            </div>
                            {p.name === "Premium" && premiumInView && <Confetti count={24} />}
                            {p.popular && (
                                <span data-testid="pricing-popular-badge" className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sphen-purple to-sphen-orange px-4 py-1.5 text-xs font-bold tracking-wide text-white glow-purple whitespace-nowrap">
                                    <Star size={12} fill="currentColor" /> MOST POPULAR
                                </span>
                            )}
                            <h3 className="font-display text-xl font-bold text-white">{p.name} Plan</h3>
                            <p className="text-sm text-white/50 mt-1">{p.tagline}</p>
                            <div className="mt-6 flex items-end gap-1.5">
                                <span className={`font-display text-5xl font-extrabold tracking-tight ${p.popular ? "text-gradient" : "text-white"}`}>{p.price}</span>
                                <span className="text-white/45 text-sm mb-1.5">/month</span>
                            </div>
                            <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <ul className="flex flex-col gap-3.5 flex-1">
                                {p.features.map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                                        <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${p.popular ? "bg-sphen-purple/30" : "bg-white/8"}`}>
                                            <Check size={12} className={p.popular ? "text-sphen-purple" : "text-sphen-orange"} strokeWidth={3} />
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                data-testid={`pricing-cta-${p.name.toLowerCase()}`}
                                onClick={() => setPayPlan(p)}
                                className={`mt-8 w-full rounded-full py-3.5 text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-95 group-hover:animate-pulse-ring ${
                                    p.popular
                                        ? "bg-gradient-to-r from-sphen-purple to-[#8b5cf6] text-white glow-purple hover:shadow-[0_0_50px_rgba(109,59,255,0.6)]"
                                        : "glass-strong text-white hover:border-sphen-orange/60 hover:glow-orange"
                                }`}
                            >
                                {p.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-12 text-center"
                >
                    <p className="text-white/45 text-sm mb-3">Not sure which plan fits your business?</p>
                    <button
                        data-testid="estimator-cta-button"
                        onClick={() => openLeadModal({ source: "project_estimator", title: "Project Estimator", subtitle: "Tell us about your project — get a free estimate in 24 hours.", showBudget: true, showBusinessType: true })}
                        className="inline-flex items-center gap-2 rounded-full glass-strong px-7 py-3.5 text-sm font-bold text-white hover:border-sphen-orange/60 hover:glow-orange hover:scale-105 active:scale-95 transition-all"
                    >
                        Get a Free Project Estimate
                    </button>
                </motion.div>
            </div>
            {payPlan && <PaymentModal plan={payPlan} onClose={() => setPayPlan(null)} />}
        </section>
    );
};
