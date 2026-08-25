"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { AnimatePresence, motion } from "framer-motion";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pt-6">{children}</main>
      </div>
    </div>
  );
}
