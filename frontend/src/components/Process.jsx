import { motion } from "framer-motion";
import { Ear, Search, Map, Palette, Send, TrendingUp, ArrowDown } from "lucide-react";
import { SectionHead } from "./SectionHead";

const steps = [
    { icon: Ear, title: "Understanding Your Brand", text: "We listen first — your story, goals and audience." },
    { icon: Search, title: "Research", text: "Market, competitors and data deep-dives." },
    { icon: Map, title: "Strategy", text: "A sharp, channel-by-channel growth plan." },
    { icon: Palette, title: "Design", text: "Creatives and assets crafted to convert." },
    { icon: Send, title: "Launch", text: "Campaigns go live with precision tracking." },
    { icon: TrendingUp, title: "Scale", text: "Double down on what wins. Compound growth." },
];

export const Process = () => {
    return (
        <section id="process" data-testid="process-section" className="relative py-16 sm:py-28 lg:py-36 overflow-hidden noise bg-[#070709]">
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-sphen-orange/8 blur-[160px]" />
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <SectionHead
                    testId="process-heading"
                    kicker="Our Process"
                    title="From First Call to"
                    accent="Full Scale"
                    sub="A proven six-step engine that turns brands into market leaders."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {steps.map((s, i) => (
                        <motion.div
                            key={s.title}
                            data-testid={`process-step-${i + 1}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.65, delay: (i % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -8 }}
                            className="group relative glass rounded-3xl p-7 overflow-hidden hover:border-sphen-purple/50 transition-colors duration-500"
                        >
                            <span className="absolute top-5 right-6 font-display font-extrabold text-5xl text-white/[0.06] group-hover:text-sphen-orange/20 transition-colors duration-500 select-none">
                                0{i + 1}
                            </span>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sphen-purple to-sphen-orange/70 flex items-center justify-center mb-5 glow-purple group-hover:rotate-[10deg] group-hover:scale-110 transition-transform duration-500">
                                <s.icon size={20} className="text-white" />
                            </div>
                            <p className="text-[11px] uppercase tracking-[0.25em] text-sphen-orange font-semibold mb-1.5">Step {i + 1}</p>
                            <h3 className="font-display text-xl font-bold text-white mb-2">{s.title}</h3>
                            <p className="text-sm text-white/50 leading-relaxed">{s.text}</p>
                            {i < steps.length - 1 && (
                                <ArrowDown size={16} className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sphen-purple/50 sm:hidden" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
