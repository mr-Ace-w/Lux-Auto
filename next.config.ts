import type { NextConfig } from 'next';
import fs from 'fs';
import path from 'path';

try {
  const src = path.join(process.cwd(), 'images', 'logo', 'LuxAutoImg4.png');
  const dest = path.join(process.cwd(), 'public', 'images', 'logo', 'LuxAutoImg4.png');
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
} catch (err) {
  console.error('Error copying logo:', err);
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.r2.dev' },
    ],
  },
};
export default nextConfig;
