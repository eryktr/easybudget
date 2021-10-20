import axios from "axios"
import { useState } from "react"
import { Alert, Container, Form, Button } from "react-bootstrap"
import { HOST } from "../const"


export default function CreateBudget(user) {
    const [formVisible, setFormVisible] = useState(false)
    return (
        <Container>
            <Alert variant="info" onClick={() => setFormVisible(!formVisible)}>Create Budget</Alert>
            {formVisible && <BudgetForm user={user}/>}
        </Container>
    )
}

function BudgetForm(user) {
    return (
        <Form id="createBudgetForm">
            <h1>Create Budget</h1>
            
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Budget name" id="nameField"></Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" placeholder="100" id="amountField"></Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Contributors</Form.Label>
                <Form.Control type="text" placeholder="" id="contributorsField"></Form.Control>
                <Form.Text className="text-muted">
                    Comma separated list of usernames.
                </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={e => createBudget(e, user)}>
                Create Budget
            </Button>
        </Form>
    )
}

function createBudget(e, user) {
    e.preventDefault();
    const name = document.getElementById("nameField").value;
    const amount = document.getElementById("amountField").value;
    const contributors = document.getElementById("contributorsField").value;
    const author = user;

    const url = HOST + '/budget'
    let contributorsArray;
    if (contributors) {
        contributorsArray = contributors.split(',')
    }  else {
        contributorsArray = []
    }
    const data = {
        author: author,
        name: name,
        amount: amount,
        contributors: contributorsArray
    }

    const headers = {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
    }

    console.log(data)

    axios.post(url, data, {
        headers: headers,
    }).then(res => console.log(res))
}