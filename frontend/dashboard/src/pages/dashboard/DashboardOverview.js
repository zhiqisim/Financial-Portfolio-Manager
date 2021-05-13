import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { faSmile, faFrown, faMeh } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Button, ButtonGroup } from "@themesberg/react-bootstrap";

import {
    SentimentWidget,
    SentimentCircleWidget,
    WordCloudWidget,
    SummaryWidget,
} from "../../components/Widgets";
import { TweetsTable, AllTweetsTable } from "../../components/Tables";
import { MapChart } from "../../components/MapChart";
import { SearchHeading } from "../../components/SearchHeading";
import { normalisationMapping } from "../../data/normalisationMapping";

export default () => {
    let history = useHistory(); // needed to perform routing
    let { id } = useParams(); // query is passed through id. spaces are converted to %20

    // TODO: Do Data Pre-Processing Here
    let search = normaliseQuery(id);
    let pos_sentiment_score = 0;
    let neg_sentiment_score = 0;
    let neu_sentiment_score = 0;
    let pos_count = 0;
    let neg_count = 0;
    let neu_count = 0;
    let tweet_list = [];
    let word_cloud_list = [];
    let total_count = 0;
    let country_dict = {};
    // dates hold a dictionary of dates which stores an array as value
    // index 0 == pos_score, 1 == neg_score, 2 == pos_count, 3 == neg_count
    let dates = {};

    // state for average sentiment
    const [avgSentiment, setAvgSentiment] = useState(0);
    // state for total_count
    const [count, setCount] = useState(0);
    // state for sentiment chart
    const [sentimentData, setSentimentData] = useState({});
    // state for sentiment summaries
    const [sentimentSummaries, setSentimentSummaries] = useState([]);
    // state for tweets
    const [tweetData, setTweetData] = useState([]);
    // state for sentiment circle
    const [sentimentCircleData, setSentimentCircleData] = useState([]);
    // state for wordcloud
    const [wordCloudData, setWordCloudData] = useState([]);
    // state for heat map
    const [geoData, setGeoData] = useState([
        { ISO3: "AFG", count: 20 },
        { ISO3: "USA", count: 50 },
        { ISO3: "CHE", count: 70 },
        { ISO3: "IND", count: 280 },
        { ISO3: "JPN", count: 80 },
    ]);
    const [overview, setOverview] = useState(true);

    // data format examples at src/data/dataExamples

    // callback function to fetch and process corpus to data formats
    const fetch_and_process_corpus = useCallback(async () => {
        let response = await fetch(
            "http://ec2-52-221-200-220.ap-southeast-1.compute.amazonaws.com:8983/solr/info-retrieval/select?df=indexer_text&q=" +
                search +
                "&rows=100000"
        );
        let clusterResponse = await fetch(
            "http://ec2-52-221-200-220.ap-southeast-1.compute.amazonaws.com:8983/solr/info-retrieval/clustering?q=" +
                search +
                "&df=sentiment_text"
        );
        response = await response.json();
        console.log(response);
        total_count = response.response.docs.length;
        setCount(total_count);
        response.response.docs.map((p, index) => parse_api_data(p, index));
        processSentimentChart();
        processSentimentSummary();
        processAvgSentiment();
        processTweetData();
        processSentimentCircle();
        processHeatMap();

        // cluster results should take longer to process,

        clusterResponse = await clusterResponse.json();
        clusterResponse.clusters.map((p, index) =>
            parseCloudWordData(p, index)
        );
        processWordCloudData();
    }, [search]);

    useEffect(() => {
        fetch_and_process_corpus();
    }, [fetch_and_process_corpus]);

    function normaliseQuery(q) {
        if (q == null) {
            return "crypto";
        }
        const spaceToken = "%20";
        const queryTokens = q.split(spaceToken);
        const normalisedQueryTokens = queryTokens.map((token) => {
            if (normalisationMapping[token] != null) {
                return normalisationMapping[token];
            }
            return token;
        });
        return normalisedQueryTokens.join(spaceToken);
    }

    // process data for average sentiment
    function processAvgSentiment() {
        let avg_score =
            parseFloat(neg_sentiment_score) + parseFloat(pos_sentiment_score);
        setAvgSentiment(parseFloat(avg_score).toFixed(1));
    }

    // process data for sentiment chart
    function processSentimentChart() {
        console.log(dates);
        let labels = [];
        let series = [[], [], []];
        for (let key in dates) {
            let value = dates[key];
            // let pos_score = value[0]
            // let neg_score = value[1]
            let pos_count = value[2];
            let neg_count = value[3];
            let neu_count = value[4];
            // pos_score =  parseFloat((pos_score / (pos_count + neg_count)) * 10).toFixed(1)
            // neg_score = parseFloat((neg_score / (pos_count + neg_count)) * 10).toFixed(1)
            let pos_score = parseFloat(pos_count);
            let neg_score = parseFloat(neg_count);
            let neu_score = parseFloat(neu_count);
            labels.push(key);
            series[0].push(pos_score);
            series[1].push(neg_score);
            series[2].push(neu_score);
        }
        // sort labels
        for (let i = 0; i < labels.length; i++) {
            for (let j = i; j < labels.length; j++) {
                if (labels[i] > labels[j]) {
                    let temp_label = labels[i];
                    let temp_pos_series = series[0][i];
                    let temp_neg_series = series[1][i];
                    let temp_neu_series = series[2][i];
                    labels[i] = labels[j];
                    series[0][i] = series[0][j];
                    series[1][i] = series[1][j];
                    series[2][i] = series[2][j];
                    labels[j] = temp_label;
                    series[0][j] = temp_pos_series;
                    series[1][j] = temp_neg_series;
                    series[2][j] = temp_neu_series;
                }
            }
        }
        console.log(labels);
        console.log(series);
        const sentimentData = {
            labels: labels, // x values
            series: series,
        };
        setSentimentData(sentimentData);
    }

    // process data for sentiment summary
    function processSentimentSummary() {
        pos_sentiment_score = parseFloat(
            (pos_sentiment_score / (pos_count + neg_count)) * 10
        ).toFixed(1);
        neg_sentiment_score = parseFloat(
            (neg_sentiment_score / (pos_count + neg_count)) * 10
        ).toFixed(1);
        neu_sentiment_score = 0;
        let pos = {
            category: "Positive",
            count: pos_count,
            avgSentiment: pos_sentiment_score,
            icon: faSmile,
            color: "tertiary",
        };
        let neg = {
            category: "Negative",
            count: neg_count,
            avgSentiment: neg_sentiment_score,
            icon: faFrown,
            color: "quaternary",
        };
        let neu = {
            category: "Neutral",
            count: neu_count,
            avgSentiment: neu_sentiment_score,
            icon: faMeh,
            color: "primary",
        };
        const sentimentSummary = [pos, neu, neg];
        setSentimentSummaries(sentimentSummary);
    }

    // process data for tweets list
    function processTweetData() {
        setTweetData(tweet_list);
    }

    // process data for sentiment circle data
    function processSentimentCircle() {
        const pos_share = parseFloat((pos_count / total_count) * 100).toFixed(
            1
        );
        const neg_share = parseFloat((neg_count / total_count) * 100).toFixed(
            1
        );
        const neu_share = parseFloat((neu_count / total_count) * 100).toFixed(
            1
        );
        const sentimentCircleData = [
            {
                id: 1,
                label: "Positive",
                value: pos_share,
                color: "tertiary",
                icon: faSmile,
            },
            {
                id: 2,
                label: "Negative",
                value: neg_share,
                color: "quaternary",
                icon: faFrown,
            },
            {
                id: 3,
                label: "Neutral",
                value: neu_share,
                color: "primary",
                icon: faMeh,
            },
        ];
        setSentimentCircleData(sentimentCircleData);
    }

    // process heat map data
    function processHeatMap() {
        let geoData = [];
        for (let key in country_dict) {
            let value = country_dict[key];
            let data = {
                ISO3: key,
                count: value,
            };
            geoData.push(data);
        }
        console.log(geoData);
        setGeoData(geoData);
    }

    // parse each row of the documents
    function parse_api_data(document, idx) {
        let sentiment_score = 0;
        let sentiment_date = document.created_at[0].substring(0, 10);
        if (!(sentiment_date in dates)) {
            dates[sentiment_date] = [0, 0, 0, 0, 0];
        }
        if (document.sentiment_pred == "positive") {
            pos_sentiment_score += parseFloat(document.sentiment_score_postive);
            dates[sentiment_date][0] += parseFloat(
                document.sentiment_score_postive
            );
            pos_count += 1;
            dates[sentiment_date][2] += 1;
            sentiment_score = parseFloat(
                document.sentiment_score_postive * 10
            ).toFixed(2);
        } else if (document.sentiment_pred == "negative") {
            neg_sentiment_score -= parseFloat(
                document.sentiment_score_negative
            );
            dates[sentiment_date][1] += parseFloat(
                document.sentiment_score_negative
            );
            dates[sentiment_date][3] += 1;
            neg_count += 1;
            sentiment_score = parseFloat(
                -document.sentiment_score_negative * 10
            ).toFixed(2);
        } else {
            neu_count += 1;
            dates[sentiment_date][4] += 1;
        }
        if (document.country_code != null) {
            let country_code = document.country_code[0];
            if (country_code in country_dict) {
                country_dict[country_code] += 1;
            } else {
                country_dict[country_code] = 1;
            }
        }
        const tweet_details = {
            id: document.id,
            date_created: document.created_at[0].substring(0, 10),
            username: document.name,
            text: document.text,
            country_code: document.country_code,
            sentiment: sentiment_score,
            retweet_count: document.retweet_count[0],
            quote_count: document.quote_count[0],
            like_count: document.like_count[0],
            reply_count: document.reply_count[0],
        };
        tweet_list.push(tweet_details);
    }

    function parseCloudWordData(document, index) {
        const cluster_details = {
            value: document.labels[0],
            count: document.score,
        };
        word_cloud_list.push(cluster_details);
    }

    function processWordCloudData() {
        setWordCloudData(word_cloud_list);
    }

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 px-3">
                <Row className="flex-grow-1">
                    <Col xs={12}>
                        <div className="w-100">
                            <SearchHeading id={id} history={history} />
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-4 px-3">
                <Row>
                    <Col xs={12}>
                        <div className="w-100">
                            <ButtonGroup>
                                <Button
                                    onClick={() => setOverview(true)}
                                    variant={
                                        overview ? "primary" : "outline-primary"
                                    }
                                >
                                    Overview
                                </Button>
                                <Button
                                    onClick={() => setOverview(false)}
                                    variant={
                                        overview ? "outline-primary" : "primary"
                                    }
                                >
                                    All Tweets
                                </Button>
                            </ButtonGroup>
                        </div>
                    </Col>
                </Row>
            </div>

            {!overview && (
                <>
                    <Row className="justify-content-md-center">
                        <Col xs={12} className="mb-4">
                            <AllTweetsTable
                                title="All Tweets"
                                data={tweetData}
                            />
                        </Col>
                    </Row>
                </>
            )}

            {overview && (
                <>
                    <Row className="justify-content-md-center">
                        <Col xs={12} className="mb-4 d-none d-sm-block">
                            <SummaryWidget
                                title="Tweet Sentiment Over Time"
                                value={avgSentiment}
                                count={count}
                                data={sentimentData}
                                legend={sentimentCircleData}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} xl={12} className="mb-4">
                            <Row>
                                <Col xs={12} xl={8} className="mb-4">
                                    <Row>
                                        <Col xs={12} className="mb-4">
                                            <WordCloudWidget
                                                title="Word Cloud"
                                                data={wordCloudData}
                                            />
                                        </Col>
                                        <Col xs={12} className="mb-4">
                                            <MapChart
                                                title="Geographical Breakdown"
                                                data={geoData}
                                            />
                                        </Col>
                                        <Col xs={12} className="mb-4">
                                            <TweetsTable
                                                title="Top 10 Tweets"
                                                data={tweetData.slice(0, 10)}
                                                seeAll={() =>
                                                    setOverview(false)
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Col>

                                <Col xs={12} xl={4}>
                                    {sentimentSummaries.map((summary) => (
                                        <Row>
                                            <Col xs={12} className="mb-4">
                                                <SentimentWidget
                                                    category={summary.category}
                                                    count={summary.count}
                                                    avgSentiment={
                                                        summary.avgSentiment
                                                    }
                                                    icon={summary.icon}
                                                    color={summary.color}
                                                />
                                            </Col>
                                        </Row>
                                    ))}
                                    <Row>
                                        <Col xs={12} className="mb-4">
                                            <SentimentCircleWidget
                                                title="Numerical Breakdown"
                                                data={sentimentCircleData}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            )}

            <Row className="justify-content-md-center">
                <Col xs={12} className="mb-4 d-none d-sm-block"></Col>
            </Row>
        </>
    );
};
