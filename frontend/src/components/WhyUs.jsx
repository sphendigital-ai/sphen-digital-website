import { motion } from "framer-motion";
import { Target, Lightbulb, Wallet, Zap, HeartHandshake, BrainCircuit, BarChart3 } from "lucide-react";
import { SectionHead } from "./SectionHead";

const points = [
    { icon: Target, title: "Results Driven", text: "Every rupee tracked. Every campaign accountable to revenue." },
    { icon: Lightbulb, title: "Creative Ideas", text: "Work that wins attention in a 2-second-scroll world." },
    { icon: Wallet, title: "Affordable Pricing", text: "Premium agency output at startup-friendly pricing." },
    { icon: Zap, title: "Fast Delivery", text: "Tight turnarounds without ever cutting corners." },
    { icon: HeartHandshake, title: "Dedicated Support", text: "A real team that answers, adapts and cares." },
    { icon: BrainCircuit, title: "AI Marketing Solutions", text: "Machine-speed insights with human-grade creativity." },
    { icon: BarChart3, title: "Performance Reports", text: "Crystal-clear monthly reports you'll actually read." },
];

export const WhyUs = () => {
    return (
        <section id="why-us" data-testid="why-us-section" className="relative py-16 sm:py-28 lg:py-36 overflow-hidden noise">
            <div className="absolute top-0 left-1/3 w-[460px] h-[460px] rounded-full bg-sphen-purple/10 blur-[150px]" />
            <div className="max-w-5xl mx-auto px-5 sm:px-8">
                <SectionHead
                    testId="why-us-heading"
                    kicker="Why Choose Us"
                    title="Built Different."
                    accent="Built to Win."
                    sub="Seven reasons ambitious brands choose SPHEN DIGITAL — and stay."
                />
                <div className="relative">
                    <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.6, ease: "easeInOut" }}
                        className="absolute left-[19px] sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-sphen-purple via-sphen-orange to-sphen-purple"
                    />
                    <div className="flex flex-col gap-10">
                        {points.map((p, i) => {
                            const left = i % 2 === 0;
                            return (
                                <motion.div
                                    key={p.title}
                                    data-testid={`why-us-item-${i}`}
                                    initial={{ opacity: 0, y: 40, x: left ? -30 : 30 }}
                                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                                    className={`relative flex items-center gap-5 sm:gap-0 ${left ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                                >
                                    <div className="absolute left-[19px] sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-sphen-purple border-4 border-[#050505] shadow-[0_0_16px_rgba(109,59,255,0.8)] z-10" />
                                    <div className={`ml-12 sm:ml-0 sm:w-1/2 ${left ? "sm:pr-14 sm:text-right" : "sm:pl-14"}`}>
                                        <div className={`glass rounded-3xl p-6 inline-block text-left hover:border-sphen-orange/40 hover:glow-orange transition-all duration-500 group ${left ? "" : ""}`}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-xl bg-sphen-purple/20 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                                                    <p.icon size={18} className="text-sphen-purple" />
                                                </div>
                                                <h3 className="font-display text-lg font-bold text-white">{p.title}</h3>
                                            </div>
                                            <p className="text-sm text-white/50 leading-relaxed">{p.text}</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block sm:w-1/2" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
