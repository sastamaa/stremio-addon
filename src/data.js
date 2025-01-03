data.movies = [
    {
        id: 'tt13186482',
        type: 'movie',
        name: 'Mufasa: The Lion King',
        poster: 'https://www.themoviedb.org/t/p/w1280/1GcGsgqTyRJ4AmFQrrOKRkCuP6o.jpg',
        description: 'The story of an orphan who would be king.'
    },
    {
        id: 'vercel_movie_2',
        type: 'movie',
        name: 'Example Movie 2',
        poster: 'https://example.com/poster2.jpg',
        description: 'Another example movie.'
    }
];

data.series = [
    {
        id: 'vercel_series_1',
        type: 'series',
        name: 'Example Series 1',
        poster: 'https://example.com/poster3.jpg',
        description: 'An example series for testing.'
    }
];

data.streams = {
    tt13186482: [
        {
            title: 'Stream 1 for Movie 1',
            url: 'https://www.sw.vidce.net/d/6iktqeFGzPi_YWHrOMtF-g/1736550313/video/2015/tt13186482.mp4',
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

data.all = [
    ...data.movies,
    ...data.series
];
