import { createFileRoute } from "@tanstack/react-router";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Finale } from "@/components/gift/Finale";
import { Gate, Loader } from "@/components/gift/Gate";
import { Intro } from "@/components/gift/Intro";
import { LetterModal, LettersHome } from "@/components/gift/Letters";
import { MoodsTab } from "@/components/gift/Moods";
import { NotesTab } from "@/components/gift/Notes";
import { UsTab } from "@/components/gift/Us";
import { WishesTab } from "@/components/gift/Wishes";
import { GIFT, getPasscode } from "@/data/config";
import { LETTERS } from "@/data/letters";
import { isMuted, setMuted, sfx } from "@/lib/sfx";
import { useStored } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "For Mây 💗" },
      { name: "description", content: "A little gift of letters, just for you." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Index,
});

type Stage = "loading" | "gate" | "intro" | "app";
type Tab = "letters" | "us" | "moods" | "wishes" | "notes";

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "letters", icon: "💌", label: "Letters" },
  { id: "us", icon: "🗺️", label: "Us" },
  { id: "moods", icon: "🥰", label: "Moods" },
  { id: "wishes", icon: "🫙", label: "Wishes" },
  { id: "notes", icon: "📌", label: "Notes" },
];

const CODE_KEY = "miss-you:code";

function Index() {
  const [stage, setStage] = useState<Stage>("loading");
  const [code, setCode] = useState("");
  const [tab, setTab] = useState<Tab>("letters");
  const [openId, setOpenId] = useState<string | null>(null);
  const [finale, setFinale] = useState(false);
  const [opened, setOpened] = useStored<string[]>("opened", []);
  const [muted, setMutedState] = useState(false);
  const [birthday, setBirthday] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // loader -> gate (or straight in if she already entered the code this session)
  useEffect(() => {
    const t = window.setTimeout(() => {
      const saved = window.sessionStorage.getItem(CODE_KEY);
      if (saved && saved === getPasscode()) {
        setCode(saved);
        setStage("app");
      } else {
        setStage("gate");
      }
    }, 1400);
    return () => window.clearTimeout(t);
  }, []);

  // birthday detection (add ?birthday=1 to preview it)
  useEffect(() => {
    const now = new Date();
    const isBirthday = now.getMonth() + 1 === GIFT.birthday.month && now.getDate() === GIFT.birthday.day;
    setBirthday(isBirthday || new URLSearchParams(window.location.search).has("birthday"));
  }, []);

  useEffect(() => {
    if (stage === "app" && birthday) {
      confetti({ particleCount: 110, spread: 100, origin: { y: 0.3 }, colors: ["#F4A6BC", "#E8607F", "#FFE8A3", "#BFD8B8"] });
    }
  }, [stage, birthday]);

  const letters = useMemo(() => LETTERS.filter((l) => !l.bonus || birthday), [birthday]);
  const idx = letters.findIndex((l) => l.id === openId);
  const current = idx >= 0 ? (letters[idx] ?? null) : null;
  const prev = idx > 0 ? letters[idx - 1] : undefined;
  const next = idx >= 0 ? letters[idx + 1] : undefined;

  const unlock = useCallback((c: string) => {
    window.sessionStorage.setItem(CODE_KEY, c);
    setCode(c);
    setStage("intro");
    if (GIFT.musicUrl && audioRef.current) {
      audioRef.current.volume = 0.35;
      void audioRef.current.play().catch(() => undefined);
    }
  }, []);

  function toggleSound() {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
    const a = audioRef.current;
    if (a) {
      if (next) a.pause();
      else void a.play().catch(() => undefined);
    }
  }

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  const markOpened = useCallback((id: string) => setOpened((o) => (o.includes(id) ? o : [...o, id])), [setOpened]);

  return (
    <div className="wallpaper min-h-[100dvh]">
      <div className="relative mx-auto min-h-[100dvh] max-w-[430px] bg-milk md:my-5 md:min-h-[calc(100dvh-2.5rem)] md:rounded-[36px] md:border-4 md:border-cocoa md:shadow-2xl">
        {GIFT.musicUrl && <audio ref={audioRef} src={GIFT.musicUrl} loop preload="none" />}

        {stage !== "loading" && stage !== "gate" && (
          <button type="button" onClick={toggleSound} className="font-display absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border-2 border-cocoa bg-cream text-base" style={{ boxShadow: "0 2px 0 #5B3A3A" }} aria-label={muted ? "Turn sound on" : "Turn sound off"}>
            {muted ? "🔇" : "🔊"}
          </button>
        )}

        <AnimatePresence mode="wait">
          {stage === "loading" && (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <Loader />
            </motion.div>
          )}
          {stage === "gate" && (
            <motion.div key="gate" exit={{ opacity: 0 }}>
              <Gate onUnlock={unlock} />
            </motion.div>
          )}
          {stage === "intro" && (
            <motion.div key="intro" exit={{ opacity: 0 }}>
              <Intro onDone={() => setStage("app")} count={letters.filter((l) => !l.bonus).length} />
            </motion.div>
          )}
          {stage === "app" && (
            <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[100dvh] flex-col md:min-h-[calc(100dvh-2.5rem)]">
              <main className="flex-1 pb-20">
                <AnimatePresence mode="wait">
                  <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                    {tab === "letters" && <LettersHome letters={letters} opened={opened} onOpen={setOpenId} onFinale={() => { sfx.page(); setFinale(true); }} birthday={birthday} />}
                    {tab === "us" && <UsTab />}
                    {tab === "moods" && <MoodsTab onOpenLetter={(id) => { setTab("letters"); setOpenId(id); }} />}
                    {tab === "wishes" && <WishesTab />}
                    {tab === "notes" && <NotesTab code={code} />}
                  </motion.div>
                </AnimatePresence>
              </main>

              <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t-2 border-cocoa bg-cream px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 md:bottom-5 md:rounded-b-[32px]" aria-label="Sections">
                <ul className="flex justify-around">
                  {TABS.map((t) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => { sfx.tap(); setTab(t.id); }}
                        className={`flex w-16 flex-col items-center rounded-2xl py-1 ${tab === t.id ? "bg-blush" : ""}`}
                        aria-current={tab === t.id ? "page" : undefined}
                      >
                        <motion.span className="text-xl" animate={tab === t.id ? { y: [0, -5, 0], scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.35 }}>
                          {t.icon}
                        </motion.span>
                        <span className="font-hand text-[11px] font-semibold">{t.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {current && (
          <LetterModal
            key={current.id}
            letter={current}
            onClose={() => setOpenId(null)}
            onPrev={prev ? () => setOpenId(prev.id) : undefined}
            onNext={next ? () => setOpenId(next.id) : undefined}
            onOpened={markOpened}
          />
        )}
        {finale && <Finale key="finale" onClose={() => setFinale(false)} />}
      </AnimatePresence>
    </div>
  );
}
