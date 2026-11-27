import { motion } from "framer-motion";
import { useState } from "react";

import { GIFT } from "@/data/config";
import { LETTERS } from "@/data/letters";
import { sfx } from "@/lib/sfx";

import { Couple } from "./Mascots";
import { WindowScene } from "./WindowScene";

export function Intro({ onDone, count }: { onDone: () => void; count?: number }) {
  const [open, setOpen] = useState(false);
  const n = count ?? LETTERS.filter((l) => !l.bonus).length;

  function openWindow() {
    if (open) return;
    setOpen(true);
    sfx.pop();
    window.setTimeout(() => sfx.chime(), 900);
    window.setTimeout(onDone, 3000);
  }

  return (
    <motion.div className="relative flex min-h-[100dvh] flex-col bg-milk" exit={{ opacity: 0 }}>
      <WindowScene open={open} bird={open} />
      <div className="flex flex-1 flex-col items-center px-6 pt-6 text-center">
        <motion.h1
          className="font-hand text-3xl font-semibold leading-snug text-cocoa"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
        >
          {GIFT.her.full},
        </motion.h1>
        <motion.p className="font-serif mt-3 text-base italic text-cocoa/70" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1 }}>
          {n} letters from {GIFT.him.full}
        </motion.p>
        <motion.button
          type="button"
          onClick={openWindow}
          className="font-display mt-8 rounded-full border-2 border-cocoa bg-butter px-8 py-3 text-lg font-bold tracking-wide text-cocoa"
          style={{ boxShadow: "0 4px 0 #5B3A3A" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: open ? 0.5 : 1, scale: 1 }}
          transition={{ delay: 2.6, type: "spring" }}
          whileTap={{ scale: 0.94, y: 3 }}
        >
          Open the window 🪟
        </motion.button>
        <button type="button" onClick={onDone} className="mt-5 text-xs text-cocoa/50 underline underline-offset-4">
          Skip
        </button>
        <motion.div className="mt-auto pb-8 pt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <Couple size={90} hug={open} />
        </motion.div>
      </div>
    </motion.div>
  );
}
