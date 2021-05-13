import React, { useState } from "react";
import { Routes } from "../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button, InputGroup, Form } from "@themesberg/react-bootstrap";

// Search Bar / Title. Can type into to search for new queries
export const SearchHeading = (props) => {
    const { id, history } = props;
    const [value, setValue] = useState("");
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = (event) => {
        history.push(`${Routes.DashboardOverview.path}/${value}`);
        setValue("");
    };

    return (
        <Form onSubmit={handleSubmit}>
            <div className="d-flex">
                <InputGroup size="lg" className="me-2">
                    <Form.Control
                        type="text"
                        onChange={handleChange}
                        placeholder={id}
                        value={value === "*" ? "All Tweets" : value}
                    />
                </InputGroup>
                <Button type="submit" variant="outline-secondary">
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="d-none d-sm-inline mx-3"
                    />
                </Button>
            </div>
        </Form>
    );
};
