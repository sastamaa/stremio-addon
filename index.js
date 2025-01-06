const { addonBuilder, getRouter } = require("stremio-addon-sdk");
const fetch = require("node-fetch");

// TMDB API credentials
const TMDB_API_KEY = "28797e7035babad606ddbc1642d2ec8b"; // Replace with your TMDB API key
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const builder = new addonBuilder({
  id: "org.stremio.tmdbaddon",
  version: "1.0.0",
  name: "TMDB Auto Addon",
  description: "Dynamically fetches metadata from TMDB with streaming links.",
  resources: ["catalog", "meta", "stream"],
  types: ["movie", "series", "cartoon"],
  catalogs: [
    { name: "Movies", type: "movie", id: "movies_catalog" },
    { name: "Series", type: "series", id: "series_catalog" },
    { name: "Cartoons", type: "cartoon", id: "cartoons_catalog" },
  ],
});

// Example content with TMDB IDs and streaming links
const exampleContent = {
  movie: [
    { tmdbId: "603692", streamLinks: ["https://example-stream.com/603692"] },
    { tmdbId: "871693", streamLinks: ["https://example-stream.com/871693"] },
  ],
  series: [
    { tmdbId: "1399", streamLinks: ["https://example-stream.com/1399/ep1"] },
    { tmdbId: "66732", streamLinks: ["https://example-stream.com/66732/ep1"] },
  ],
  cartoon: [
    { tmdbId: "166428", streamLinks: ["https://example-stream.com/166428/ep1"] },
    { tmdbId: "121280", streamLinks: ["https://example-stream.com/121280/ep1"] },
  ],
};

// Catalog handler
builder.defineCatalogHandler(async ({ type, id }) => {
  const items = exampleContent[type] || [];
  const metas = await Promise.all(
    items.map(async ({ tmdbId }) => {
      const tmdbMeta = await fetchTmdbMeta(type, tmdbId);
      return formatMeta(tmdbMeta, type);
    })
  );

  return Promise.resolve({ metas });
});

// Meta handler
builder.defineMetaHandler(async ({ type, id }) => {
  const item = findItemById(type, id);
  if (!item) return Promise.reject("Meta not found");

  const tmdbMeta = await fetchTmdbMeta(type, item.tmdbId);
  return { meta: formatMeta(tmdbMeta, type, true) };
});

// Stream handler
builder.defineStreamHandler(({ type, id }) => {
  const item = findItemById(type, id);
  if (!item) return Promise.resolve({ streams: [] });

  const streams = item.streamLinks.map((url) => ({
    title: "Stream",
    url,
  }));

  return Promise.resolve({ streams });
});

// Fetch metadata from TMDB
async function fetchTmdbMeta(type, tmdbId) {
  const endpoint = `${TMDB_BASE_URL}/${type === "movie" ? "movie" : "tv"}/${tmdbId}?api_key=${TMDB_API_KEY}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}

// Format metadata into Stremio's format
function formatMeta(data, type, isDetailed = false) {
  return {
    id: data.id.toString(),
    name: data.title || data.name,
    poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    background: data.backdrop_path ? `https://image.tmdb.org/t/p/w780${data.backdrop_path}` : null,
    type,
    year: new Date(data.release_date || data.first_air_date).getFullYear(),
    description: isDetailed ? data.overview : undefined,
  };
}

// Find content by ID
function findItemById(type, id) {
  return exampleContent[type]?.find((item) => item.tmdbId.toString() === id);
}

// Export router for Vercel
const addonInterface = builder.getInterface();
const router = getRouter(addonInterface);

module.exports = router;
