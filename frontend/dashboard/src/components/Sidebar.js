import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Dropdown } from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import { cryptoIcons } from "../data/cryptoIcons";
import { Routes } from "../routes";

export default (props = {}) => {
    const location = useLocation();
    const { pathname } = location;
    const [show, setShow] = useState(false);
    const showClass = show ? "show" : "";

    const NavItem = (props) => {
        const {
            title,
            link,
            external,
            target,
            icon,
            image,
            badgeText,
            badgeBg = "secondary",
            badgeColor = "primary",
        } = props;
        const classNames = badgeText
            ? "d-flex justify-content-start align-items-center justify-content-between"
            : "";
        const navItemClassName = link === pathname ? "active" : "";
        const linkProps = external ? { href: link } : { as: Link, to: link };

        return (
            <Nav.Item
                className={navItemClassName}
                onClick={() => setShow(false)}
            >
                <Nav.Link {...linkProps} target={target} className={classNames}>
                    <span>
                        {icon ? (
                            <span className="sidebar-icon">
                                <FontAwesomeIcon icon={icon} />{" "}
                            </span>
                        ) : null}
                        {image ? (
                            <Image
                                src={image}
                                width={20}
                                height={20}
                                className="sidebar-icon svg-icon"
                            />
                        ) : null}

                        <span className="sidebar-text">{title}</span>
                    </span>
                    {badgeText ? (
                        <Badge
                            pill
                            bg={badgeBg}
                            text={badgeColor}
                            className="badge-md notification-count ms-2"
                        >
                            {badgeText}
                        </Badge>
                    ) : null}
                </Nav.Link>
            </Nav.Item>
        );
    };

    return (
        <>
            <CSSTransition
                timeout={300}
                in={show}
                classNames="sidebar-transition"
            >
                <SimpleBar
                    className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}
                >
                    <div className="sidebar-inner px-4 pt-3">
                        <Nav className="flex-column pt-3 pt-md-0">
                            <NavItem
                                title="Home"
                                link={Routes.Presentation.path}
                                icon={faHome}
                            />

                            <Dropdown.Divider className="my-3 border-indigo" />

                            {cryptoIcons.map((c) => (
                                <NavItem
                                    title={c.title}
                                    link={`${Routes.DashboardOverview.path}/${c.title}`}
                                    image={c.image}
                                />
                            ))}
                        </Nav>
                    </div>
                </SimpleBar>
            </CSSTransition>
        </>
    );
};
