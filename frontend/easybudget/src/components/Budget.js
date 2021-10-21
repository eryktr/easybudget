import axios from "axios";
import { useState } from "react";
import { Card, ListGroup, Button } from "react-bootstrap";
import { HOST } from "../const";
import CreateTransactionForm from "./CreateTransactionForm";

export default function Budget(props) {
    const { budgetData, canDelete, setDeletedBudgetId } = props;
    const { id, name, author, amount, transactions, contributors } = budgetData;
    console.log(id);
    const [addTransactionVisible, setAddTransactionVisible] = useState(false);
    return (
      <Card style={{ width: "50rem" }} className="mb-3" border="primary">
        <Card.Body>
          <Card.Title><b>Name:</b> {name}</Card.Title>
          <Card.Title><b>Author:</b> {author}</Card.Title>
          <Card.Title><b>Amount:</b> {amount}</Card.Title>
          <Card.Title><b>Number of transactions:</b> {transactions.length}</Card.Title>
          <Card.Title><b>Contributors:</b> {contributors}</Card.Title>
          <Card.Title><b>Transactions</b></Card.Title>
          <ListGroup>
              {transactions.map((t, i) => {
                  return (
                      <ListGroup.Item key={i}>
                          <b>Owner: </b>: {t.owner}<br/>
                          <b>Type: </b> {t.type}<br/>
                          <b>Amount: </b>{t.amount}<br/>
                          <b>Description: </b> {t.description}
                      </ListGroup.Item>
                  )
              })}
          </ListGroup>
          <Button variant="primary">View</Button>
          {canDelete && <Button variant="danger" onClick={() => deleteBudget(id, setDeletedBudgetId)}>Delete</Button>}
          <Button variant="warning" onClick={() => setAddTransactionVisible(!addTransactionVisible)}>Add transaction</Button>
          {addTransactionVisible && <CreateTransactionForm budgetId={id}/>}
        </Card.Body>
      </Card>
    );
  }

  function deleteBudget(id, setDeletedBudgetId) {
    const url = HOST + '/budget';
    const data = {
        budget_id: id
    }
    const headers = {
       Authorization: "Bearer " + localStorage.getItem("accessToken"),
   };

    axios.delete(url, {
        headers: headers,
        data: data
   }).then(res => console.log(res.data.id) || setDeletedBudgetId(res.data.id))
}