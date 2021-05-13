import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
    Col,
    Row,
    Button,
    Container,
    InputGroup,
    Form,
} from "@themesberg/react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { Routes } from "../routes";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "", history: props.history };
    }
    handleChange = (event) => {
        this.setState({ value: event.target.value });
    };

    handleSubmit = (event) => {
        this.state.history.push(
            `${Routes.DashboardOverview.path}/${this.state.value}`
        );
        return (
            <Link to={`${Routes.DashboardOverview.path}/${this.state.value}`} />
        );
    };

    render() {
        return (
            <Form className="w-50" onSubmit={this.handleSubmit}>
                <Form.Group id="searchBar">
                    <InputGroup size="md">
                        <InputGroup.Text>
                            <FontAwesomeIcon icon={faSearch} />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search Crypto Tweets"
                            onChange={this.handleChange}
                            value={this.state.value}
                        />
                    </InputGroup>
                </Form.Group>
                <Button
                    type="submit"
                    variant="secondary"
                    // to={`${Routes.DashboardOverview.path}/${this.state.value}`}
                    className="text-dark me-3 mt-3"
                >
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="d-none d-sm-inline ms-1"
                    />{" "}
                    Search Now
                </Button>
            </Form>
        );
    }
}

export default () => {
    let history = useHistory();
    return (
        <>
            <section
                className="section-header d-flex vh-100 align-items-center bg-primary text-white"
                id="home"
            >
                <Container>
                    <Row>
                        <Col xs={12} className="text-center">
                            <h1 className="fw-bolder text-secondary">
                                CryptoQuery
                            </h1>
                            <p className="text-muted fw-light mb-3 h5">
                                A search engine for Tweets about Cryptocurrency
                            </p>
                            <div className="d-flex align-items-center justify-content-center">
                                <SearchBar history={history} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};
