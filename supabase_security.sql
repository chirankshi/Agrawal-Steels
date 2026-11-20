-- =====================================================================
-- SECURITY LOCK-DOWN (applied 2026-11-19)
--
-- The website ships the Supabase *publishable* key to every visitor, so
-- anything that key may do, anyone may do. After this script:
--   * visitors (anon) can READ products, catalogue, machines and site settings
--   * visitors can SUBMIT an enquiry, but cannot read, change or delete any
--   * nothing else is writable with the public key
--   * the admin desk changes data only through the FastAPI backend, which
--     connects with the database password and checks the admin login token
--
-- Safe to re-run.
-- =====================================================================

-- 1. Drop the old "public can do everything" policies
DROP POLICY IF EXISTS "Public can access categories"     ON public.categories;
DROP POLICY IF EXISTS "Public can access subcategories"  ON public.subcategories;
DROP POLICY IF EXISTS "Public can access machines"       ON public.machines;
DROP POLICY IF EXISTS "Public can access products"       ON public.products;
DROP POLICY IF EXISTS "Public can access site settings"  ON public.site_settings;
DROP POLICY IF EXISTS "Public can view enquiries"        ON public.enquiries;
DROP POLICY IF EXISTS "Public can update enquiries"      ON public.enquiries;
DROP POLICY IF EXISTS "Public can delete enquiries"      ON public.enquiries;
DROP POLICY IF EXISTS "Public can insert enquiries"      ON public.enquiries;

-- 2. Make sure RLS is on everywhere
ALTER TABLE public.categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries     ENABLE ROW LEVEL SECURITY;

-- 3. Read-only access to the public catalogue
DROP POLICY IF EXISTS "Public read categories"    ON public.categories;
DROP POLICY IF EXISTS "Public read subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Public read machines"      ON public.machines;
DROP POLICY IF EXISTS "Public read products"      ON public.products;
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
CREATE POLICY "Public read categories"    ON public.categories    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read subcategories" ON public.subcategories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read machines"      ON public.machines      FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read products"      ON public.products      FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);

-- 4. Enquiries: insert-only for visitors, always arriving as 'pending'
DROP POLICY IF EXISTS "Public submit enquiries" ON public.enquiries;
CREATE POLICY "Public submit enquiries" ON public.enquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND char_length(coalesce(name, ''))    BETWEEN 1 AND 200
    AND char_length(coalesce(phone, ''))   BETWEEN 5 AND 40
    AND char_length(coalesce(email, ''))   <= 200
    AND char_length(coalesce(product, '')) <= 300
    AND char_length(coalesce(message, '')) <= 5000
    AND coalesce(notes, '') = ''
  );

-- 5. Submit function: lets the form get its reference number back without
--    being able to read the table. Runs as the table owner.
CREATE OR REPLACE FUNCTION public.submit_enquiry(
  p_name text, p_phone text, p_email text DEFAULT NULL, p_product text DEFAULT NULL,
  p_message text DEFAULT NULL, p_source text DEFAULT 'website_rfq_form'
) RETURNS bigint
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_id bigint;
BEGIN
  IF char_length(coalesce(trim(p_name), '')) NOT BETWEEN 1 AND 200 THEN RAISE EXCEPTION 'Name is required'; END IF;
  IF char_length(coalesce(trim(p_phone), '')) NOT BETWEEN 5 AND 40 THEN RAISE EXCEPTION 'Phone is required'; END IF;
  INSERT INTO public.enquiries (name, phone, email, product, message, status, source)
  VALUES (trim(p_name), trim(p_phone), left(nullif(trim(p_email), ''), 200),
          left(coalesce(nullif(trim(p_product), ''), 'General Steel Inquiry'), 300),
          left(p_message, 5000), 'pending', left(coalesce(p_source, 'website_rfq_form'), 60))
  RETURNING id INTO new_id;
  RETURN new_id;
END $$;
REVOKE ALL ON FUNCTION public.submit_enquiry(text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_enquiry(text, text, text, text, text, text) TO anon, authenticated;

-- 6. Image bucket: public read; visitors may not overwrite or delete.
--    Direct uploads stay allowed (images only, 5 MB) until the backend has the
--    Supabase secret key (SUPABASE_SERVICE_KEY); then run section 7.
UPDATE storage.buckets
   SET file_size_limit = 5242880,
       allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
 WHERE id = 'product-images';
DROP POLICY IF EXISTS "Public delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Public update product images" ON storage.objects;

-- 7. (Run after SUPABASE_SERVICE_KEY is set on the backend)
-- DROP POLICY IF EXISTS "Public upload product images" ON storage.objects;
