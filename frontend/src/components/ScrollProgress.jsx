import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { scrollToSection } from "../lib/scroll";
import { sound } from "../lib/sound";

const sections = ["top", "about", "services", "why-us", "process", "pricing", "portfolio", "testimonials", "blog", "contact"];

export const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });
    const [active, setActive] = useState("top");

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        setActive((prev) => {
                            if (prev !== e.target.id) {
                                const idx = sections.indexOf(e.target.id);
                                sound.whoosh(0.75 + idx * 0.09);
                                sound.pulse();
                            }
                            return e.target.id;
                        });
                    }
                }),
            { rootMargin: "-40% 0px -55% 0px" }
        );
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, []);

    return (
        <div data-testid="scroll-progress" className="fixed left-5 top-1/2 -translate-y-1/2 z-[800] hidden xl:flex flex-col items-center">
            <div className="relative w-[3px] h-[62vh] rounded-full bg-white/10">
                <motion.div
                    className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-gradient-to-b from-sphen-purple via-[#a78bfa] to-sphen-orange shadow-[0_0_14px_rgba(109,59,255,0.7)]"
                    style={{ scaleY: fill }}
                />
                {[0, 1].map((i) => (
                    <motion.span
                        key={i}
                        className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#a78bfa]"
                        animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 5.5, repeat: Infinity, delay: i * 2.7, ease: "linear" }}
                    />
                ))}
                {sections.map((id, i) => {
                    const isActive = active === id;
                    return (
                        <button
                            key={id}
                            data-testid={`progress-node-${id}`}
                            onClick={() => scrollToSection(`#${id}`)}
                            aria-label={`Go to ${id}`}
                            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-1"
                            style={{ top: `${(i / (sections.length - 1)) * 100}%` }}
                        >
                            <motion.span
                                animate={{ scale: isActive ? 1.7 : 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                className={`block w-2.5 h-2.5 rounded-full transition-[background-color,box-shadow] duration-500 ${isActive ? "bg-sphen-orange shadow-[0_0_16px_rgba(255,138,61,0.95)]" : "bg-white/30 hover:bg-white/60"}`}
                            />
                            {isActive && <span className="absolute inset-0 rounded-full animate-pulse-ring" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
