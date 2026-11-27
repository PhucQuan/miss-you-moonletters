import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { GIFT } from "@/data/config";
import { sfx } from "@/lib/sfx";

import { Couple } from "./Mascots";

const CLOSING = `Distance is just a number, ${GIFT.her.nick}. I'm always right here, counting down the days.`;

export function Finale({ onClose }: { onClose: () => void }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setN(CLOSING.length);
      return;
    }
    const t = window.setTimeout(() => {
      const id = window.setInterval(() => {
        setN((v) => {
          if (v >= CLOSING.length) {
            window.clearInterval(id);
            return v;
          }
          return v + 1;
        });
      }, 55);
    }, 2200);
    return () => window.clearTimeout(t);
  }, []);

  const stars = useMemo(() => Array.from({ length: 28 }, (_, i) => ({ x: (i * 41) % 100, y: (i * 23) % 70, d: (i % 6) * 0.4 })), []);

  function boom(e: React.MouseEvent) {
    sfx.pop();
    const origin = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    const heart = confetti.shapeFromText({ text: "💗", scalar: 2 });
    const petal = confetti.shapeFromText({ text: "🌸", scalar: 2 });
    confetti({ particleCount: 36, spread: 360, startVelocity: 22, origin, shapes: [heart, petal], scalar: 2, flat: true, ticks: 90 });
  }

  const done = n >= CLOSING.length;

  return (
    <motion.div className="fixed inset-0 z-50 overflow-hidden" style={{ background: "linear-gradient(#3B2A5A, #8A5A86 55%, #F7A8B8)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={boom}>
      {stars.map((s, i) => (
        <span key={i} className="twinkle absolute text-[10px] text-butter" style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s` }}>
          ✦
        </span>
      ))}

      {/* lanterns */}
      {[
        { x: "28%", d: 0, label: GIFT.him.nick },
        { x: "64%", d: 0.8, label: GIFT.her.nick },
      ].map((l) => (
        <motion.div key={l.label} className="absolute flex flex-col items-center" style={{ left: l.x, bottom: "-10%" }} initial={{ y: 0 }} animate={{ y: "-62vh" }} transition={{ duration: 9, delay: l.d, ease: "easeOut" }}>
          <div className="bob flex h-14 w-11 items-center justify-center rounded-[40%] border-2 border-cocoa bg-butter text-xs font-hand font-semibold">{l.label}</div>
          <div className="h-3 w-px bg-cocoa/60" />
        </motion.div>
      ))}

      <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="font-display fixed right-4 top-4 z-10 h-10 w-10 rounded-full border-2 border-cocoa bg-cream text-lg" style={{ boxShadow: "0 3px 0 #5B3A3A" }} aria-label="Close">
        ✕
      </button>

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-8 pb-14 text-center">
        <motion.h2 className="font-display text-3xl font-bold text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          The end… but not really
        </motion.h2>
        <p className="font-hand mt-4 min-h-[5.5rem] max-w-xs text-lg leading-8 text-white">{CLOSING.slice(0, n)}</p>
        <div className="mt-2">
          <Couple hug={done} size={90} />
        </div>
        <p className="font-hand mt-2 text-xs text-white/70">tap anywhere ✨</p>
        <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="font-display mt-4 rounded-full border-2 border-cocoa bg-butter px-5 py-2 text-sm font-semibold" style={{ boxShadow: "0 3px 0 #5B3A3A" }}>
          Read again 💌
        </button>
      </div>
    </motion.div>
  );
}
