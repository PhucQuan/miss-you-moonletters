import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type TimeOfDay = "day" | "dusk" | "night";

export function useTimeOfDay(): TimeOfDay {
  const [t, setT] = useState<TimeOfDay>("day");
  useEffect(() => {
    const h = new Date().getHours();
    setT(h >= 19 || h < 5 ? "night" : h >= 17 ? "dusk" : "day");
  }, []);
  return t;
}

const SKY: Record<TimeOfDay, [string, string]> = {
  day: ["#BFE3F5", "#FFE9EE"],
  dusk: ["#F7A8B8", "#FFD9B8"],
  night: ["#3B2A5A", "#8A5A86"],
};

/** A cozy flat-illustrated window. `open` swings the panes open. `compact` is the small shelf version. */
export function WindowScene({ open = false, compact = false, bird = false }: { open?: boolean; compact?: boolean; bird?: boolean }) {
  const time = useTimeOfDay();
  const [top, bottom] = SKY[time];
  const night = time === "night";
  const h = compact ? 150 : 250;
  return (
    <div className="relative mx-auto w-full overflow-hidden" style={{ height: h, background: "linear-gradient(#FFD6E0,#F9C3D1)" }}>
      {/* sky behind the window */}
      <div className="absolute left-1/2 top-4 h-[72%] w-[64%] -translate-x-1/2 overflow-hidden rounded-t-[40px] border-4 border-cocoa" style={{ background: `linear-gradient(${top},${bottom})` }}>
        {night ? (
          <>
            {[
              [12, 14],
              [70, 22],
              [40, 40],
              [85, 55],
              [22, 62],
              [58, 12],
            ].map(([x, y], i) => (
              <span key={i} className="twinkle absolute text-[10px] text-butter" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }}>
                ✦
              </span>
            ))}
            <span className="absolute right-[14%] top-[16%] text-2xl">🌙</span>
          </>
        ) : (
          <>
            <div className="cloud-drift absolute top-[22%] h-5 w-14 rounded-full bg-white/90" />
            <div className="cloud-drift absolute top-[48%] h-4 w-10 rounded-full bg-white/80" style={{ animationDelay: "-16s" }} />
            {time === "dusk" ? <span className="absolute bottom-[10%] right-[18%] text-2xl">🌇</span> : <span className="absolute right-[14%] top-[14%] text-2xl">☀️</span>}
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-sage/70" />
      </div>
      {/* window frame + panes */}
      <div className="pointer-events-none absolute left-1/2 top-4 flex h-[72%] w-[64%] -translate-x-1/2 overflow-hidden rounded-t-[40px]" style={{ perspective: 600 }}>
        <motion.div
          className="h-full w-1/2 origin-left border-r-2 border-cocoa bg-white/30"
          initial={false}
          animate={{ rotateY: open ? -105 : 0 }}
          transition={{ duration: 1.1, ease: [0.3, 0.7, 0.2, 1] }}
          style={{ backgroundImage: "linear-gradient(transparent 49%, #5B3A3A 49% 51%, transparent 51%)", transformStyle: "preserve-3d" }}
        />
        <motion.div
          className="h-full w-1/2 origin-right border-l-2 border-cocoa bg-white/30"
          initial={false}
          animate={{ rotateY: open ? 105 : 0 }}
          transition={{ duration: 1.1, ease: [0.3, 0.7, 0.2, 1] }}
          style={{ backgroundImage: "linear-gradient(transparent 49%, #5B3A3A 49% 51%, transparent 51%)", transformStyle: "preserve-3d" }}
        />
      </div>
      {/* curtains */}
      <div className="absolute left-0 top-0 h-[84%] w-[20%] rounded-br-[60px] bg-berry/80" />
      <div className="absolute right-0 top-0 h-[84%] w-[20%] rounded-bl-[60px] bg-berry/80" />
      <div className="absolute left-[16%] top-2 h-3 w-[68%] rounded-full bg-cocoa/70" />
      {/* sill + props */}
      <div className="absolute inset-x-0 bottom-0 h-[20%] bg-cocoa/90" />
      <div className="absolute inset-x-[6%] bottom-[18%] h-3 rounded-sm bg-[#9B6B52]" />
      <div className="absolute bottom-[26%] left-[8%] flex flex-col items-center">
        <div className="flame h-3 w-2 rounded-full bg-butter" style={{ boxShadow: "0 0 0 2px #F4A6BC66" }} />
        <div className="h-8 w-3 rounded-sm bg-white" />
        <div className="h-1.5 w-7 rounded-full bg-butter" />
      </div>
      <div className="absolute bottom-[26%] right-[9%] text-3xl">🪶</div>
      <div className="absolute bottom-[26%] right-[20%] text-2xl">🪴</div>
      {!compact && <div className="absolute bottom-[26%] left-[24%] text-2xl">📻</div>}
      {bird && (
        <motion.div className="absolute text-3xl" initial={{ left: "-12%", top: "20%" }} animate={{ left: "44%", top: "52%" }} transition={{ delay: 1, duration: 1.6, ease: "easeOut" }}>
          🐦
        </motion.div>
      )}
    </div>
  );
}
