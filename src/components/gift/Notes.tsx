import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { GIFT, STICKERS } from "@/data/config";
import { supabase } from "@/integrations/supabase/client";
import { addGiftNote, bumpMissCount, getGiftState, type GiftNote } from "@/lib/gift.functions";
import { sfx } from "@/lib/sfx";
import { useStored } from "@/lib/storage";

const PAPER = ["#FFE8A3", "#FFD6E0", "#D8EBD3", "#FFE1CF", "#F9C3D1"];

export function NotesTab({ code }: { code: string }) {
  const [notes, setNotes] = useState<GiftNote[]>([]);
  const [count, setCount] = useState(0);
  const [online, setOnline] = useState<boolean | null>(null);
  const [localNotes, setLocalNotes, ready] = useStored<GiftNote[]>("notes-local", []);
  const [localCount, setLocalCount] = useStored<number>("miss-local", 0);
  const [text, setText] = useState("");
  const [sticker, setSticker] = useState<string>(STICKERS[0]);
  const [sending, setSending] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);
  const nextHeart = useRef(0);

  const refresh = useCallback(async () => {
    try {
      const s = await getGiftState({ data: { code } });
      setNotes(s.notes);
      setCount(s.missCount);
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, [code]);

  useEffect(() => {
    void refresh();
    const poll = window.setInterval(() => void refresh(), 25000);
    let cleanup: (() => void) | undefined;
    try {
      const ch = supabase
        .channel("may-gift-updates")
        .on("broadcast", { event: "gift-updated" }, () => void refresh())
        .subscribe();
      cleanup = () => void supabase.removeChannel(ch);
    } catch {
      /* realtime is optional */
    }
    return () => {
      window.clearInterval(poll);
      cleanup?.();
    };
  }, [refresh]);

  const shownNotes = online ? notes : localNotes;
  const shownCount = online ? count : localCount;

  async function send() {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    sfx.pop();
    try {
      const s = await addGiftNote({ data: { code, body, sticker } });
      setNotes(s.notes);
      setCount(s.missCount);
      setOnline(true);
    } catch {
      setOnline(false);
      setLocalNotes((n) => [{ id: crypto.randomUUID(), body, sticker, created_at: new Date().toISOString() }, ...n]);
    }
    setText("");
    setSending(false);
  }

  async function miss() {
    sfx.mwah();
    const id = nextHeart.current++;
    setHearts((h) => [...h, id]);
    window.setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 1300);
    if (online) {
      setCount((c) => c + 1);
      try {
        const r = await bumpMissCount({ data: { code } });
        setCount(r.missCount);
      } catch {
        setOnline(false);
        setLocalCount((c) => c + 1);
      }
    } else {
      setLocalCount((c) => c + 1);
    }
  }

  return (
    <div className="px-5 pb-10 pt-6">
      <h2 className="font-display text-center text-2xl font-bold">Leave {GIFT.him.nick} a note</h2>
      <p className="font-hand text-center text-sm text-cocoa/70">sticky notes that fly across the distance</p>

      {/* miss-you button */}
      <div className="relative mt-6 flex flex-col items-center">
        <AnimatePresence>
          {hearts.map((id) => (
            <motion.span key={id} className="pointer-events-none absolute top-6 text-2xl" initial={{ opacity: 1, y: 0, x: ((id * 37) % 60) - 30 }} animate={{ opacity: 0, y: -90 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
              💗
            </motion.span>
          ))}
        </AnimatePresence>
        <motion.button type="button" onClick={miss} whileTap={{ scale: 0.82 }} whileHover={{ scale: 1.05 }} className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-cocoa bg-berry text-white" style={{ boxShadow: "0 5px 0 #5B3A3A" }} aria-label="I miss you">
          <span className="text-5xl">♥</span>
        </motion.button>
        <p className="font-display mt-3 text-lg font-bold">I miss you</p>
        <p className="font-hand text-sm text-cocoa/70">
          tapped <span className="font-bold text-berry">{shownCount}</span> times
        </p>
      </div>

      {/* write */}
      <div className="paper card-shadow relative mt-6 rounded-2xl border-2 border-cocoa p-4">
        <div className="washi absolute -top-2.5 right-6 h-5 w-16 rotate-3 rounded-sm" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={280} rows={3} placeholder={`Dear ${GIFT.him.nick}…`} className="font-hand w-full resize-none bg-transparent text-base leading-7 outline-none placeholder:text-cocoa/40" />
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {STICKERS.map((s) => (
              <button key={s} type="button" onClick={() => setSticker(s)} className={`h-8 w-8 rounded-lg text-lg ${sticker === s ? "bg-blush ring-2 ring-berry" : ""}`} aria-label={`Sticker ${s}`} aria-pressed={sticker === s}>
                {s}
              </button>
            ))}
          </div>
          <button type="button" onClick={send} disabled={!text.trim() || sending} className="font-display shrink-0 rounded-full border-2 border-cocoa bg-butter px-4 py-1.5 text-sm font-semibold disabled:opacity-40" style={{ boxShadow: "0 3px 0 #5B3A3A" }}>
            Pin it 📌
          </button>
        </div>
      </div>

      {online === false && ready && <p className="font-hand mt-2 text-center text-xs text-cocoa/50">offline mode: notes are saved on this phone only</p>}

      {/* board */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <AnimatePresence initial={false}>
          {shownNotes.map((n, i) => (
            <motion.div key={n.id} layout className="relative rounded-sm p-3 pt-5 shadow-md" style={{ background: PAPER[i % PAPER.length], rotate: ((i * 53) % 9) - 4 }} initial={{ opacity: 0, y: -30, scale: 1.15 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}>
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-base">📌</span>
              <p className="font-hand break-words text-sm leading-5">{n.body}</p>
              <p className="mt-2 text-right text-lg">{n.sticker}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {shownNotes.length === 0 && <p className="font-hand mt-4 text-center text-sm text-cocoa/50">no notes yet, be the first 💌</p>}
    </div>
  );
}
