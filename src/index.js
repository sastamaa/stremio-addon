const express = require("express");
const cors = require("cors");
const { serveStatic } = require("vercel-static-middleware");
const app = express();

const data = require("./data.json");

// Middleware
app.use(cors());

// Manifest
const manifest = {
  id: "org.verceladdon",
  version: "1.0.0",
  name: "Vercel Addon",
  description: "A simple Stremio addon hosted on Vercel.",
  resources: ["catalog", "meta", "stream"],
  types: ["movie", "series"],
  idPrefixes: ["vercel_"],
  catalogs: [
    { type: "movie", id: "movies", name: "Vercel Movies Catalog" },
    { type: "series", id: "series", name: "Vercel Series Catalog" }
  ]
};

// Serve Manifest
app.get("/manifest.json", (req, res) => res.json(manifest));

// Catalog Handler
app.get("/catalog/:type/:id.json", (req, res) => {
  const { type, id } = req.params;
  const catalog = data[type]?.map((item) => ({
    id: item.id,
    type: item.type,
    name: item.name,
    poster: item.poster
  }));

  if (!catalog) {
    return res.status(404).send("Catalog not found");
  }

  res.json({ metas: catalog });
});

// Meta Handler
app.get("/meta/:type/:id.json", (req, res) => {
  const { type, id } = req.params;
  const item = data.all.find((item) => item.id === id);

  if (!item) {
    return res.status(404).send("Meta not found");
  }

  res.json({ meta: item });
});

// Stream Handler
app.get("/stream/:type/:id.json", (req, res) => {
  const { type, id } = req.params;
  const streams = data.streams[id];

  if (!streams) {
    return res.status(404).send("Streams not found");
  }

  res.json({ streams });
});

// Start Express
module.exports = app;
