import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { SectionHead } from "./SectionHead";

const posts = [
    {
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        tag: "Performance Marketing",
        title: "Why Your Meta Ads Stopped Working (And How to Fix Them)",
        date: "Jun 28, 2026",
        read: "6 min read",
    },
    {
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwZGFzaGJvYXJkfGVufDB8fHx8MTc4NTkyNDY5Nnww&ixlib=rb-4.1.0&q=85&w=800",
        tag: "AI Marketing",
        title: "AI-Powered Growth: The Small Business Unfair Advantage",
        date: "Jun 15, 2026",
        read: "8 min read",
    },
    {
        img: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
        tag: "Branding",
        title: "Brands People Remember: The Psychology of Sticky Design",
        date: "Jun 02, 2026",
        read: "5 min read",
    },
];

export const Blog = () => {
    return (
        <section id="blog" data-testid="blog-section" className="relative py-16 sm:py-28 lg:py-36 overflow-hidden noise bg-[#070709]">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <SectionHead
                    testId="blog-heading"
                    kicker="Blog"
                    title="Ideas Worth"
                    accent="Reading"
                    sub="Growth playbooks, ad breakdowns and brand strategy — straight from the team."
                />
                <div className="grid md:grid-cols-3 gap-6">
                    {posts.map((p, i) => (
                        <motion.article
                            key={p.title}
                            data-testid={`blog-card-${i}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.65, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -10 }}
                            className="group glass rounded-3xl overflow-hidden hover:border-sphen-orange/40 transition-colors duration-500"
                        >
                            <div className="relative overflow-hidden aspect-[16/10]">
                                <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <span className="absolute top-4 left-4 rounded-full bg-[#050505]/70 backdrop-blur-xl border border-white/15 px-3 py-1 text-[11px] font-bold text-sphen-orange tracking-wide">{p.tag}</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                                    <span>{p.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/30" />
                                    <span className="inline-flex items-center gap-1"><Clock size={11} /> {p.read}</span>
                                </div>
                                <h3 className="font-display text-lg font-bold text-white leading-snug group-hover:text-sphen-orange transition-colors duration-300">{p.title}</h3>
                                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sphen-purple group-hover:gap-3 transition-all duration-300">
                                    Read Article <ArrowUpRight size={15} />
                                </span>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};
