import { motion } from "framer-motion";

export type MascotMood = "idle" | "happy" | "sleepy" | "sad" | "blush";

const OUT = "#5B3A3A";

function Face({ mood, cx, cy }: { mood: MascotMood; cx: number; cy: number }) {
  const eyeY = cy - 2;
  const dx = 15;
  return (
    <g>
      {mood === "sleepy" ? (
        <>
          <path d={`M${cx - dx - 5} ${eyeY} q5 4 10 0`} stroke={OUT} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d={`M${cx + dx - 5} ${eyeY} q5 4 10 0`} stroke={OUT} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "happy" || mood === "blush" ? (
        <>
          <path d={`M${cx - dx - 5} ${eyeY + 2} q5 -6 10 0`} stroke={OUT} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d={`M${cx + dx - 5} ${eyeY + 2} q5 -6 10 0`} stroke={OUT} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <g className="blink">
          <ellipse cx={cx - dx} cy={eyeY} rx="3.2" ry={mood === "sad" ? 4.2 : 3.6} fill={OUT} />
          <ellipse cx={cx + dx} cy={eyeY} rx="3.2" ry={mood === "sad" ? 4.2 : 3.6} fill={OUT} />
          <circle cx={cx - dx + 1} cy={eyeY - 1.2} r="1.1" fill="#fff" />
          <circle cx={cx + dx + 1} cy={eyeY - 1.2} r="1.1" fill="#fff" />
        </g>
      )}
      <ellipse cx={cx - 24} cy={cy + 8} rx="6" ry="4" fill="#F4A6BC" opacity={mood === "blush" ? 1 : 0.75} />
      <ellipse cx={cx + 24} cy={cy + 8} rx="6" ry="4" fill="#F4A6BC" opacity={mood === "blush" ? 1 : 0.75} />
      {mood === "sad" ? (
        <path d={`M${cx - 5} ${cy + 13} q5 -5 10 0`} stroke={OUT} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ) : (
        <path d={`M${cx - 6} ${cy + 8} q3 4 6 0 q3 4 6 0`} stroke={OUT} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
    </g>
  );
}

export function Cat({ mood = "idle", size = 120 }: { mood?: MascotMood; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="cat mascot">
      {/* tail */}
      <path d="M92 96c16 0 20-16 10-24" stroke={OUT} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* body */}
      <ellipse cx="60" cy="96" rx="30" ry="20" fill="#FFE6D6" stroke={OUT} strokeWidth="3" />
      {/* scarf */}
      <path d="M36 80c14 8 34 8 48 0l3 10c-16 10-38 10-54 0z" fill="#E8607F" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M78 88l6 18 8-3-4-16z" fill="#E8607F" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      {/* ears */}
      <path d="M26 44L30 14l24 18z" fill="#FFE6D6" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M94 44L90 14 66 32z" fill="#FFE6D6" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 36l1-12 11 8z" fill="#F4A6BC" />
      <path d="M88 36l-1-12-11 8z" fill="#F4A6BC" />
      {/* head */}
      <ellipse cx="60" cy="54" rx="38" ry="31" fill="#FFE6D6" stroke={OUT} strokeWidth="3" />
      <Face mood={mood} cx={60} cy={54} />
      <path d="M57 56l3 3 3-3z" fill="#E8607F" />
      {/* whiskers */}
      <path d="M26 54l-12-2M26 60l-12 3M94 54l12-2M94 60l12 3" stroke={OUT} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Bunny({ mood = "idle", size = 120 }: { mood?: MascotMood; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="bunny mascot">
      {/* ears */}
      <path d="M38 40C26 8 34 -2 42 4c8 6 10 26 8 38z" fill="#fff" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M82 40C94 8 86 -2 78 4c-8 6-10 26-8 38z" fill="#fff" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M40 34c-5-14-3-20 1-17 3 3 4 11 4 17z" fill="#F4A6BC" />
      <path d="M80 34c5-14 3-20-1-17-3 3-4 11-4 17z" fill="#F4A6BC" />
      {/* body */}
      <ellipse cx="60" cy="98" rx="29" ry="19" fill="#fff" stroke={OUT} strokeWidth="3" />
      <circle cx="94" cy="100" r="8" fill="#fff" stroke={OUT} strokeWidth="3" />
      {/* head */}
      <ellipse cx="60" cy="58" rx="36" ry="30" fill="#fff" stroke={OUT} strokeWidth="3" />
      <Face mood={mood} cx={60} cy={58} />
      <ellipse cx="60" cy="60" rx="3" ry="2.2" fill="#E8607F" />
      {/* straw hat */}
      <ellipse cx="60" cy="33" rx="34" ry="8" fill="#FFE8A3" stroke={OUT} strokeWidth="3" />
      <path d="M40 32c0-16 8-20 20-20s20 4 20 20z" fill="#FFE8A3" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M41 28h38" stroke="#E8607F" strokeWidth="5" />
    </svg>
  );
}

/** The couple. `hug` makes them lean in and shows a heart. */
export function Couple({ hug = false, mood = "idle", size = 110 }: { hug?: boolean; mood?: MascotMood; size?: number }) {
  return (
    <div className="relative inline-flex items-end justify-center" style={{ width: size * 2 }}>
      <motion.div animate={{ x: hug ? size * 0.28 : 0, rotate: hug ? 6 : 0 }} transition={{ type: "spring", stiffness: 160, damping: 12 }}>
        <Cat size={size} mood={hug ? "blush" : mood} />
      </motion.div>
      <motion.div animate={{ x: hug ? -size * 0.28 : 0, rotate: hug ? -6 : 0 }} transition={{ type: "spring", stiffness: 160, damping: 12 }}>
        <Bunny size={size} mood={hug ? "blush" : mood} />
      </motion.div>
      <motion.span
        aria-hidden
        className="absolute -top-1 left-1/2 -translate-x-1/2 text-2xl"
        initial={false}
        animate={{ opacity: hug ? 1 : 0, y: hug ? -10 : 0, scale: hug ? 1 : 0.4 }}
      >
        💗
      </motion.span>
    </div>
  );
}
