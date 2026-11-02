import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Share2, Fingerprint, PenTool, Megaphone, Globe, MonitorSmartphone, SearchCheck, PenLine, Clapperboard, Compass, Magnet, Rocket } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { Penguin } from "./Penguin";

const services = [
    { icon: Share2, title: "Social Media Management", desc: "Daily content, community and growth across every platform." },
    { icon: Fingerprint, title: "Branding", desc: "Identities that people remember and trust instantly." },
    { icon: PenTool, title: "Graphic Designing", desc: "Scroll-stopping creatives built for conversion." },
    { icon: Megaphone, title: "Meta Ads", desc: "Performance campaigns engineered for ROAS." },
    { icon: Globe, title: "Google Ads", desc: "Capture high-intent demand the moment it searches." },
    { icon: MonitorSmartphone, title: "Website Development", desc: "Fast, premium websites that turn visitors into buyers." },
    { icon: SearchCheck, title: "SEO", desc: "Rank higher and own your category on search." },
    { icon: PenLine, title: "Content Creation", desc: "Stories and copy that move audiences to act." },
    { icon: Clapperboard, title: "Video Editing", desc: "Cinematic edits built for reels, ads and YouTube." },
    { icon: Compass, title: "Marketing Strategy", desc: "Full-funnel roadmaps from awareness to revenue." },
    { icon: Magnet, title: "Lead Generation", desc: "Predictable pipelines of qualified leads." },
    { icon: Rocket, title: "Business Growth", desc: "AI-powered systems that compound your growth." },
];

const TiltCard = ({ children, className, testId }) => {
    const ref = useRef(null);
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const srx = useSpring(rx, { stiffness: 200, damping: 20 });
    const sry = useSpring(ry, { stiffness: 200, damping: 20 });

    const onMove = (e) => {
        const r = ref.current.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        ry.set(dx * 10);
        rx.set(-dy * 10);
    };
    const reset = () => { rx.set(0); ry.set(0); };

    return (
        <motion.div
            ref={ref}
            data-testid={testId}
            onMouseMove={onMove}
            onMouseLeave={reset}
            style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const Services = () => {
    return (
        <section id="services" data-testid="services-section" className="relative py-16 sm:py-28 lg:py-36 overflow-hidden noise bg-[#070709]">
            <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-sphen-orange/8 blur-[160px]" />
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <SectionHead
                    testId="services-heading"
                    kicker="What We Do"
                    title="Services That"
                    accent="Move Markets"
                    sub="Twelve growth engines, one obsessed team. Hover a card — everything here is alive."
                />
                <motion.div
                    initial={{ y: 110, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ type: "spring", stiffness: 90, damping: 14 }}
                    className="flex justify-center -mb-12 relative z-0"
                    data-testid="services-peek-penguin"
                >
                    <Penguin pose="idle" size={130} />
                </motion.div>
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {services.map((s, i) => (
                        <motion.div
                            key={s.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <TiltCard
                                testId={`service-card-${s.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                                className="group glass rounded-3xl p-6 h-full min-h-[190px] flex flex-col relative overflow-hidden hover:border-sphen-purple/50 hover:shadow-[0_20px_60px_rgba(109,59,255,0.25)] transition-[border-color,box-shadow] duration-500"
                            >
                                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-sphen-purple/0 group-hover:bg-sphen-purple/20 blur-2xl transition-[background-color] duration-500" />
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sphen-purple/30 to-sphen-orange/15 border border-white/10 flex items-center justify-center mb-5 group-hover:rotate-[15deg] group-hover:scale-110 transition-transform duration-500">
                                    <s.icon size={21} className="text-white group-hover:text-sphen-orange transition-colors duration-500" />
                                </div>
                                <h3 className="font-display text-lg font-bold text-white mb-2">{s.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
