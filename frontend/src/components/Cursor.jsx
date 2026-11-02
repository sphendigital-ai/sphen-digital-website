import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const TrailDot = ({ x, y, stiffness, damping, size, color, opacity }) => {
    const sx = useSpring(x, { stiffness, damping });
    const sy = useSpring(y, { stiffness, damping });
    return (
        <motion.div
            className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
            style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", width: size, height: size, background: color, opacity }}
        />
    );
};

export const CustomCursor = () => {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const sx = useSpring(x, { stiffness: 380, damping: 34, mass: 0.5 });
    const sy = useSpring(y, { stiffness: 380, damping: 34, mass: 0.5 });
    const [hovering, setHovering] = useState(false);
    const [fine, setFine] = useState(false);
    const [ripples, setRipples] = useState([]);

    useEffect(() => {
        const mq = window.matchMedia("(pointer: fine)");
        setFine(mq.matches);
        if (!mq.matches) return;
        const move = (e) => {
            x.set(e.clientX);
            y.set(e.clientY);
            const t = e.target.closest?.("a,button,[role='button'],input,textarea,select,label,[data-cursor-hover]");
            setHovering(!!t);
        };
        const click = (e) => {
            const id = Date.now() + Math.random();
            setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
            setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 700);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mousedown", click);
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mousedown", click);
        };
    }, [x, y]);

    if (!fine) return null;

    return (
        <>
            <TrailDot x={x} y={y} stiffness={240} damping={26} size={7} color="#FF8A3D" opacity={0.7} />
            <TrailDot x={x} y={y} stiffness={160} damping={20} size={5} color="#a78bfa" opacity={0.55} />
            <TrailDot x={x} y={y} stiffness={100} damping={16} size={4} color="#ffffff" opacity={0.4} />
            {ripples.map((r) => (
                <motion.span
                    key={r.id}
                    className="fixed z-[9997] pointer-events-none rounded-full border-2 border-sphen-purple"
                    style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
                    initial={{ width: 10, height: 10, opacity: 0.9 }}
                    animate={{ width: 70, height: 70, opacity: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                />
            ))}
            <motion.div
                data-testid="custom-cursor"
                className="fixed top-0 left-0 z-[9999] pointer-events-none"
                style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
                animate={{ scale: hovering ? 2 : 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
            >
                <div className={`rounded-full transition-[background-color,box-shadow] duration-300 ${hovering ? "w-4 h-4 bg-sphen-orange/90 shadow-[0_0_30px_10px_rgba(255,138,61,0.5)]" : "w-5 h-5 bg-sphen-purple/90 shadow-[0_0_28px_9px_rgba(109,59,255,0.55)]"}`} />
            </motion.div>
        </>
    );
};
