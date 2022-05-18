const withPWA = require('next-pwa');

module.exports = withPWA({
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SERVICE_ROLE: process.env.SERVICE_ROLE,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
  },
  images: {
    domains: [
      'tailwindui.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com',
    ],
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
});
