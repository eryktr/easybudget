import React, { useState } from 'react'
import { Form, Button, Alert, Container } from 'react-bootstrap'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

const loginUrl = 'http://localhost:5000/login';


export default function LoginPage(props) {
    const { setUser } = props;
    const [loginFailed, setLoginFailed] = useState(false);
    const history = useHistory();
    return (
    <Container>
        <Form id="loginForm">
            <h1>Log In</h1>
            {
            loginFailed 
            && 
            <Alert variant='danger'>
                Invalid username or password
            </Alert>
            }
            <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="username" id="usernameField"></Form.Control>
            </Form.Group>

            <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="password" id="passwordField"></Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={
                (e) => signIn(e,setLoginFailed, history, setUser)
            }>
                Log In
            </Button>
        </Form>
    </Container>
    )
}

function signIn(e, setLoginFailed, history, setUser) {
    e.preventDefault();
    const username = document.getElementById("usernameField").value;
    const password = document.getElementById("passwordField").value;
    let data = {
        username: username,
        password: password
    }
    axios.post(loginUrl, data)
    .then(res => {
        const token = res.data.jwt;
        localStorage.setItem('accessToken', token);
        setUser(jwt_decode(token).username);
        history.push('/');
    })
    .catch(err =>  {
        setLoginFailed(true);
    });
}