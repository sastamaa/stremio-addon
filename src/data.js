module.exports = {
    movies: [
        { id: 'vercel_movie_1', name: 'Vercel Movie 1', poster: 'https://example.com/movie1.jpg' },
        { id: 'vercel_movie_2', name: 'Vercel Movie 2', poster: 'https://example.com/movie2.jpg' }
    ],
    series: [
        { id: 'vercel_series_1', name: 'Vercel Series 1', poster: 'https://example.com/series1.jpg' },
        { id: 'vercel_series_2', name: 'Vercel Series 2', poster: 'https://example.com/series2.jpg' }
    ],
    all: [
        { id: 'vercel_movie_1', name: 'Vercel Movie 1', description: 'Description of Movie 1' },
        { id: 'vercel_movie_2', name: 'Vercel Movie 2', description: 'Description of Movie 2' },
        { id: 'vercel_series_1', name: 'Vercel Series 1', description: 'Description of Series 1' },
        { id: 'vercel_series_2', name: 'Vercel Series 2', description: 'Description of Series 2' }
    ],
    streams: {
        'vercel_movie_1': [{ url: 'https://example.com/movie1.mp4' }],
        'vercel_movie_2': [{ url: 'https://example.com/movie2.mp4' }]
    }
};
