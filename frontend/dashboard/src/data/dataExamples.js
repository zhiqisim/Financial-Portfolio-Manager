// Example of Overall Sentiment Chart
const avgSentiment = 0.35;
const count = 5326; // Total Number of Tweets
const sentimentData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // x values
    series: [
        [1, 2, 2, 3, 3, 4, 3], // y values for positive
        [2, 4, 1, 2, 4, 2, 1], // y values for neutral
        [0, 3, 4, 2, 1, 4, 3], // y values for negative
    ],
};

// Sentiment Breakdown

// Example of Sentiment Summaries
const sentimentSummaries = [
    {
        category: "Positive",
        count: 342,
        avgSentiment: 3.8,
        icon: faSmile,
        color: "tertiary",
    },
    {
        category: "Neutral",
        count: 2512,
        avgSentiment: 0.02,
        icon: faMeh,
        color: "primary",
    },
    {
        category: "Negative",
        count: 115,
        avgSentiment: -2.5,
        icon: faFrown,
        color: "quaternary",
    },
];

// Example of Tweet Data
const tweetData = [
    {
        username: "ArnoldScfhew",
        text: "I love Bitcoin so much yeah",
        sentiment: 4.21,
        retweet_count: 26,
    },
    {
        username: "BobbyBarnes",
        text: "I hate bitcoin",
        sentiment: -3.35,
        retweet_count: 2,
    },
    {
        username: "CaptainCarl",
        text: "Eth is bomb",
        sentiment: 3.64,
        retweet_count: 52,
    },
    {
        username: "Digerydo",
        text: "Buy me some moon shot or whatever",
        sentiment: 0.12,
        retweet_count: 0,
    },
    {
        username: "Earnesta",
        text: "wegrheagesrdrsasfgdxfb crypto",
        sentiment: -0.3,
        retweet_count: 1245,
    },
];

// Example of Sentiment Pie Chart
const sentimentCircleData = [
    {
        id: 1,
        label: "Positive",
        value: 60,
        color: "tertiary",
        icon: faSmile,
    },
    {
        id: 2,
        label: "Neutral",
        value: 30,
        color: "primary",
        icon: faMeh,
    },
    {
        id: 3,
        label: "Negative",
        value: 10,
        color: "quaternary",
        icon: faFrown,
    },
];

// Word Cloud Information Here
const wordCloudData = [
    { value: "JavaScript", count: 38 },
    { value: "React", count: 30 },
    { value: "Nodejs", count: 28 },
    { value: "Express.js", count: 25 },
    { value: "HTML5", count: 33 },
    { value: "MongoDB", count: 18 },
    { value: "CSS3", count: 20 },
];

// Example of Geo Data
const geoData = [
    { ISO3: "AFG", count: 20 },
    { ISO3: "USA", count: 50 },
    { ISO3: "CHE", count: 70 },
    { ISO3: "IND", count: 280 },
    { ISO3: "JPN", count: 80 },
    { ISO3: "SGP", count: 20 },
    { ISO3: "KOR", count: 100 },
];
