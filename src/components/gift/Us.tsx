import confetti from "canvas-confetti";
import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { GIFT, MEMORIES } from "@/data/config";
import { sfx } from "@/lib/sfx";
import { daysBetween } from "@/lib/storage";

import { Couple } from "./Mascots";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}</span>;
}

function Tag({ big, label, back, tilt }: { big: React.ReactNode; label: string; back?: React.ReactNode; tilt: number }) {
  const [flip, setFlip] = useState(false);
  return (
    <button type="button" onClick={() => { sfx.tap(); setFlip((f) => !f); }} className="relative h-24 w-full" style={{ perspective: 600, rotate: `${tilt}deg` }} aria-label={label}>
      <motion.div className="absolute inset-0" animate={{ rotateY: flip ? 180 : 0 }} transition={{ type: "spring", stiffness: 140, damping: 16 }} style={{ transformStyle: "preserve-3d" }}>
        <div className="paper card-shadow absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-cocoa" style={{ backfaceVisibility: "hidden" }}>
          <span className="font-display text-3xl font-bold text-berry">{big}</span>
          <span className="font-hand text-xs text-cocoa/70">{label}</span>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-cocoa bg-butter" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <span className="font-display text-lg font-bold">{back}</span>
          <span className="font-hand text-xs text-cocoa/70">tap to flip back</span>
        </div>
      </motion.div>
    </button>
  );
}

function DistanceMap() {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { once: true, margin: "-60px" });
  const pathRef = useRef<SVGPathElement>(null);
  const [pos, setPos] = useState({ x: 100, y: 45 });

  useEffect(() => {
    if (!inView || !pathRef.current) return;
    const p = pathRef.current;
    const len = p.getTotalLength();
    const c = animate(0, 1, {
      duration: 5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 0.6,
      onUpdate: (t) => {
        const pt = p.getPointAtLength(t * len);
        setPos({ x: pt.x, y: pt.y });
      },
    });
    return () => c.stop();
  }, [inView]);

  return (
    <div ref={wrap} className="mx-auto w-full max-w-[260px]">
      <svg viewBox="0 0 200 320" className="w-full" role="img" aria-label={`Map from ${GIFT.hisCity} to ${GIFT.herCity}`}>
        <path
          d="M72 12 C90 4 125 8 142 24 C146 34 128 42 118 50 C108 58 114 70 112 84 C110 100 104 112 108 128 C112 148 126 160 130 180 C134 202 142 214 134 236 C126 258 112 262 100 284 C92 298 74 304 66 292 C60 280 74 266 82 250 C92 230 90 216 90 198 C90 178 78 166 76 146 C74 124 68 114 62 96 C56 78 44 66 46 48 C48 32 58 18 72 12 Z"
          fill="#FFE1E8"
          stroke="#5B3A3A"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <motion.path
          ref={pathRef}
          d="M100 48 C 70 80, 140 110, 112 150"
          fill="none"
          stroke="#E8607F"
          strokeWidth="3"
          strokeDasharray="2 8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? 1 : 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
        <g>
          <text x="92" y="40" fontSize="20">📍</text>
          <text x="104" y="166" fontSize="20">📍</text>
          <text x="124" y="46" fontSize="11" className="font-hand" fill="#5B3A3A">{GIFT.hisCity}</text>
          <text x="128" y="162" fontSize="11" className="font-hand" fill="#5B3A3A">{GIFT.herCity}</text>
          <text x={pos.x - 8} y={pos.y + 5} fontSize="16">✈️</text>
        </g>
        <text x="14" y="290" fontSize="14">🌊</text>
        <text x="20" y="200" fontSize="12" className="twinkle">🌊</text>
      </svg>
    </div>
  );
}

export function UsTab() {
  const now = useNow();
  const together = now ? Math.max(0, daysBetween(new Date(`${GIFT.anniversary}T00:00:00`), now)) : 0;
  const untilMeet = now ? daysBetween(now, new Date(`${GIFT.nextMeeting}T00:00:00`)) : null;
  const since = now ? now.getTime() - new Date(`${GIFT.anniversary}T00:00:00`).getTime() : 0;
  const hours = Math.max(0, Math.floor(since / 36e5));
  const mins = Math.max(0, Math.floor(since / 6e4) % 60);
  const secs = Math.max(0, Math.floor(since / 1e3) % 60);
  const fired = useRef(false);

  useEffect(() => {
    if (untilMeet === 0 && !fired.current) {
      fired.current = true;
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
    }
  }, [untilMeet]);

  return (
    <div className="px-5 pb-10 pt-6">
      <h2 className="font-display text-center text-2xl font-bold">
        {GIFT.hisCity} <span className="text-berry">↔</span> {GIFT.herCity}
      </h2>
      <p className="font-hand text-center text-sm text-cocoa/70">the little distance between us</p>

      <div className="mt-4">
        <DistanceMap />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-3">
        <Tag tilt={-2} big={<CountUp to={together} />} label="days together" back={now ? `${hours}h ${mins}m ${secs}s` : "…"} />
        <Tag tilt={2} big={untilMeet === null ? "…" : untilMeet > 0 ? <CountUp to={untilMeet} /> : "🎉"} label={untilMeet !== null && untilMeet <= 0 ? "we're together!" : "days until we meet"} back="every day closer 💗" />
        <Tag tilt={1.5} big={`${GIFT.distanceKm}`} label="kilometres apart" back="just a number" />
        <Tag tilt={-1.5} big="∞" label="missing you" back="and counting" />
      </div>

      <div className="mt-8 flex justify-center">
        <Couple size={80} />
      </div>

      <Memories />
    </div>
  );
}

function Polaroid({ m, i }: { m: (typeof MEMORIES)[number]; i: number }) {
  const [flip, setFlip] = useState(false);
  const [broken, setBroken] = useState(false);
  const rot = [-4, 3, -2, 4, -3, 2][i % 6];
  return (
    <div className="sway relative flex justify-center" style={{ ["--r" as string]: `${rot}deg`, animationDelay: `${i * 0.5}s` }}>
      <div className="washi-yellow absolute -top-2 left-1/2 z-10 h-4 w-12 -translate-x-1/2 rounded-sm" />
      <button type="button" onClick={() => { sfx.tap(); setFlip((f) => !f); }} className="relative w-full" style={{ perspective: 600 }} aria-label={`Photo: ${m.caption}`}>
        <motion.div animate={{ rotateY: flip ? 180 : 0 }} transition={{ type: "spring", stiffness: 140, damping: 16 }} style={{ transformStyle: "preserve-3d" }} className="relative">
          <div className="card-shadow rounded-sm bg-white p-2 pb-6" style={{ backfaceVisibility: "hidden" }}>
            <div className="flex aspect-square items-center justify-center overflow-hidden bg-blush">
              {m.src && !broken ? (
                <img src={m.src} alt={m.caption} loading="lazy" className="h-full w-full object-cover" onError={() => setBroken(true)} />
              ) : (
                <span className="text-4xl">{i % 2 ? "🧸" : "🌷"}</span>
              )}
            </div>
            <p className="font-hand mt-1.5 text-center text-xs">{m.caption}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-butter p-3" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <p className="font-hand text-center text-sm">{m.back}</p>
          </div>
        </motion.div>
      </button>
    </div>
  );
}

function Memories() {
  return (
    <section className="mt-10">
      <h3 className="font-display text-center text-xl font-bold">Our little memory wall</h3>
      <p className="font-hand text-center text-xs text-cocoa/60">tap a photo to flip it</p>
      <div className="relative mt-6">
        <div className="absolute inset-x-0 top-0 h-px bg-cocoa/40" />
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 pt-3">
          {MEMORIES.map((m, i) => (
            <Polaroid key={i} m={m} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
