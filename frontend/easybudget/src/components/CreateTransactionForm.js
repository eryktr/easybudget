import axios from "axios";
import { useContext, useState } from "react";
import { Form, Alert, Button } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import { HOST } from '../const';
import { BudgetsContext } from "../contexts/BudgetsContext";

export default function CreateTransactionForm(props) {
    const { budgetId } = props;
    const user = useContext(UserContext);
    const forceRerender = useContext(BudgetsContext);
    
    const defaultName = "Transaction name";
    const defaultAmount = "5";
    const defaultType = "EXPENSE";

    const [name, setName] = useState(defaultName);
    const [amount, setAmount] = useState(defaultAmount);
    const [type, setType] = useState(defaultType);

    const [error, setError] = useState();
    
    return (
        <Form id="createTransactionForm">
            <h1>Create Transaction</h1>
            {error && <Alert variant="danger">Something went wrong</Alert>}
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Transaction name" onChange={e => setName(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" placeholder="5" onChange={e => setAmount(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Contributors</Form.Label>
                <Form.Select aria-label="Default select example" onChange={e => setType(e.target.value)}>
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={e => createTransaction(e, budgetId, user, name, amount, type, setError, forceRerender)}>
                Create Transaction
            </Button>
        </Form>
    )
}


function createTransaction(e, budgetId, owner, name, amount, type, setError, forceRerender) {
    e.preventDefault();

    const url = HOST + '/transaction';
    const data = {
        description: name,
        amount: amount,
        type: type,
        budget_id: budgetId,
        username: owner
    }

    const headers = {
        Authorization: "Bearer " + localStorage.getItem("accessToken")
    }

    axios.post(url, data, {
        headers: headers
    }).then(res => {
        setError(false);
        forceRerender();
    })
    .catch(err => setError(true))
    console.log(data)
} 