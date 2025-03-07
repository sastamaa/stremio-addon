const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_API_KEY = '28797e7035babad606ddbc1642d2ec8b'; // Replace with your TMDB API key

app.use(cors());

// Manifest endpoint
app.get('/manifest.json', (req, res) => {
    res.json({
        id: 'com.example.stremio.tmdb',
        version: '1.0.0',
        name: 'DeepSeek Stremio Addon',
        description: 'Stremio addon for movies and series from TMDB',
        resources: ['catalog', 'meta', 'stream'],
        types: ['movie', 'series'],
        catalogs: [
            {
                type: 'movie',
                id: 'tmdb-movies',
                name: 'TMDB Movies',
                extra: [{ name: 'search', isRequired: false }]
            },
            {
                type: 'series',
                id: 'tmdb-series',
                name: 'TMDB Series',
                extra: [{ name: 'search', isRequired: false }]
            }
        ]
    });
});

// Catalog endpoint for movies
app.get('/catalog/movie/tmdb-movies.json', async (req, res) => {
    try {
        console.log('Fetching catalog for movies...'); // Debugging log

        // Fetch details for specific movies (e.g., "Venom" and "Wicked")
        const movieIds = ['335983', '402431']; // TMDB IDs for "Venom" and "Wicked"
        const movies = await Promise.all(
            movieIds.map(async (id) => {
                console.log(`Fetching movie details for TMDB ID: ${id}`); // Debugging log
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`);
                const movieData = response.data;
                return {
                    id: `tmdb-movie-${movieData.id}`,
                    type: 'movie',
                    name: movieData.title,
                    poster: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
                    description: movieData.overview,
                    releaseInfo: movieData.release_date,
                    genres: movieData.genres.map(genre => genre.name)
                };
            })
        );

        console.log('Returning catalog for movies:', movies); // Debugging log
        res.json({ metas: movies });
    } catch (error) {
        console.error('Error fetching catalog for movies:', error); // Debugging log
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// Meta endpoint for movies
app.get('/meta/movie/tmdb-movie-:id.json', async (req, res) => {
    const { id } = req.params;
    console.log('Fetching meta data for movie with ID:', id); // Debugging log

    try {
        const movieId = id.split('-')[2]; // Extract TMDB ID from the Stremio ID
        console.log('Extracted TMDB ID:', movieId); // Debugging log

        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
        console.log('TMDB API response:', response.data); // Debugging log

        const movieData = response.data;
        const meta = {
            id: `tmdb-movie-${movieData.id}`,
            type: 'movie',
            name: movieData.title,
            poster: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
            description: movieData.overview,
            releaseInfo: movieData.release_date,
            genres: movieData.genres.map(genre => genre.name)
        };

        console.log('Returning meta data:', meta); // Debugging log
        res.json({ meta: meta });
    } catch (error) {
        console.error('Error fetching meta data:', error); // Debugging log
        res.status(500).json({ error: 'Failed to fetch meta data' });
    }
});

// Stream endpoint for movies
app.get('/stream/movie/tmdb-movie-:id.json', (req, res) => {
    const { id } = req.params;
    console.log('Fetching stream for movie with ID:', id); // Debugging log

    const streams = [];
    if (id === 'tmdb-movie-335983') {
        // Streaming link for "Venom"
        streams.push({
            title: 'Venom',
            url: 'https://www.sw.vidce.net/d/UZyt7ohW8G4SH9rAT36QXg/1737113698/video/2015/tt1262426.mp4', // Replace with actual streaming link for Venom
            behaviorHints: {
                notWebReady: false,
            }
        });
    } else if (id === 'tmdb-movie-402431') {
        // Streaming link for "Wicked"
        streams.push({
            title: 'Wicked',
            url: 'https://ashdi.vip/video17/2/new/killer.heat.2024.1080p.amzn.webdl.aac2.0.h.264utopia_145019/hls/480/DaqXjXWRkeBYhA37BA==/index.m3u8', // Replace with actual streaming link for Wicked
            behaviorHints: {
                notWebReady: false,
            }
        });
    }

    console.log('Returning streams:', streams); // Debugging log
    res.json({ streams: streams });
});

// Catalog endpoint for series
app.get('/catalog/series/tmdb-series.json', async (req, res) => {
    try {
        console.log('Fetching catalog for series...'); // Debugging log

        // Fetch details for specific series (e.g., "The Day of the Jackal" and "Rick and Morty")
        const seriesIds = ['966', '60625']; // TMDB IDs for "The Day of the Jackal" and "Rick and Morty"
        const series = await Promise.all(
            seriesIds.map(async (id) => {
                console.log(`Fetching series details for TMDB ID: ${id}`); // Debugging log
                const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`);
                const seriesData = response.data;
                return {
                    id: `tmdb-series-${seriesData.id}`,
                    type: 'series',
                    name: seriesData.name,
                    poster: `https://image.tmdb.org/t/p/w500${seriesData.poster_path}`,
                    description: seriesData.overview,
                    releaseInfo: seriesData.first_air_date,
                    genres: seriesData.genres.map(genre => genre.name)
                };
            })
        );

        console.log('Returning catalog for series:', series); // Debugging log
        res.json({ metas: series });
    } catch (error) {
        console.error('Error fetching catalog for series:', error); // Debugging log
        res.status(500).json({ error: 'Failed to fetch series' });
    }
});

// Meta endpoint for series
app.get('/meta/series/tmdb-series-:id.json', async (req, res) => {
    const { id } = req.params;
    console.log('Fetching meta data for series with ID:', id); // Debugging log

    try {
        // Extract TMDB ID from the Stremio ID
        const seriesId = id.split('-')[2];
        console.log('Extracted TMDB ID:', seriesId); // Debugging log

        // Fetch series details from TMDB
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${TMDB_API_KEY}`);
        console.log('TMDB API response:', response.data); // Debugging log

        const seriesData = response.data;

        // Fetch season details
        const seasons = await Promise.all(
            seriesData.seasons.map(async (season) => {
                console.log(`Fetching season ${season.season_number} for series ID: ${seriesId}`); // Debugging log
                const seasonResponse = await axios.get(
                    `https://api.themoviedb.org/3/tv/${seriesId}/season/${season.season_number}?api_key=${TMDB_API_KEY}`
                );
                const seasonData = seasonResponse.data;

                return {
                    season: season.season_number,
                    title: season.name,
                    overview: season.overview,
                    poster: `https://image.tmdb.org/t/p/w500${season.poster_path}`,
                    episodes: seasonData.episodes.map(episode => ({
                        id: `tmdb-series-${seriesId}-s${season.season_number}e${episode.episode_number}`,
                        title: episode.name,
                        overview: episode.overview,
                        released: episode.air_date,
                        episode: episode.episode_number
                    }))
                };
            })
        );

        // Construct the meta object for Stremio
        const meta = {
            id: `tmdb-series-${seriesData.id}`,
            type: 'series',
            name: seriesData.name,
            poster: `https://image.tmdb.org/t/p/w500${seriesData.poster_path}`,
            description: seriesData.overview,
            releaseInfo: seriesData.first_air_date,
            genres: seriesData.genres.map(genre => genre.name),
            seasons: seasons
        };

        console.log('Returning meta data:', meta); // Debugging log
        res.json({ meta: meta });
    } catch (error) {
        console.error('Error fetching meta data:', error); // Debugging log
        res.status(500).json({ error: 'Failed to fetch meta data' });
    }
});

// Stream endpoint for series
app.get('/stream/series/tmdb-series-:id.json', (req, res) => {
    const { id } = req.params;
    console.log('Fetching stream for series with ID:', id); // Debugging log

    // Extract series ID, season, and episode number from the ID
    const [seriesId, seasonEpisode] = id.split('-s');
    const [season, episode] = seasonEpisode.split('e');

    const streams = [];
    if (seriesId === 'tmdb-series-966') {
        // Streaming link for "The Day of the Jackal"
        streams.push({
            title: `The Day of the Jackal - S1E1`,
            url: 'https://ashdi.vip/video11/2/new/blink.twice.2024.ua_142368/hls/1080/AqaXi3WGjuRekxH2AQ==/index.m3u8', // Replace with actual streaming link for "The Day of the Jackal"
            behaviorHints: {
                notWebReady: false,
            }
        });
    } else if (seriesId === 'tmdb-series-60625') {
        // Streaming link for "Rick and Morty"
        streams.push({
            title: `Rick and Morty - S1E1`,
            url: 'https://ashdi.vip/video11/2/new/blink.twice.2024.ua_142368/hls/1080/AqaXi3WGjuRekxH2AQ==/index.m3u8', // Replace with actual streaming link for "Rick and Morty"
            behaviorHints: {
                notWebReady: false,
            }
        });
    }

    console.log('Returning streams:', streams); // Debugging log
    res.json({ streams: streams });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
