import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const orbiters = Array.from({ length: 8 }, (_, i) => ({
    angle: (i / 8) * 360,
    size: 4 + (i % 3) * 2,
    color: i % 2 ? "#FF8A3D" : "#6D3BFF",
    duration: 14 + (i % 4) * 4,
    radius: 150 + (i % 3) * 30,
}));

export const BrandMark = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

    return (
        <section ref={ref} data-testid="brand-mark-section" className="relative py-16 sm:py-28 lg:py-36 overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute w-[560px] h-[560px] rounded-full bg-sphen-purple/15 blur-[160px] animate-drift" />
            <div className="absolute w-[380px] h-[380px] rounded-full bg-sphen-orange/10 blur-[140px] animate-drift" style={{ animationDelay: "-6s" }} />
            <motion.div style={{ y, rotate }} className="relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 70, damping: 14 }}
                    className="relative [perspective:900px]"
                >
                    <motion.img
                        src="/assets/s-logo.png"
                        alt="SPHEN DIGITAL S logo"
                        data-testid="brand-s-logo"
                        animate={{ y: [0, -14, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 w-52 sm:w-64 lg:w-72 h-auto drop-shadow-[0_0_60px_rgba(109,59,255,0.55)]"
                        draggable={false}
                    />
                    <motion.div
                        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.12, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 -z-0 rounded-full bg-sphen-purple/30 blur-[70px]"
                    />
                    {orbiters.map((o, i) => (
                        <motion.span
                            key={i}
                            className="absolute left-1/2 top-1/2 rounded-full scale-[0.55] sm:scale-100"
                            style={{ width: o.size, height: o.size, background: o.color, boxShadow: `0 0 12px ${o.color}` }}
                            animate={{
                                x: [
                                    Math.cos((o.angle * Math.PI) / 180) * o.radius,
                                    Math.cos(((o.angle + 360) * Math.PI) / 180) * o.radius,
                                ],
                                y: [
                                    Math.sin((o.angle * Math.PI) / 180) * o.radius * 0.55,
                                    Math.sin(((o.angle + 360) * Math.PI) / 180) * o.radius * 0.55,
                                ],
                                opacity: [0.2, 0.9, 0.2],
                            }}
                            transition={{ duration: o.duration, repeat: Infinity, ease: "linear" }}
                        />
                    ))}
                </motion.div>
            </motion.div>
            <motion.img
                src="/assets/logo.png"
                alt="SPHEN DIGITAL"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 h-10 sm:h-12 w-auto"
            />
            <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 px-6 text-center font-display text-sm sm:text-xl font-semibold tracking-[0.14em] sm:tracking-[0.2em] uppercase text-gradient text-shimmer"
            >
                Ideas That Move Markets.
            </motion.p>
        </section>
    );
};
