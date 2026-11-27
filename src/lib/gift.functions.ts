import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getPasscode } from "@/data/config";

// Shared notes + the "I miss you" counter. The tables are only writable by the server
// (service role), so the browser goes through these server functions.
// The passcode (anniversary DDMM) is re-checked here so strangers can't spam the notes.

const codeSchema = z.object({ code: z.string().length(4) });

function assertCode(code: string) {
  if (code !== getPasscode()) throw new Error("Wrong passcode");
}

export type GiftNote = { id: string; body: string; sticker: string; created_at: string };
export type GiftState = { notes: GiftNote[]; missCount: number };

async function readState(): Promise<GiftState> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [notes, count] = await Promise.all([
    supabaseAdmin.from("gift_notes").select("id, body, sticker, created_at").order("created_at", { ascending: false }).limit(40),
    supabaseAdmin.from("gift_miss_count").select("count").eq("singleton", true).maybeSingle(),
  ]);
  if (notes.error) throw new Error(notes.error.message);
  if (count.error) throw new Error(count.error.message);
  return { notes: notes.data ?? [], missCount: count.data?.count ?? 0 };
}

export const getGiftState = createServerFn({ method: "POST" })
  .inputValidator(codeSchema)
  .handler(async ({ data }) => {
    assertCode(data.code);
    return readState();
  });

export const addGiftNote = createServerFn({ method: "POST" })
  .inputValidator(
    codeSchema.extend({
      body: z.string().trim().min(1).max(280),
      sticker: z.string().min(1).max(12),
    }),
  )
  .handler(async ({ data }) => {
    assertCode(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("gift_notes").insert({ body: data.body, sticker: data.sticker });
    if (error) throw new Error(error.message);
    return readState();
  });

export const bumpMissCount = createServerFn({ method: "POST" })
  .inputValidator(codeSchema)
  .handler(async ({ data }) => {
    assertCode(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: count, error } = await supabaseAdmin.rpc("increment_gift_miss_count");
    if (error) throw new Error(error.message);
    return { missCount: count as number };
  });
