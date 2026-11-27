import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { COUPONS, WISHES } from "@/data/config";
import { sfx } from "@/lib/sfx";
import { useStored } from "@/lib/storage";

const NOTE_COLORS = ["#FFD6E0", "#FFE8A3", "#BFD8B8", "#F9C3D1", "#FFE1CF"];

function Jar({ notes }: { notes: string[] }) {
  return (
    <div className="relative mx-auto h-44 w-36" aria-label={`Wish jar with ${notes.length} wishes`}>
      <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-md border-2 border-cocoa bg-rose" />
      <div className="absolute inset-x-0 bottom-0 top-4 overflow-hidden rounded-b-[44px] rounded-t-2xl border-2 border-cocoa bg-white/60">
        <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-1 p-2">
          {notes.length === 0 && <span className="font-hand mb-14 self-center text-center text-xs text-cocoa/50">check a wish and it lands here</span>}
          <AnimatePresence>
            {notes.map((n, i) => (
              <motion.span
                key={n}
                className="block h-5 w-8 rounded-[3px] border border-cocoa/40"
                style={{ background: NOTE_COLORS[i % NOTE_COLORS.length], rotate: ((i * 37) % 40) - 20 }}
                initial={{ y: -120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 11 }}
              />
            ))}
          </AnimatePresence>
        </div>
        <div className="absolute left-3 top-3 h-20 w-2 rounded-full bg-white/70" />
      </div>
    </div>
  );
}

function Coupon({ c, used, onUse }: { c: (typeof COUPONS)[number]; used: boolean; onUse: () => void }) {
  return (
    <div className="relative flex h-[72px] overflow-hidden">
      <div className="paper card-shadow relative flex flex-1 flex-col justify-center rounded-l-xl border-2 border-r-0 border-cocoa pl-4 pr-2">
        <p className="font-display text-base font-bold leading-tight">{c.title}</p>
        <p className="font-hand text-xs text-cocoa/70">{c.note}</p>
        {used && <span className="font-display absolute right-2 top-1/2 -translate-y-1/2 -rotate-12 rounded border-2 border-berry px-2 text-sm font-bold text-berry">USED</span>}
      </div>
      {/* perforation */}
      <div className="w-0 border-l-2 border-dashed border-cocoa/60" />
      <motion.button
        type="button"
        disabled={used}
        onClick={onUse}
        className="font-display flex w-16 items-center justify-center rounded-r-xl border-2 border-l-0 border-cocoa bg-blush text-sm font-bold disabled:opacity-60"
        animate={used ? { x: 26, rotate: 8, opacity: 0.6 } : { x: 0, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        whileTap={{ scale: 0.95 }}
      >
        {used ? "✓" : "Use"}
      </motion.button>
    </div>
  );
}

export function WishesTab() {
  const [done, setDone] = useStored<string[]>("wishes-done", []);
  const [mine, setMine] = useStored<string[]>("wishes-mine", []);
  const [used, setUsed] = useStored<string[]>("coupons-used", []);
  const [draft, setDraft] = useState("");

  const all = [...WISHES, ...mine];
  const jarNotes = all.filter((w) => done.includes(w));

  function toggle(w: string) {
    sfx.pop();
    setDone((d) => {
      if (d.includes(w)) return d.filter((x) => x !== w);
      confetti({ particleCount: 24, spread: 60, origin: { y: 0.35 }, colors: ["#F4A6BC", "#E8607F", "#FFE8A3"], scalar: 0.8 });
      return [...d, w];
    });
  }

  return (
    <div className="px-5 pb-10 pt-6">
      <h2 className="font-display text-center text-2xl font-bold">Our wish jar</h2>
      <p className="font-hand text-center text-sm text-cocoa/70">things we'll do together, one day at a time</p>
      <div className="mt-5">
        <Jar notes={jarNotes} />
      </div>

      <ul className="mt-5 space-y-2.5">
        {all.map((w, i) => {
          const on = done.includes(w);
          return (
            <li key={w}>
              <button type="button" onClick={() => toggle(w)} className="paper card-shadow flex w-full items-center gap-3 rounded-xl border-2 border-cocoa px-3 py-2.5 text-left" style={{ rotate: i % 2 ? '0.6deg' : '-0.6deg' }} aria-pressed={on}>
                <span className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-cocoa ${on ? "bg-blush" : "bg-white"}`}>
                  <AnimatePresence>{on && <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} className="text-sm text-berry">♥</motion.span>}</AnimatePresence>
                </span>
                <span className={`font-hand text-sm ${on ? "text-cocoa/50 line-through" : ""}`}>{w}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const t = draft.trim();
          if (!t || all.includes(t)) return;
          sfx.pop();
          setMine((m) => [...m, t]);
          setDraft("");
        }}
      >
        <input value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={80} placeholder="Add your own wish…" className="font-hand min-w-0 flex-1 rounded-xl border-2 border-cocoa bg-white px-3 py-2 text-sm outline-none focus:border-berry" />
        <button type="submit" className="font-display rounded-xl border-2 border-cocoa bg-butter px-4 text-sm font-semibold" style={{ boxShadow: "0 3px 0 #5B3A3A" }}>
          Add
        </button>
      </form>

      <h3 className="font-display mt-10 text-center text-xl font-bold">Little coupons</h3>
      <p className="font-hand text-center text-xs text-cocoa/60">valid forever, no expiry date</p>
      <div className="mt-4 space-y-3">
        {COUPONS.map((c) => (
          <Coupon
            key={c.id}
            c={c}
            used={used.includes(c.id)}
            onUse={() => {
              sfx.chime();
              confetti({ particleCount: 30, spread: 70, origin: { y: 0.6 }, scalar: 0.8 });
              setUsed((u) => [...u, c.id]);
            }}
          />
        ))}
      </div>
    </div>
  );
}
