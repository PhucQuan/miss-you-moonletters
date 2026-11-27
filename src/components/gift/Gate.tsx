import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useState } from "react";

import { getPasscode } from "@/data/config";
import { sfx } from "@/lib/sfx";

import { Cat } from "./Mascots";

export function Loader() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-milk">
      <svg width="220" height="90" viewBox="0 0 220 90" aria-hidden>
        <motion.path
          d="M10 70 C 50 10, 90 90, 130 40 S 190 20, 205 30"
          fill="none"
          stroke="#E8607F"
          strokeWidth="3"
          strokeDasharray="2 8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
        <motion.text x="196" y="36" fontSize="22" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          ✈️
        </motion.text>
      </svg>
      <p className="font-hand text-sm text-cocoa/70">Delivering something special for Mây…</p>
    </div>
  );
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export function Gate({ onUnlock }: { onUnlock: (code: string) => void }) {
  const [digits, setDigits] = useState("");
  const [wrong, setWrong] = useState(0);
  const [open, setOpen] = useState(false);

  function press(k: string) {
    if (open) return;
    if (k === "⌫") {
      sfx.tap();
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (!k || digits.length >= 4) return;
    sfx.tap();
    const next = digits + k;
    setDigits(next);
    if (next.length === 4) {
      if (next === getPasscode()) {
        setOpen(true);
        sfx.chime();
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.45 }, colors: ["#F4A6BC", "#E8607F", "#FFE8A3", "#BFD8B8"], scalar: 0.9 });
        window.setTimeout(() => onUnlock(next), 1100);
      } else {
        sfx.wrong();
        setWrong((w) => w + 1);
        window.setTimeout(() => setDigits(""), 450);
      }
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-10">
      <motion.div
        key={wrong}
        className={`paper card-shadow relative w-full max-w-xs rounded-3xl px-6 pb-7 pt-10 text-center ${wrong ? "shake" : ""}`}
        initial={{ y: 30, opacity: 0, rotate: -2 }}
        animate={{ y: 0, opacity: 1, rotate: -1 }}
      >
        <div className="washi absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2 rounded-sm" />
        <motion.svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto" aria-hidden animate={open ? { rotate: [0, -8, 8, 0] } : {}}>
          <motion.path d="M20 30v-8a12 12 0 0 1 24 0v8" fill="none" stroke="#5B3A3A" strokeWidth="5" strokeLinecap="round" animate={{ y: open ? -9 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} />
          <path d="M32 58C12 44 10 30 19 24c6-3 10 0 13 5 3-5 7-8 13-5 9 6 7 20-13 34z" fill="#E8607F" stroke="#5B3A3A" strokeWidth="3" strokeLinejoin="round" />
        </motion.svg>
        <h1 className="font-display mt-3 text-2xl font-bold leading-tight">Our secret day</h1>
        <p className="font-hand mt-1 text-sm text-cocoa/70">{wrong ? "hehe, try again Mây ơi" : "Password is our special day 💗"}</p>

        <div className="my-4 flex justify-center gap-3" aria-label={`${digits.length} of 4 digits entered`}>
          {[0, 1, 2, 3].map((i) => (
            <motion.span key={i} className="h-4 w-4 rounded-full border-2 border-cocoa" animate={{ backgroundColor: i < digits.length ? "#E8607F" : "#FFFBF5", scale: i === digits.length - 1 ? [1, 1.35, 1] : 1 }} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {KEYS.map((k, i) => (
            <motion.button
              key={i}
              type="button"
              disabled={!k}
              whileTap={{ scale: 0.88, y: 2 }}
              onClick={() => press(k)}
              className={`font-display h-12 rounded-2xl border-2 border-cocoa text-xl font-semibold ${k ? "bg-blush active:bg-rose" : "invisible"}`}
              style={{ boxShadow: "0 3px 0 #5B3A3A" }}
              aria-label={k === "⌫" ? "Delete" : k || undefined}
            >
              {k}
            </motion.button>
          ))}
        </div>
      </motion.div>
      <motion.div className="mt-6" animate={{ rotate: wrong ? [0, -10, 10, -10, 0] : 0 }} key={`c${wrong}`}>
        <Cat size={84} mood={wrong ? "sad" : "idle"} />
      </motion.div>
    </div>
  );
}
