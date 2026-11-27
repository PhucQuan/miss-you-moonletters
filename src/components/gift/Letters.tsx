import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { GIFT } from "@/data/config";
import { type Letter, type LetterTheme } from "@/data/letters";
import { sfx } from "@/lib/sfx";
import { daysBetween } from "@/lib/storage";

import { Couple } from "./Mascots";
import { WindowScene } from "./WindowScene";

const STAMPS: Record<LetterTheme, string> = {
  miss: "💌",
  badday: "🌧️",
  sleep: "🌙",
  laugh: "😆",
  goodbye: "✈️",
  rain: "☂️",
  birthday: "🎂",
};

const OVERLAY_BG: Record<LetterTheme, string> = {
  miss: "linear-gradient(#F9C3D1,#FFE9EE)",
  badday: "linear-gradient(#FFD9B8,#FFE9EE)",
  sleep: "linear-gradient(#2E2048,#6A4A7A)",
  laugh: "linear-gradient(#FFE8A3,#FFF3D0)",
  goodbye: "linear-gradient(#CDE6F5,#FFE1E8)",
  rain: "linear-gradient(#9DB4C8,#C9D6E2)",
  birthday: "linear-gradient(#F4A6BC,#FFE8A3)",
};

const COMFORT = [
  "You are doing better than you think.",
  "Tonight, you are allowed to rest.",
  "I'm proud of you. Always.",
  "Whatever it was, we'll face it together, even from far away.",
];

/* ---------------------------------------------------------------- */
/* Envelope (used in the grid)                                       */
/* ---------------------------------------------------------------- */
function Envelope({ letter, index, opened, onOpen }: { letter: Letter; index: number; opened: boolean; onOpen: () => void }) {
  const rot = [-3, 2.5, -1.5, 3, -2.5, 1.5, -2][index % 7] ?? 0;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className="relative block w-full text-left"
      style={{ rotate: rot, aspectRatio: "10 / 7" }}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.08 * index, type: "spring", stiffness: 220, damping: 16 }}
      whileHover={{ y: -6, rotate: rot * 0.4 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Open when ${letter.label}`}
    >
      <div className="paper card-shadow absolute inset-0 rounded-md border-2 border-cocoa" />
      <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
        <path d="M1 1 L50 40 L99 1" fill="none" stroke="#5B3A3A" strokeOpacity=".55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M1 69 L38 33 M99 69 L62 33" fill="none" stroke="#5B3A3A" strokeOpacity=".3" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* stamp */}
      <div className="absolute right-2 top-2 flex h-8 w-7 items-center justify-center rounded-[3px] border border-dashed border-berry bg-blush text-sm">{STAMPS[letter.theme]}</div>
      {/* wax seal */}
      <div className="absolute left-1/2 top-[34%] flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-berry text-[12px] text-white shadow-[0_2px_0_#5B3A3A55]">
        {opened ? "✓" : "♥"}
      </div>
      <div className="absolute inset-x-2.5 bottom-2">
        <p className="font-hand text-[10px] leading-none text-cocoa/60">Open when</p>
        <p className="font-hand text-[13px] font-semibold leading-tight text-cocoa">{letter.label}</p>
      </div>
      {opened && (
        <span className="font-hand absolute -left-1 -top-2 rotate-[-8deg] rounded bg-sage px-1.5 py-0.5 text-[10px] font-semibold text-cocoa shadow">opened ✓</span>
      )}
    </motion.button>
  );
}

export function LettersHome({
  letters,
  opened,
  onOpen,
  onFinale,
  birthday,
}: {
  letters: Letter[];
  opened: string[];
  onOpen: (id: string) => void;
  onFinale: () => void;
  birthday: boolean;
}) {
  const regular = letters.filter((l) => !l.bonus);
  const done = regular.filter((l) => opened.includes(l.id)).length;
  return (
    <div>
      <WindowScene compact />
      <div className="px-5 pb-4 pt-5 text-center">
        <h2 className="font-hand text-2xl font-semibold leading-snug">{GIFT.her.full},</h2>
        <p className="font-serif mt-1 text-sm italic text-cocoa/70">
          {regular.length} letters from {GIFT.him.full}
        </p>
        {birthday && <p className="font-hand mt-2 text-sm text-berry">🎂 There's a special one waiting just for today 🎂</p>}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-5 pb-4">
        {letters.map((l, i) => (
          <Envelope key={l.id} letter={l} index={i} opened={opened.includes(l.id)} onOpen={() => onOpen(l.id)} />
        ))}
      </div>
      <div className="px-5 pb-8 pt-2 text-center">
        <p className="font-hand text-xs text-cocoa/60">
          {done} of {regular.length} opened
        </p>
        <button
          type="button"
          onClick={onFinale}
          className="font-display mt-3 rounded-full border-2 border-cocoa bg-blush px-5 py-2 text-sm font-semibold"
          style={{ boxShadow: "0 3px 0 #5B3A3A" }}
        >
          {done === regular.length ? "The ending… 💗" : "Peek at the ending 👀"}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Letter modal                                                      */
/* ---------------------------------------------------------------- */
function useTypewriter(text: string, active: boolean) {
  const [n, setN] = useState(0);
  const reduced = useRef(false);
  useEffect(() => {
    reduced.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);
  useEffect(() => {
    if (!active) return;
    if (reduced.current) {
      setN(text.length);
      return;
    }
    setN(0);
    const id = window.setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          window.clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 22);
    return () => window.clearInterval(id);
  }, [text, active]);
  return { shown: text.slice(0, n), done: n >= text.length, skip: () => setN(text.length) };
}

function Rain() {
  const drops = useMemo(
    () => Array.from({ length: 34 }, (_, i) => ({ left: (i * 37) % 100, delay: (i * 0.37) % 2.4, dur: 0.9 + ((i * 13) % 10) / 12 })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {drops.map((d, i) => (
        <span key={i} className="raindrop" style={{ left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
      ))}
    </div>
  );
}

function NightSky() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => (
        <span key={i} className="twinkle absolute text-[10px] text-butter" style={{ left: `${(i * 47) % 100}%`, top: `${(i * 29) % 90}%`, animationDelay: `${(i % 7) * 0.35}s` }}>
          ✦
        </span>
      ))}
      <span className="absolute left-6 top-6 text-4xl">🌙</span>
    </div>
  );
}

function Hearts({ burst }: { burst: number }) {
  const items = useMemo(
    () => (burst ? Array.from({ length: 7 }, (_, i) => ({ id: `${burst}-${i}`, x: (i - 3) * 16 + ((i * 7) % 9), emoji: ["💗", "💖", "🩷"][i % 3] })) : []),
    [burst],
  );
  return (
    <div className="pointer-events-none relative h-0 w-full" aria-hidden>
      <AnimatePresence>
        {items.map((h) => (
          <motion.span
            key={h.id}
            className="absolute left-1/2 top-0 text-xl"
            initial={{ opacity: 1, y: 0, x: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -110, x: h.x, scale: 1.2 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            {h.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Extras({ letter }: { letter: Letter }) {
  const [burst, setBurst] = useState(0);
  const [hug, setHug] = useState(false);
  const [line, setLine] = useState(COMFORT[0]);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysBetween(new Date(), new Date(`${GIFT.nextMeeting}T00:00:00`)));
  }, []);

  const btn = "font-display rounded-full border-2 border-cocoa px-4 py-1.5 text-sm font-semibold";
  const sh = { boxShadow: "0 3px 0 #5B3A3A" };

  switch (letter.theme) {
    case "miss":
      return (
        <div className="mt-5 flex flex-col items-center gap-2">
          <Hearts burst={burst} />
          <div className="flex gap-2">
            <button
              type="button"
              className={`${btn} bg-blush`}
              style={sh}
              onClick={() => {
                sfx.mwah();
                setBurst((b) => b + 1);
              }}
            >
              Send a heart 💗
            </button>
            {GIFT.callLink && (
              <a href={GIFT.callLink} className={`${btn} bg-butter`} style={sh}>
                Call {GIFT.him.nick} 📞
              </a>
            )}
          </div>
        </div>
      );
    case "badday":
      return (
        <div className="mt-5 flex flex-col items-center gap-2">
          <Couple hug={hug} size={70} mood={hug ? "blush" : "sad"} />
          <p className="font-hand min-h-5 text-center text-sm text-cocoa/80">{hug ? line : ""}</p>
          <button
            type="button"
            className={`${btn} bg-blush`}
            style={sh}
            onClick={() => {
              sfx.pop();
              setLine(COMFORT[Math.floor(Math.random() * COMFORT.length)]);
              setHug(true);
              window.setTimeout(() => setHug(false), 3200);
            }}
          >
            Hug 🤗
          </button>
        </div>
      );
    case "sleep":
      return (
        <div className="mt-5 text-center">
          <div className="relative inline-block text-3xl">
            🌙<span className="zzz font-hand absolute -right-6 -top-2 text-base">z</span>
            <span className="zzz font-hand absolute -right-3 -top-5 text-sm" style={{ animationDelay: "1.1s" }}>
              z
            </span>
          </div>
          <p className="font-hand mt-1 text-base">Good night, {GIFT.her.nick}</p>
        </div>
      );
    case "laugh":
      return (
        <div className="mt-5 text-center">
          <button
            type="button"
            className={`${btn} bg-butter`}
            style={sh}
            onClick={() => {
              sfx.pop();
              const heartEyes = confetti.shapeFromText({ text: "😍", scalar: 2 });
              confetti({ particleCount: 26, spread: 90, origin: { y: 0.7 }, shapes: [heartEyes], scalar: 2, flat: true });
            }}
          >
            Smile for me 😊
          </button>
        </div>
      );
    case "goodbye":
      return (
        <div className="mt-5 text-center">
          <svg viewBox="0 0 200 46" className="mx-auto w-full max-w-[220px]" aria-hidden>
            <path d="M12 34 C 60 -6, 140 -6, 188 34" fill="none" stroke="#E8607F" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
            <text x="2" y="44" fontSize="11">📍</text>
            <text x="178" y="44" fontSize="11">📍</text>
            <motion.text fontSize="14" initial={{ x: 20, y: 22 }} animate={{ x: [20, 90, 170], y: [22, 6, 22] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
              ✈️
            </motion.text>
          </svg>
          <p className="font-hand text-sm">
            {days === null ? "…" : days > 0 ? `${days} days until our next hello` : days === 0 ? "Today is our hello! 🎉" : "We said hello already 💗"}
          </p>
        </div>
      );
    case "rain":
      return <p className="mt-5 text-center text-3xl">☂️</p>;
    case "birthday":
      return <p className="mt-5 text-center text-4xl">🎂</p>;
  }
}

export function LetterModal({
  letter,
  onClose,
  onPrev,
  onNext,
  onOpened,
}: {
  letter: Letter;
  onClose: () => void;
  onPrev?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  onOpened: (id: string) => void;
}) {
  const [phase, setPhase] = useState<"env" | "paper">("env");
  const { shown, done, skip } = useTypewriter(letter.body, phase === "paper");
  const dark = letter.theme === "sleep";

  useEffect(() => {
    sfx.pop();
    const t1 = window.setTimeout(() => sfx.page(), 900);
    const t2 = window.setTimeout(() => {
      setPhase("paper");
      onOpened(letter.id);
      if (letter.theme === "birthday") {
        confetti({ particleCount: 90, spread: 90, origin: { y: 0.4 }, colors: ["#F4A6BC", "#E8607F", "#FFE8A3", "#BFD8B8"] });
      }
    }, 1500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter.id]);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: OVERLAY_BG[letter.theme] }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Open when ${letter.label}`}
    >
      {letter.theme === "rain" && <Rain />}
      {letter.theme === "sleep" && <NightSky />}
      {letter.theme === "miss" && (
        <>
          <motion.span className="absolute left-0 top-16 text-2xl" animate={{ x: [0, 140, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
            🐦
          </motion.span>
          <motion.span className="absolute right-0 top-16 text-2xl" animate={{ x: [0, -140, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
            🐦
          </motion.span>
        </>
      )}

      <button
        type="button"
        onClick={onClose}
        className={`font-display fixed right-4 top-4 z-10 h-10 w-10 rounded-full border-2 border-cocoa bg-cream text-lg`}
        style={{ boxShadow: "0 3px 0 #5B3A3A" }}
        aria-label="Close letter"
      >
        ✕
      </button>

      <div className="relative mx-auto flex min-h-full max-w-md flex-col items-center justify-center px-5 py-16">
        <AnimatePresence mode="wait">
          {phase === "env" ? (
            <motion.div
              key="env"
              className="relative"
              style={{ width: 260, height: 182, perspective: 800 }}
              initial={{ scale: 0.6, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ y: 160, opacity: 0, transition: { duration: 0.35 } }}
              transition={{ type: "spring", stiffness: 180, damping: 14 }}
            >
              <div className="paper card-shadow absolute inset-0 rounded-md border-2 border-cocoa" />
              <motion.div
                className="absolute inset-x-0 top-0 h-[58%] origin-top border-x-2 border-t-2 border-cocoa bg-blush"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", backfaceVisibility: "visible" }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 178 }}
                transition={{ delay: 0.55, duration: 0.7, ease: "easeInOut" }}
              />
              <motion.div className="absolute left-1/2 top-[48%] z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-berry text-white" initial={{ scale: 1 }} animate={{ scale: [1, 1.25, 0], opacity: [1, 1, 0] }} transition={{ delay: 0.3, duration: 0.5 }}>
                ♥
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="paper" className="relative w-full" initial={{ y: 280, opacity: 0, rotate: 3 }} animate={{ y: 0, opacity: 1, rotate: -0.6 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
              <div className="washi absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-[-3deg] rounded-sm" />
              <div className="lined card-shadow relative rounded-xl border-2 border-cocoa px-6 pb-6 pt-8" onClick={() => !done && skip()}>
                <p className="font-hand text-xs text-cocoa/60">Open when {letter.label}</p>
                <p className="font-hand mt-3 text-xl font-semibold">Dear {GIFT.her.nick},</p>
                <p className="font-hand mt-2 min-h-[10rem] whitespace-pre-wrap text-[17px] leading-8">
                  {shown}
                  {!done && <span className="ml-0.5 inline-block animate-pulse text-berry">✎</span>}
                </p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 0.6 }}>
                  <p className="font-hand mt-3 text-right text-xl font-semibold text-berry">— {GIFT.him.nick}</p>
                  {done && <Extras letter={letter} />}
                </motion.div>
                <div className="absolute -bottom-3 -right-2 flex h-9 w-9 rotate-12 items-center justify-center rounded-full bg-berry text-white shadow">♥</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "paper" && (
          <div className="mt-8 flex w-full items-center justify-between">
            <button type="button" disabled={!onPrev} onClick={onPrev} className={`font-display rounded-full border-2 border-cocoa bg-cream px-4 py-1.5 text-sm font-semibold disabled:opacity-30 ${dark ? "" : ""}`} style={{ boxShadow: "0 3px 0 #5B3A3A" }}>
              ← Prev
            </button>
            <button type="button" onClick={onClose} className={`font-hand text-sm underline underline-offset-4 ${dark ? "text-white" : "text-cocoa"}`}>
              Back to letters
            </button>
            <button type="button" disabled={!onNext} onClick={onNext} className="font-display rounded-full border-2 border-cocoa bg-cream px-4 py-1.5 text-sm font-semibold disabled:opacity-30" style={{ boxShadow: "0 3px 0 #5B3A3A" }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
