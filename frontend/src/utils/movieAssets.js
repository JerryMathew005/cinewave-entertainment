/**
 * CineWave Entertainment - Official Movie Imagery & Promotional Art Registry
 * 
 * Provides authentic, verified high-definition promotional posters and widescreen banners
 * for all catalogue titles. Ensures each title dynamically displays its own distinctive
 * artwork, avoiding improper reuse of fallback or single-title imagery.
 */

export const OFFICIAL_MOVIE_ASSETS = {
  oppenheimer: {
    title: 'Oppenheimer',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg',
    keywords: ['oppenheimer', 'quantum dawn']
  },
  avatar: {
    title: 'Avatar: Fire and Ash',
    posterUrl: 'https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    keywords: ['avatar', 'fire and ash', 'pandora']
  },
  inception: {
    title: 'Inception',
    posterUrl: 'https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    keywords: ['inception', 'lucid horizon']
  },
  interstellar: {
    title: 'Interstellar',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    keywords: ['interstellar', 'beyond time', 'wormhole']
  },
  darkKnight: {
    title: 'The Dark Knight',
    posterUrl: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    keywords: ['dark knight', 'batman', 'legacy']
  },
  dune: {
    title: 'Dune: Prophecy of Arrakis',
    posterUrl: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    keywords: ['dune', 'arrakis', 'prophecy']
  },
  spiderMan: {
    title: 'Spider-Man: Across Realities',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    keywords: ['spider-man', 'spider man', 'across realities', 'spider-verse']
  },
  gladiator: {
    title: 'Gladiator: Eternal Arena',
    posterUrl: 'https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    keywords: ['gladiator', 'eternal arena', 'maximus']
  },
  passionOfTheChrist: {
    title: 'The Passion of the Christ',
    posterUrl: 'https://image.tmdb.org/t/p/w780/4840rkbpsiuow5ew155oVKcqJwj.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/rBM5o2HpmCfDejuIPybI09tkY3V.jpg',
    keywords: ['passion of the christ', 'passion', 'christ', 'mel gibson']
  },
  sonOfGod: {
    title: 'Son of God',
    posterUrl: 'https://image.tmdb.org/t/p/w780/hONTXxtQVSYySKW5f3nRndKUfhc.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/ayqHV0rHuAdMv8PS497W2OByGWk.jpg',
    keywords: ['son of god', 'god']
  },
  princeOfEgypt: {
    title: 'The Prince of Egypt',
    posterUrl: 'https://image.tmdb.org/t/p/w780/565DYYXgdRYMiETLi2EDx4p7s92.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/2xUjYwL6Ol7TLJPPKs7sYW5PWLX.jpg',
    keywords: ['prince of egypt', 'egypt', 'dreamworks']
  },
  theChosen: {
    title: 'The Chosen',
    posterUrl: 'https://image.tmdb.org/t/p/w780/3siv3RaQrdr2tQiv9jHq71sLlzo.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/w1280/dqVUFuNrMFWt7uGNWlpo91VKYOI.jpg',
    keywords: ['the chosen', 'chosen']
  }
};

/**
 * Creates a neutral, high-quality Cinema Blue fallback poster SVG tailored to the title.
 * Used exclusively when a movie's external image fails to load or is missing.
 */
export const getFallbackPoster = (title) => {
  const safeTitle = (title || 'CineWave Movie').substring(0, 30);
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A192F"/>
      <stop offset="50%" stop-color="#0F2744"/>
      <stop offset="100%" stop-color="#061325"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="45%">
      <stop offset="0%" stop-color="rgba(56, 189, 248, 0.28)"/>
      <stop offset="100%" stop-color="rgba(10, 25, 47, 0)"/>
    </radialGradient>
  </defs>
  <rect width="500" height="750" fill="url(#bg)"/>
  <circle cx="250" cy="285" r="160" fill="url(#glow)"/>
  <g transform="translate(195, 220) scale(4.5)" stroke="#38BDF8" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
    <line x1="7" y1="2" x2="7" y2="22"/>
    <line x1="17" y1="2" x2="17" y2="22"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="2" y1="7" x2="7" y2="7"/>
    <line x1="2" y1="17" x2="7" y2="17"/>
    <line x1="17" y1="17" x2="22" y2="17"/>
    <line x1="17" y1="7" x2="22" y2="7"/>
  </g>
  <text x="250" y="440" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" text-anchor="middle">${safeTitle}</text>
  <text x="250" y="475" fill="#38BDF8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="1.5">CINEWAVE PREMIERE</text>
</svg>
`)}`;
};

/** Neutral Cinema Blue Default Poster */
export const DEFAULT_MOVIE_POSTER = getFallbackPoster('CineWave Premiere');

/** Neutral Cinema Blue Default Banner */
export const DEFAULT_MOVIE_BANNER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A192F"/>
      <stop offset="50%" stop-color="#0F2744"/>
      <stop offset="100%" stop-color="#061325"/>
    </linearGradient>
    <radialGradient id="bannerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(56, 189, 248, 0.25)"/>
      <stop offset="100%" stop-color="rgba(10, 25, 47, 0)"/>
    </radialGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <circle cx="640" cy="360" r="320" fill="url(#bannerGlow)"/>
  <g transform="translate(600, 270) scale(3.5)" stroke="#38BDF8" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </g>
  <text x="640" y="420" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="700" text-anchor="middle" letter-spacing="2">CINEWAVE ENTERTAINMENT</text>
</svg>
`)}`;

/**
 * Resolves the authentic, title-specific promotional poster for a movie.
 * Prioritizes verified catalogue artwork by matching movie title.
 */
export const getOfficialPoster = (movie) => {
  if (!movie) return DEFAULT_MOVIE_POSTER;

  const title = (movie.title || '').toLowerCase();
  const currentUrl = movie.posterUrl || '';

  // 1. Match against verified catalogue assets by title keywords
  for (const key of Object.keys(OFFICIAL_MOVIE_ASSETS)) {
    const asset = OFFICIAL_MOVIE_ASSETS[key];
    if (asset.keywords.some((kw) => title.includes(kw))) {
      return asset.posterUrl;
    }
  }

  // 2. If already a custom valid URL (and not generic Unsplash or empty), use it
  if (currentUrl && !currentUrl.includes('unsplash.com')) {
    return currentUrl;
  }

  // 3. Fallback to title-tailored Cinema Blue graphic (never generic Interstellar)
  return getFallbackPoster(movie.title);
};

/**
 * Resolves the authentic, title-specific widescreen banner for a movie.
 */
export const getOfficialBanner = (movie) => {
  if (!movie) return DEFAULT_MOVIE_BANNER;

  const title = (movie.title || '').toLowerCase();
  const currentUrl = movie.bannerUrl || movie.posterUrl || '';

  // 1. Match against verified catalogue assets by title keywords
  for (const key of Object.keys(OFFICIAL_MOVIE_ASSETS)) {
    const asset = OFFICIAL_MOVIE_ASSETS[key];
    if (asset.keywords.some((kw) => title.includes(kw))) {
      return asset.bannerUrl;
    }
  }

  // 2. If already a valid widescreen banner URL, use it
  if (currentUrl && !currentUrl.includes('unsplash.com')) {
    return currentUrl;
  }

  return DEFAULT_MOVIE_BANNER;
};
