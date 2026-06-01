"use client";
import { motion } from "framer-motion";
import { charReveal, staggerContainerFast } from "@/lib/animations";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export default function SplitText({
  text,
  className = "",
  delay = 0,
  once = true,
}: SplitTextProps) {
  const words = text.split(" ");

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.06, delayChildren: delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-5% 0px" }}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span className="inline-block" variants={charReveal}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
