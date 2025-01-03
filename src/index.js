const { addonBuilder } = require('stremio-addon-sdk');
const data = require('./data');

const manifest = {
    id: 'org.verceladdon',
    version: '1.0.0',
    name: 'Online Stremio Addon',
    description: 'A Stremio addon hosted online using Vercel.',
    resources: ['catalog', 'meta', 'stream'],
    types: ['movie', 'series'],
    idPrefixes: ['vercel_']
};

const builder = new addonBuilder(manifest);

// Catalog handler
builder.defineCatalogHandler(({ type, id }) => {
    const items = id === 'movies' ? data.movies : id === 'series' ? data.series : [];
    return Promise.resolve({ metas: items });
});

// Metadata handler
builder.defineMetaHandler(({ type, id }) => {
    const meta = data.all.find(item => item.id === id);
    return meta ? Promise.resolve({ meta }) : Promise.reject('Meta not found');
});

// Stream handler
builder.defineStreamHandler(({ type, id }) => {
    const streams = data.streams[id];
    return streams ? Promise.resolve({ streams }) : Promise.reject('Streams not found');
});

module.exports = builder.getInterface();
