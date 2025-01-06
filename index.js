const { addonBuilder, getRouter } = require("stremio-addon-sdk");
const fetch = require("node-fetch");
const express = require('express');
const cors = require('cors');
const axios = require('axios');

app.use(cors());

// TMDB API credentials
const TMDB_API_KEY = "28797e7035babad606ddbc1642d2ec8b"; // Replace with your API key
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

// Example data: Only TMDB IDs and associated streaming links
const exampleContent = {
  movie: [
    { tmdbId: "603692", streamLinks: ["https://example-stream.com/603692"] }, // John Wick: Chapter 4
    { tmdbId: "871693", streamLinks: ["https://example-stream.com/871693"] }, // Everything Everywhere All at Once
  ],
  series: [
    { tmdbId: "1399", streamLinks: ["https://example-stream.com/1399/ep1"] }, // Game of Thrones
    { tmdbId: "66732", streamLinks: ["https://example-stream.com/66732/ep1"] }, // Stranger Things
  ],
  cartoon: [
    { tmdbId: "166428", streamLinks: ["https://example-stream.com/166428/ep1"] }, // BoJack Horseman
    { tmdbId: "121280", streamLinks: ["https://example-stream.com/121280/ep1"] }, // Adventure Time
  ],
};

// Fetch metadata from TMDB for the catalog
builder.defineCatalogHandler(async ({ type, id }) => {
  const items = exampleContent[type];
  if (!items) return Promise.resolve({ metas: [] });

  const metas = await Promise.all(
    items.map(async ({ tmdbId }) => {
      const tmdbMeta = await fetchTmdbMeta(type, tmdbId);
      return formatMeta(tmdbMeta, type);
    })
  );

  return Promise.resolve({ metas });
});

// Fetch detailed metadata for a specific item
builder.defineMetaHandler(async ({ type, id }) => {
  const item = findItemById(type, id);
  if (!item) return Promise.reject("Meta not found");

  const tmdbMeta = await fetchTmdbMeta(type, item.tmdbId);
  return { meta: formatMeta(tmdbMeta, type, true) };
});

// Provide streams for the specific item
builder.defineStreamHandler(({ type, id }) => {
  const item = findItemById(type, id);
  if (!item) return Promise.resolve({ streams: [] });

  const streams = item.streamLinks.map((url) => ({
    title: "Stream",
    url,
  }));

  return Promise.resolve({ streams });
});

// Helper Functions

// Fetch metadata from TMDB API
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

// Find content item by ID
function findItemById(type, id) {
  return exampleContent[type]?.find((item) => item.tmdbId.toString() === id);
}

// Export the addon
const addonInterface = builder.getInterface();
const router = getRouter(addonInterface);
module.exports = router;
