"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
}

export default function Modal({ open, onClose, children, widthClass = "max-w-md" }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className={`relative w-full ${widthClass} rounded-2xl border border-border bg-surface p-5 shadow-pop`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
