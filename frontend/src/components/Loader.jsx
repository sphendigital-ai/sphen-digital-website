import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Penguin } from "./Penguin";

const particles = Array.from({ length: 16 }, (_, i) => ({
    x: ((i * 173) % 600) - 300,
    y: ((i * 257) % 400) - 200,
    delay: (i % 8) * 0.09,
    color: i % 3 === 0 ? "#FF8A3D" : "#6D3BFF",
}));

export const Loader = () => {
    return (
        <motion.div
            data-testid="premium-loader"
            className="fixed inset-0 z-[10000] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
            <div className="absolute w-[500px] h-[500px] rounded-full bg-sphen-purple/20 blur-[140px] animate-drift" />
            {particles.map((p, i) => (
                <motion.span
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ background: p.color, boxShadow: `0 0 12px ${p.color}` }}
                    initial={{ x: p.x, y: p.y, opacity: 0 }}
                    animate={{ x: 0, y: -40, opacity: [0, 1, 0] }}
                    transition={{ duration: 1.6, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
                />
            ))}
            <motion.div
                initial={{ scale: 0, rotate: -20, y: 40 }}
                animate={{ scale: 1, rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 14 }}
            >
                <Penguin pose="wave" size={120} glow={false} />
            </motion.div>
            <motion.img
                src="/assets/logo.png"
                alt="SPHEN DIGITAL"
                initial={{ opacity: 0, y: 24, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 h-14 sm:h-16 w-auto"
            />
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-4 text-sm text-white/50 tracking-wide"
            >
                Preparing Your Digital Experience...
            </motion.p>
            <div className="mt-6 relative w-56 h-[4px] rounded-full bg-white/10">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-sphen-purple to-sphen-orange"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.8, ease: "easeInOut", delay: 0.35 }}
                />
                <motion.div
                    className="absolute -top-[11px]"
                    initial={{ left: "0%" }}
                    animate={{ left: "calc(100% - 24px)" }}
                    transition={{ duration: 1.8, ease: "easeInOut", delay: 0.35 }}
                >
                    <Rocket size={22} className="text-sphen-orange -rotate-45 drop-shadow-[0_0_10px_rgba(255,138,61,0.8)]" />
                </motion.div>
            </div>
        </motion.div>
    );
};
