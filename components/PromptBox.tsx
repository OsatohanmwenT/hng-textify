import React, { ReactNode, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const PromptBox = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    boxRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={className}
      ref={boxRef}
    >
      {children}
    </motion.div>
  );
};
export default PromptBox;
