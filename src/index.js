const { addonBuilder } = require('stremio-addon-sdk'); // Import Stremio Addon SDK
const express = require('express'); // Import Express framework
const data = require('./data'); // Custom data for catalog, meta, and streams

// Define the manifest inline within the code
const manifest = {
    id: 'org.verceladdon',
    version: '1.0.0',
    name: 'Online Stremio Addon',
    description: 'A Stremio addon hosted online using Vercel.',
    resources: ['catalog', 'meta', 'stream'],
    types: ['movie', 'series'],
    idPrefixes: ['vercel_'],
};

const builder = new addonBuilder(manifest); // Create addon builder with manifest
const app = express(); // Initialize Express app

// Add CORS headers (important for Stremio to access the server)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    next();
});

// Define catalog handler (responds with metadata for movies and series)
builder.defineCatalogHandler(({ type, id }) => {
    const items = id === 'movies' ? data.movies : id === 'series' ? data.series : [];
    return Promise.resolve({ metas: items });
});

// Define meta handler (responds with detailed metadata for a single item)
builder.defineMetaHandler(({ type, id }) => {
    const meta = data.all.find(item => item.id === id);
    return meta ? Promise.resolve({ meta }) : Promise.reject('Meta not found');
});

// Define stream handler (responds with stream information for a specific item)
builder.defineStreamHandler(({ type, id }) => {
    const streams = data.streams[id];
    return streams ? Promise.resolve({ streams }) : Promise.reject('Streams not found');
});

// Serve the manifest at /manifest.json (needed by Stremio)
app.get('/manifest.json', (req, res) => {
    res.json(manifest); // Send the inline manifest as a response
});

// Mount the Stremio Addon SDK interface
app.use('/', builder.getInterface());

// Start the server (used by Vercel)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Addon running at http://localhost:${port}`));
