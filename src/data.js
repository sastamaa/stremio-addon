const movies = [
    {
        id: 'vercel_movie_1',
        type: 'movie',
        name: 'Example Movie 1',
        poster: 'https://example.com/poster1.jpg',
        description: 'An example movie for testing.'
    },
    {
        id: 'vercel_movie_2',
        type: 'movie',
        name: 'Example Movie 2',
        poster: 'https://example.com/poster2.jpg',
        description: 'Another example movie.'
    }
];

const series = [
    {
        id: 'vercel_series_1',
        type: 'series',
        name: 'Example Series 1',
        poster: 'https://example.com/poster3.jpg',
        description: 'An example series for testing.'
    }
];

module.exports = {
    movies,
    series,
    all: [...movies, ...series]
};
