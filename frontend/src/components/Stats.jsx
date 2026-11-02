import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Penguin } from "./Penguin";
import { sound } from "../lib/sound";

const stats = [
    { to: 250, suffix: "+", label: "Projects", ring: 0.86 },
    { to: 150, suffix: "+", label: "Clients", ring: 0.72 },
    { to: 10, suffix: "M+", label: "Reach Generated", ring: 0.94 },
    { to: 98, suffix: "%", label: "Client Satisfaction", ring: 0.98 },
];

const Counter = ({ to, suffix, testId }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const [val, setVal] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const controls = animate(0, to, {
            duration: 2.2,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setVal(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, to]);

    return (
        <span ref={ref} data-testid={testId} className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            {val}{suffix}
        </span>
    );
};

const Ring = ({ progress, delay }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const C = 2 * Math.PI * 44;
    return (
        <svg ref={ref} viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
            <motion.circle
                cx="50" cy="50" r="44" fill="none"
                stroke="url(#ringGrad)" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={inView ? { strokeDashoffset: C * (1 - progress) } : {}}
                transition={{ duration: 2, delay, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: "drop-shadow(0 0 6px rgba(109,59,255,0.6))" }}
            />
            <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6D3BFF" />
                    <stop offset="100%" stopColor="#FF8A3D" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export const Stats = () => {
    const sectionRef = useRef(null);
    const sectionInView = useInView(sectionRef, { once: true, margin: "-80px" });

    useEffect(() => {
        if (!sectionInView) return;
        const interval = setInterval(() => sound.countTick(), 150);
        const stop = setTimeout(() => {
            clearInterval(interval);
            sound.ding();
        }, 2200);
        return () => {
            clearInterval(interval);
            clearTimeout(stop);
        };
    }, [sectionInView]);

    return (
        <section ref={sectionRef} data-testid="stats-section" className="relative py-16 sm:py-24 overflow-hidden noise">
            <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-sphen-purple/15 blur-[140px]" />
            <div className="relative max-w-6xl mx-auto px-5 sm:px-8 flex flex-col lg:flex-row items-center gap-12">
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ type: "spring", stiffness: 90, damping: 14 }}
                    className="hidden lg:block shrink-0"
                >
                    <Penguin pose="celebrate" size={150} />
                </motion.div>
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-10 w-full">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            data-testid={`stat-${s.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center flex flex-col items-center"
                        >
                            <div className="relative flex items-center justify-center">
                                <Ring progress={s.ring} delay={i * 0.15} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Counter to={s.to} suffix={s.suffix} testId={`stat-counter-${i}`} />
                                </div>
                            </div>
                            <p className="mt-4 text-[11px] sm:text-sm uppercase tracking-[0.12em] sm:tracking-[0.25em] text-white/50 font-medium">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
