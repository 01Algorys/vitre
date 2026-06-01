"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 };
  const dotConfig = { damping: 50, stiffness: 600, mass: 0.2 };

  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const dotSmoothX = useSpring(dotX, dotConfig);
  const dotSmoothY = useSpring(dotY, dotConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);

      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (el) {
        const style = window.getComputedStyle(el);
        const cursor = style.cursor;
        setIsPointer(cursor === "pointer");
        setIsHovering(
          el.closest("a, button, [data-cursor-hover]") !== null
        );
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY, dotX, dotY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: smoothX, y: smoothY }}
      >
        <motion.div
          className="w-8 h-8 rounded-full border border-white"
          animate={{
            scale: isHovering ? 2 : 1,
            opacity: isHovering ? 0.6 : 0.8,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: dotSmoothX, y: dotSmoothY }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-white"
          animate={{ scale: isHovering ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  );
}
