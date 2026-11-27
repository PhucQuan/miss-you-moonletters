CREATE OR REPLACE FUNCTION public.increment_gift_miss_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE public.gift_miss_count
  SET count = count + 1, updated_at = now()
  WHERE singleton = true
  RETURNING count INTO updated_count;
  RETURN updated_count;
END;
$$;
REVOKE ALL ON FUNCTION public.increment_gift_miss_count() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_gift_miss_count() TO service_role;