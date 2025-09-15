import React from "react";
import { motion } from "framer-motion";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } }}
    >
      {children}
    </motion.div>
  );
}
