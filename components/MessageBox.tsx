import React, { ReactNode, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const MessageBox = ({ children }: { children: ReactNode }) => {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    boxRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="flex justify-start mb-2"
      ref={boxRef}
    >
      {children}
    </motion.div>
  );
};
export default MessageBox;
