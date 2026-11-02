import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHead } from "./SectionHead";

const faqs = [
    { q: "How soon will I see results?", a: "Social media and branding momentum builds within 30 days. Paid ads typically show measurable results in 2–4 weeks, and SEO compounds over 3–6 months. We set clear KPIs from day one." },
    { q: "Do you work with startups and small businesses?", a: "Absolutely — our Starter plan at ₹6,500/month was built exactly for that. You get premium agency output at a price that respects a startup runway." },
    { q: "What's included in the monthly reports?", a: "Reach, engagement, leads, ad spend efficiency (ROAS), top-performing content and next month's action plan — in a clean, jargon-free format." },
    { q: "Can I upgrade or cancel my plan anytime?", a: "Yes. Plans are month-to-month with no lock-ins. Upgrade, downgrade or pause with a quick message to your account manager." },
    { q: "Do you build websites too?", a: "Yes — fast, premium, conversion-focused websites are one of our twelve core services, and website support is included in the Premium plan." },
    { q: "What makes SPHEN DIGITAL different from other agencies?", a: "We combine creative design, performance marketing and AI-powered strategy under one roof — with transparent pricing, fast delivery and reports you'll actually understand." },
];

export const FAQ = () => {
    const [open, setOpen] = useState(0);

    return (
        <section id="faq" data-testid="faq-section" className="relative py-16 sm:py-28 lg:py-36 overflow-hidden noise">
            <div className="absolute top-0 -left-40 w-[440px] h-[440px] rounded-full bg-sphen-purple/10 blur-[150px]" />
            <div className="max-w-3xl mx-auto px-5 sm:px-8">
                <SectionHead
                    testId="faq-heading"
                    kicker="FAQ"
                    title="Questions?"
                    accent="Answered."
                />
                <div className="flex flex-col gap-4">
                    {faqs.map((f, i) => {
                        const isOpen = open === i;
                        return (
                            <motion.div
                                key={f.q}
                                data-testid={`faq-item-${i}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                                className={`glass rounded-2xl overflow-hidden transition-colors duration-500 ${isOpen ? "border-sphen-purple/50" : "hover:border-white/25"}`}
                            >
                                <button
                                    data-testid={`faq-trigger-${i}`}
                                    onClick={() => setOpen(isOpen ? -1 : i)}
                                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                                >
                                    <span className="font-display font-bold text-white text-base sm:text-lg">{f.q}</span>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isOpen ? "bg-sphen-purple text-white" : "bg-white/8 text-white/70"}`}
                                    >
                                        <Plus size={16} />
                                    </motion.span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: "easeInOut" }}
                                        >
                                            <p data-testid={`faq-answer-${i}`} className="px-6 pb-6 text-sm sm:text-base text-white/55 leading-relaxed">{f.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
