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

const streams = {
    vercel_movie_1: [
        {
            title: 'Stream 1 for Movie 1',
            url: 'https://example.com/streams/movie1_stream1.mp4',
            mime: 'video/mp4'
        }
    ],
    vercel_movie_2: [
        {
            title: 'Stream 1 for Movie 2',
            url: 'https://example.com/streams/movie2_stream1.mp4',
            mime: 'video/mp4'
        }
    ],
    vercel_series_1: [
        {
            title: 'Stream 1 for Series 1',
            url: 'https://example.com/streams/series1_stream1.mp4',
            mime: 'video/mp4'
        }
    ]
};

module.exports = {
    movies,
    series,
    streams,
    all: [...movies, ...series]
};
