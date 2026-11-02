import { motion } from "framer-motion";

const colors = ["#6D3BFF", "#FF8A3D", "#ffffff", "#a78bfa", "#ffd166", "#4ade80"];

export const Confetti = ({ count = 28, spread = 170 }) => (
    <div data-testid="confetti-burst" className="pointer-events-none absolute inset-0 z-20 overflow-visible">
        {Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const dist = 60 + ((i * 37) % spread);
            return (
                <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/3 w-2 h-3 rounded-[2px]"
                    style={{ background: colors[i % colors.length] }}
                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                    animate={{
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist * 0.55 + 150,
                        opacity: 0,
                        rotate: (i % 2 ? 1 : -1) * (200 + (i % 5) * 40),
                    }}
                    transition={{ duration: 1.5 + (i % 4) * 0.22, ease: "easeOut" }}
                />
            );
        })}
    </div>
);
