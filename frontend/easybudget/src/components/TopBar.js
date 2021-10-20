import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

export default function TopBar(props) {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">EasyBudget</Navbar.Brand>
            <Nav className="mr-auto">
            {getLinks(props)}
            </Nav>
        </Navbar>
    )
}

function getLinks(props) {
  return props.user 
    ?
    (
      <Link to="/logout" className="nav-link">Log Out</Link>
    )
    :
    (
      <>
      <Link to="/login" className="nav-link">Login</Link>
      <Link to="/register" className="nav-link">Register</Link>
      </>
    )
}