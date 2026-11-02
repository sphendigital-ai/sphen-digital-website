import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { Penguin } from "./Penguin";

const reviews = [
    { quote: "Best marketing agency we've worked with. They treat our brand like their own.", name: "Rohit Malhotra", role: "Founder, D2C Fashion Brand" },
    { quote: "Our leads doubled within months. The reporting alone is worth every rupee.", name: "Priya Sharma", role: "Director, Real Estate Group" },
    { quote: "Professional, creative and result-focused. SPHEN feels like an in-house team.", name: "Aman Gupta", role: "CEO, EdTech Startup" },
];

export const Testimonials = () => {
    return (
        <section id="testimonials" data-testid="testimonials-section" className="relative py-16 sm:py-28 lg:py-36 overflow-hidden noise">
            <div className="absolute -bottom-32 -right-40 w-[480px] h-[480px] rounded-full bg-sphen-orange/8 blur-[150px]" />
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <SectionHead
                    testId="testimonials-heading"
                    kicker="Testimonials"
                    title="Clients Who"
                    accent="Moved Markets"
                    sub="Don't take our word for it — take theirs."
                />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-end justify-center gap-2 sm:gap-4 mb-12 px-4"
                >
                    <div className="scale-[0.65] sm:scale-100 origin-bottom shrink-0">
                        <Penguin pose="point" size={120} />
                    </div>
                    <div className="relative glass-strong rounded-2xl rounded-bl-sm px-6 py-4 mb-8">
                        <p data-testid="testimonials-mascot-bubble" className="font-display font-bold text-white text-base sm:text-lg">"Our clients love growing with us!"</p>
                        <div className="absolute -top-3 -right-3 flex gap-1">
                            {[0, 1].map((s) => (
                                <motion.span key={s} animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.6, repeat: Infinity, delay: s * 0.5 }}>
                                    <Star size={14} className="text-sphen-orange" fill="#FF8A3D" />
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-6">
                    {reviews.map((r, i) => (
                        <motion.figure
                            key={r.name}
                            data-testid={`testimonial-card-${i}`}
                            initial={{ opacity: 0, y: 50, rotate: i === 1 ? 0 : i === 0 ? -2 : 2 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -10, rotate: i === 1 ? 0 : i === 0 ? -1 : 1 }}
                            className="glass rounded-3xl p-8 relative hover:border-sphen-purple/40 hover:shadow-[0_20px_60px_rgba(109,59,255,0.2)] transition-[border-color,box-shadow] duration-500"
                        >
                            <Quote size={36} className="text-sphen-purple/30 absolute top-6 right-7" />
                            <div className="flex gap-1 mb-5">
                                {Array.from({ length: 5 }).map((_, s) => (
                                    <motion.span
                                        key={s}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 + i * 0.13 + s * 0.07, type: "spring", stiffness: 300, damping: 12 }}
                                    >
                                        <Star size={16} className="text-sphen-orange" fill="#FF8A3D" />
                                    </motion.span>
                                ))}
                            </div>
                            <blockquote className="text-white/75 leading-relaxed text-base md:text-lg">"{r.quote}"</blockquote>
                            <figcaption className="mt-6 flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sphen-purple to-sphen-orange flex items-center justify-center font-display font-bold text-white">
                                    {r.name[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{r.name}</p>
                                    <p className="text-xs text-white/45">{r.role}</p>
                                </div>
                            </figcaption>
                        </motion.figure>
                    ))}
                </div>
            </div>
        </section>
    );
};
