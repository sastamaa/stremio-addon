const express = require('express');
const { addonBuilder } = require('stremio-addon-sdk');
const axios = require('axios');

const TMDB_API_KEY = '28797e7035babad606ddbc1642d2ec8b'; // Replace with your TMDb API key
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const app = express();

// Manifest setup
const manifest = {
    id: 'org.verceladdon',
    version: '1.0.0',
    name: 'TMDb Stremio Addon',
    description: 'A dynamic addon that fetches movies and series data from TMDb.',
    resources: ['catalog', 'meta', 'stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tmdb_'],
    catalogs: [
        { type: 'movie', id: 'movies', name: 'Movies Catalog' },
        { type: 'series', id: 'series', name: 'Series Catalog' },
    ],
};

// Addon builder
const builder = new addonBuilder(manifest);

// Fetch popular movies or series dynamically from TMDb
builder.defineCatalogHandler(async ({ type, id }) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/${type === 'movie' ? 'movie/popular' : 'tv/popular'}`,
            { params: { api_key: TMDB_API_KEY, language: 'en-US' } }
        );

        const metas = response.data.results.map(item => ({
            id: `tmdb_${item.id}`,
            type,
            name: item.title || item.name,
            poster: `${TMDB_IMAGE_URL}${item.poster_path}`,
            description: item.overview,
            releaseInfo: item.release_date || item.first_air_date,
        }));

        return { metas };
    } catch (error) {
        console.error('Error fetching catalog:', error);
        return { metas: [] };
    }
});

// Fetch metadata for movies or series (includes seasons for series)
builder.defineMetaHandler(async ({ type, id }) => {
    const tmdbId = id.split('_')[1];

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/${type === 'movie' ? 'movie' : 'tv'}/${tmdbId}`,
            { params: { api_key: TMDB_API_KEY, language: 'en-US' } }
        );

        const item = response.data;

        const meta = {
            id: `tmdb_${item.id}`,
            type,
            name: item.title || item.name,
            poster: `${TMDB_IMAGE_URL}${item.poster_path}`,
            description: item.overview,
            releaseInfo: item.release_date || item.first_air_date,
            genres: item.genres.map(g => g.name),
        };

        // Add seasons for series
        if (type === 'series') {
            meta.seasons = item.seasons.map(season => ({
                id: `tmdb_${item.id}_season_${season.season_number}`,
                name: season.name,
                poster: `${TMDB_IMAGE_URL}${season.poster_path}`,
                description: season.overview,
                releaseInfo: season.air_date,
            }));
        }

        return { meta };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return { meta: null };
    }
});

// Provide static streams for demonstration purposes
builder.defineStreamHandler(({ id }) => {
    const streams = {
        tmdb_1: [{ title: "Example Stream", url: "https://example.com/stream.mp4", quality: "1080p" }],
    };

    const tmdbId = id.split('_')[1];
    const stream = streams[`tmdb_${tmdbId}`];

    return { streams: stream || [] };
});

// Export the interface for Stremio to use
const addonInterface = builder.getInterface();

// Use Express to handle the requests
app.get('/manifest.json', (req, res) => res.json(manifest));

app.use('/addon', addonInterface);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Addon is running at http://localhost:${PORT}`));
