import axios from "axios";
import { useContext, useState } from "react";
import { Form, Alert, Button } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import { HOST } from '../const';

export default function CreateTransactionForm(props) {
    const user = useContext(UserContext);
    const [error, setError] = useState();
    const { budgetId } = props;
    return (
        <Form id="createTransactionForm">
            <h1>Create Transaction</h1>
            {error && <Alert variant="danger">Something went wrong</Alert>}
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Transaction name" id="nameField"></Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" placeholder="5" id="amountField"></Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Contributors</Form.Label>
            <Form.Select aria-label="Default select example" id="typeField">
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
                </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={e => createTransaction(e, budgetId, user, setError)}>
                Create Transaction
            </Button>
        </Form>
    )
}


function createTransaction(e, budgetId, owner, setError) {
    e.preventDefault();
    const name = document.getElementById("nameField").value;
    const amount = document.getElementById("amountField").value;
    const type = document.getElementById("typeField").value;

    const url = HOST + '/transaction';
    const data = {
        description: name,
        amount: amount,
        type: type,
        budget_id: budgetId,
        username: owner
    }

    console.log(data);

    const headers = {
        Authorization: "Bearer " + localStorage.getItem("accessToken")
    }

    axios.post(url, data, {
        headers: headers
    }).then(res => {setError(false)})
    .catch(err => setError(true))
    console.log(data)
} 