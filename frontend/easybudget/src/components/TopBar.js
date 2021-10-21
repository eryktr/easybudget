import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

export default function TopBar(props) {
    let user = props.user;
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand href="/">EasyBudget</Navbar.Brand>
             {user && <Navbar.Text>Logged in as {user}</Navbar.Text>}
              <Nav className="mr-auto">
              {getLinks(props)}
              </Nav>
            </Container>
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