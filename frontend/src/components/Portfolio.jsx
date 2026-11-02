import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { SectionHead } from "./SectionHead";

const works = [
    { img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwZGFzaGJvYXJkfGVufDB8fHx8MTc4NTkyNDY5Nnww&ixlib=rb-4.1.0&q=85&w=800", title: "D2C Fashion Brand", tag: "Meta Ads", result: "+312% ROAS", tall: false },
    { img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", title: "SaaS Analytics Platform", tag: "SEO + Content", result: "10x Organic Traffic", tall: true },
    { img: "https://images.pexels.com/photos/577195/pexels-photo-577195.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", title: "Real Estate Group", tag: "Lead Generation", result: "1,400 Leads in 90 Days", tall: false },
    { img: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80", title: "Cafe Chain Rebrand", tag: "Branding", result: "Sold-Out Launch Week", tall: true },
    { img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80", title: "EdTech Startup", tag: "Social Media", result: "0 to 85K Followers", tall: false },
    { img: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80", title: "Fitness Studio", tag: "Growth Strategy", result: "3 New Locations", tall: false },
];

const BeforeAfter = () => {
    const ref = useRef(null);
    const dragging = useRef(false);
    const [pos, setPos] = useState(50);

    const update = (clientX) => {
        const r = ref.current.getBoundingClientRect();
        setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
    };

    const onDown = (e) => {
        dragging.current = true;
        update(e.clientX);
        const move = (ev) => dragging.current && update(ev.clientX);
        const up = () => {
            dragging.current = false;
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
    };

    const img = "https://images.pexels.com/photos/577195/pexels-photo-577195.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

    return (
        <div
            ref={ref}
            data-testid="before-after-slider"
            onPointerDown={onDown}
            className="relative rounded-[28px] overflow-hidden select-none touch-none border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] aspect-[16/9]"
        >
            <img src={img} alt="After marketing growth" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                <img src={img} alt="Before marketing" className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.45] contrast-[0.85]" draggable={false} />
            </div>
            <span className="absolute top-4 left-4 glass-strong rounded-full px-3.5 py-1.5 text-xs font-bold tracking-widest text-white/80">BEFORE</span>
            <span className="absolute top-4 right-4 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-widest text-white bg-sphen-purple/80 backdrop-blur-xl glow-purple">AFTER</span>
            <div className="absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-sphen-purple to-sphen-orange" style={{ left: `${pos}%` }}>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full glass-strong flex items-center justify-center glow-purple">
                    <MoveHorizontal size={18} className="text-white" />
                </div>
            </div>
        </div>
    );
};

export const Portfolio = () => {
    return (
        <section id="portfolio" data-testid="portfolio-section" className="relative py-16 sm:py-28 lg:py-36 overflow-hidden noise bg-[#070709]">
            <div className="absolute -top-32 -right-40 w-[500px] h-[500px] rounded-full bg-sphen-purple/10 blur-[160px]" />
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <SectionHead
                    testId="portfolio-heading"
                    kicker="Portfolio"
                    title="Work That"
                    accent="Speaks in Numbers"
                    sub="Real brands. Real growth. Drag the slider to see the SPHEN effect."
                />
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-14"
                >
                    <BeforeAfter />
                </motion.div>
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:balance]">
                    {works.map((w, i) => (
                        <motion.div
                            key={w.title}
                            data-testid={`portfolio-item-${i}`}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative mb-6 break-inside-avoid rounded-3xl overflow-hidden border border-white/10 hover:border-sphen-purple/50 transition-colors duration-500"
                        >
                            <img
                                src={w.img}
                                alt={w.title}
                                loading="lazy"
                                className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${w.tall ? "aspect-[4/5]" : "aspect-[4/3]"}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 inset-x-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="inline-block rounded-full bg-sphen-purple/80 backdrop-blur px-3 py-1 text-[11px] font-bold tracking-wide text-white mb-2.5">{w.tag}</span>
                                <h3 className="font-display text-xl font-bold text-white">{w.title}</h3>
                                <p className="text-sm font-semibold text-sphen-orange mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{w.result}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
