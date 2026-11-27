CREATE TABLE public.gift_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  body text NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 280),
  sticker text NOT NULL DEFAULT '🌷' CHECK (char_length(sticker) <= 12),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gift_notes TO service_role;
ALTER TABLE public.gift_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gift notes are managed by the site server" ON public.gift_notes
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.gift_miss_count (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  count integer NOT NULL DEFAULT 0 CHECK (count >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gift_miss_count TO service_role;
ALTER TABLE public.gift_miss_count ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gift counter is managed by the site server" ON public.gift_miss_count
  FOR ALL TO service_role USING (true) WITH CHECK (true);
INSERT INTO public.gift_miss_count (singleton, count) VALUES (true, 0);

CREATE OR REPLACE FUNCTION public.notify_private_gift_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM realtime.send(
    jsonb_build_object('refresh', true),
    'gift-updated',
    'may-gift-updates',
    false
  );
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.notify_private_gift_update() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.notify_private_gift_update() TO service_role;
CREATE TRIGGER gift_notes_realtime_update
  AFTER INSERT ON public.gift_notes
  FOR EACH ROW EXECUTE FUNCTION public.notify_private_gift_update();
CREATE TRIGGER gift_count_realtime_update
  AFTER UPDATE ON public.gift_miss_count
  FOR EACH ROW EXECUTE FUNCTION public.notify_private_gift_update();