"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { generalWhatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={generalWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-[#1f8f4e] p-4 text-white shadow-lift sm:right-6 sm:bottom-6"
        >
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#1f8f4e]/40 [animation-duration:2.6s]" />
          <WhatsAppIcon size={26} />
          <span className="hidden max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-all duration-300 group-hover:max-w-40 group-hover:pr-1 sm:inline">
            Chat with us
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
