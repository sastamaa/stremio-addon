const { addonBuilder } = require('stremio-addon-sdk');
const express = require('express');
const data = require('./data');

const manifest = {
    id: 'org.verceladdon',
    version: '1.0.0',
    name: 'Online Stremio Addon',
    description: 'A Stremio addon hosted online using Vercel.',
    resources: ['catalog', 'meta', 'stream'],
    types: ['movie', 'series'],
    idPrefixes: ['vercel_'],
    catalogs: [
        { type: 'movie', id: 'movies', name: 'Vercel Movies Catalog' },
        { type: 'series', id: 'series', name: 'Vercel Series Catalog' }
    ]
};

const builder = new addonBuilder(manifest);
const app = express();

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Catalog handler
builder.defineCatalogHandler(({ type, id }) => {
    console.log(`Catalog request for type: ${type}, id: ${id}`);
    if (type === 'movie' && id === 'movies') {
        return Promise.resolve({ metas: data.movies });
    }
    if (type === 'series' && id === 'series') {
        return Promise.resolve({ metas: data.series });
    }
    return Promise.resolve({ metas: [] });
});

// Metadata handler
builder.defineMetaHandler(({ type, id }) => {
    console.log(`Meta request for type: ${type}, id: ${id}`);
    const meta = data.all.find(item => item.id === id);
    if (meta) {
        return Promise.resolve({ meta });
    } else {
        return Promise.resolve({ meta: null });
    }
});

// Stream handler
builder.defineStreamHandler(({ type, id }) => {
    console.log(`Stream request for type: ${type}, id: ${id}`);
    const streamData = data.streams[id];
    if (streamData) {
        return Promise.resolve({ streams: streamData });
    } else {
        return Promise.resolve({ streams: [] });
    }
});

// Serve the manifest
app.get('/manifest.json', (req, res) => {
    res.json(manifest);
});

// Mount the addon interface
const addonInterface = builder.getInterface();
Object.entries(addonInterface).forEach(([path, handler]) => {
    if (typeof handler === 'function') {
        app.use(path, handler);
    } else {
        console.error(`Handler for path "${path}" is not a function.`);
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Addon running at http://localhost:${port}`);
});
