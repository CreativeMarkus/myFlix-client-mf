import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavigationBar = ({ user, onLogout }) => {
    return (
        <Navbar
            bg="secondary-subtle"
            variant="light"
            data-bs-theme="light"
            expand="md"
            className="mb-4 w-100 py-2"
        >
            <Navbar.Brand as={Link} to="/" className="px-3">myFlix</Navbar.Brand>
            <Navbar.Toggle aria-controls="app-navbar" />
            <Navbar.Collapse id="app-navbar" className="px-3">
                <Nav className="me-auto">
                    {user ? (
                        <>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                        </>
                    )}
                </Nav>
                {user && (
                    <div className="d-flex gap-2">
                        <Button variant="outline-dark" onClick={onLogout}>Logout</Button>
                    </div>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;
