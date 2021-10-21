import React, { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import axios from "axios";

const registerUrl = "http://localhost:5000/register";

export default function RegisterPage(props) {
  const [registerFailed, setRegisterFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  return (
    <Container>
      <Form id="loginForm">
        <h1>Register</h1>
        {success && <Alert variant="success">User has been created!</Alert>}
        {registerFailed && <Alert variant="danger">{error}</Alert>}
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="username" id="usernameField" />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="password"
            id="passwordField"
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Repeat Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="password"
            id="passwordRepeatField"
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          onClick={(e) => register(e, setRegisterFailed, setError, setSuccess)}
        >
          Register
        </Button>
      </Form>
    </Container>
  );
}

function register(e, setRegisterFailed, setError, setSuccess) {
  e.preventDefault();
  const username = document.getElementById("usernameField").value;
  const password = document.getElementById("passwordField").value;
  const repeatPassword = document.getElementById("passwordRepeatField").value;
  if (password !== repeatPassword) {
    setRegisterFailed(true);
    setError("Passwords do not match");
  }
  let data = {
    username: username,
    password: password,
  };
  axios
    .post(registerUrl, data)
    .then((res) => {
      const status = res.data.status;
      if (status === "User exists") {
        setRegisterFailed(true);
        setError("User already exists.");
      } else if (status === "OK") {
        setRegisterFailed(false);
        setSuccess(true);
      }
    })
    .catch((err) => {
      setRegisterFailed(true);
      setError("Server error");
    });
}
