# Lux Auto

Next.js 15 + Supabase + Vercel rewrite of the legacy static site.

## Supabase setup

1. Create a Supabase project and run `supabase/schema.sql`, then `supabase/seed.sql` in the SQL Editor.
2. Create the administrator in **Authentication → Users** and run:
   `update public.profiles set is_admin = true where id = 'USER_UUID';`
3. Copy `.env.example` to `.env.local` and fill in the Project URL and anon key.

## Local and Vercel

Requires Node.js 20.9 or newer. Run `npm install` and `npm run dev`. On Vercel add the same environment variables (plus a random `REVALIDATE_SECRET` when cache invalidation is needed) and deploy.

The initial 9 records and their cover images are included in `supabase/seed.sql`. Legacy image files are preserved in `public/cars`; all new photos use Supabase Storage automatically, are browser-compressed and converted to WebP.
