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
    const defaultName = "Budget name";
    const defaultAmount = "100";
    const defaultContributors = "";

    const [name, setName] = useState(defaultName);
    const [amount, setAmount] = useState(defaultAmount);
    const [contributors, setContributors] = useState(defaultContributors);

    const [ok, setOk] = useState(false);
    const [error, setError] = useState(false);

    return (
        <Form id="createBudgetForm">
            <h1>Create Budget</h1>
            {ok && <Alert variant="success">Budget successfully created</Alert>}
            {error && <Alert variant="danger">Something went wrong</Alert>}
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Budget name" onChange={e => setName(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" placeholder="100" onChange={e => setAmount(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Contributors</Form.Label>
                <Form.Control type="text" placeholder="" onChange={e=> setContributors(e.target.value)}></Form.Control>
                <Form.Text className="text-muted">
                    Comma separated list of usernames.
                </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={e => createBudget(e, user, name, amount, contributors, setOk, setError)}>
                Create Budget
            </Button>
        </Form>
    )
}

function createBudget(e, user, name, amount, contributors, setOk, setError) {
    e.preventDefault();
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

    axios.post(url, data, {
        headers: headers,
    }).then(res => {
        if (res.data.id) {
            setOk(true);
            setError(false);
        } else {
            setError(true);
            setOk(false);
        }
    })
    .catch(err => {
        setError(true);
        setOk(false);
    })
}