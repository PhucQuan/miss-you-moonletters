import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { GIFT, MOODS } from "@/data/config";
import { LETTERS } from "@/data/letters";
import { sfx } from "@/lib/sfx";
import { localISO, useStored } from "@/lib/storage";

import { Couple, type MascotMood } from "./Mascots";

type Saved = { id: string; date: string } | null;

const today = () => localISO();
const yesterday = () => localISO(new Date(Date.now() - 864e5));

const POSE: Record<string, MascotMood> = { happy: "happy", tired: "sleepy", sad: "sad", sleepy: "sleepy", miss: "blush", silly: "happy" };

export function MoodsTab({ onOpenLetter }: { onOpenLetter: (id: string) => void }) {
  const [saved, setSaved, ready] = useStored<Saved>("mood", null);
  const [pick, setPick] = useState<string | null>(null);
  const [greet, setGreet] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (saved) {
      const m = MOODS.find((x) => x.id === saved.id);
      if (m && saved.date === yesterday()) setGreet(`Yesterday you felt ${m.label.toLowerCase()} ${m.emoji}. Hope today is a little lighter.`);
      if (m && saved.date === today()) setPick(saved.id);
    }
  }, [ready, saved]);

  const mood = MOODS.find((m) => m.id === pick);
  const letter = mood ? LETTERS.find((l) => l.id === mood.letter) : undefined;

  return (
    <div className="px-5 pb-10 pt-6">
      <h2 className="font-display text-center text-2xl font-bold">How is {GIFT.her.nick} feeling today?</h2>
      <p className="font-hand mt-1 text-center text-sm text-cocoa/70">{greet || "pick the face that matches"}</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {MOODS.map((m, i) => (
          <motion.button
            key={m.id}
            type="button"
            onClick={() => {
              sfx.pop();
              setPick(m.id);
              setSaved({ id: m.id, date: today() });
            }}
            className={`paper card-shadow flex aspect-square flex-col items-center justify-center rounded-2xl border-2 ${pick === m.id ? "border-berry bg-blush" : "border-cocoa"}`}
            style={{ rotate: [-2, 1.5, -1, 2, -1.5, 1][i] ?? 0 }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ y: -4 }}
            animate={pick === m.id ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            aria-pressed={pick === m.id}
          >
            <span className="text-4xl">{m.emoji}</span>
            <span className="font-hand mt-1 text-xs">{m.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Couple size={84} mood={pick ? (POSE[pick] ?? "idle") : "idle"} />
      </div>

      <AnimatePresence mode="wait">
        {mood && (
          <motion.div key={mood.id} className="paper card-shadow relative mt-4 rounded-2xl border-2 border-cocoa p-5 text-center" initial={{ opacity: 0, y: 16, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0.5 }} exit={{ opacity: 0 }}>
            <div className="washi absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-2 rounded-sm" />
            <p className="font-hand text-base leading-7">{mood.msg}</p>
            {letter && (
              <button type="button" onClick={() => onOpenLetter(letter.id)} className="font-display mt-4 rounded-full border-2 border-cocoa bg-butter px-5 py-2 text-sm font-semibold" style={{ boxShadow: "0 3px 0 #5B3A3A" }}>
                Open “{letter.label}” 💌
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
