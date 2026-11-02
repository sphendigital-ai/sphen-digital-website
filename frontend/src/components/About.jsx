import { motion } from "framer-motion";
import { Lightbulb, Cpu, Compass } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { Penguin } from "./Penguin";

const chapters = [
    { num: "01", icon: Lightbulb, title: "Creativity", text: "We don't just market businesses — we build brands that people remember. Every design, every campaign, every word is crafted to stick." },
    { num: "02", icon: Cpu, title: "Technology", text: "AI-powered growth strategies, data-driven decisions and modern tooling that keep your brand ahead of the algorithm curve." },
    { num: "03", icon: Compass, title: "Strategy", text: "Visibility, quality leads and measurable growth. Whether you're a startup or an established company — our mission is simple: grow your business with smart marketing." },
];

export const About = () => {
    return (
        <section id="about" data-testid="about-section" className="relative py-16 sm:py-28 lg:py-36 overflow-hidden noise">
            <div className="absolute top-1/4 -left-52 w-[480px] h-[480px] rounded-full bg-sphen-purple/12 blur-[150px]" />
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
                    <div className="lg:sticky lg:top-28">
                        <SectionHead
                            testId="about-heading"
                            align="left"
                            kicker="About Us"
                            title="Why"
                            accent="SPHEN DIGITAL?"
                            sub="We combine creativity, technology and strategy to help businesses increase visibility, generate quality leads and achieve measurable growth."
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
                            className="hidden lg:block -mt-6 ml-8"
                        >
                            <Penguin pose="point" size={170} />
                        </motion.div>
                    </div>
                    <div className="flex flex-col gap-6">
                        {chapters.map((c, i) => (
                            <motion.div
                                key={c.num}
                                data-testid={`about-chapter-${c.num}`}
                                initial={{ opacity: 0, x: 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ x: 8 }}
                                className="group glass rounded-3xl p-7 sm:p-9 relative overflow-hidden hover:border-sphen-purple/40 transition-colors duration-500"
                            >
                                <span className="absolute -top-4 right-4 font-display font-extrabold text-[88px] leading-none text-white/[0.05] group-hover:text-sphen-purple/15 transition-colors duration-500 select-none">
                                    {c.num}
                                </span>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sphen-purple/30 to-sphen-orange/20 border border-white/10 flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500">
                                        <c.icon size={21} className="text-sphen-orange" />
                                    </div>
                                    <h3 className="font-display text-2xl font-bold text-white">{c.title}</h3>
                                </div>
                                <p className="text-white/55 leading-relaxed text-sm sm:text-base">{c.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
