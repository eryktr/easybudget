import { Container, Alert, Card, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { HOST } from "../const";
import axios from "axios";

export default function BudgetsView() {
  const [yourBudgetsVisible, setYourBudgetsVisible] = useState(false);
  const [sharedBudgetsVisible, setSharedBudgetsVisible] = useState(false);

  const [yourBudgets, setYourBudgets] = useState([]);
  const [yourBudgetsPage, setYourBudgetsPage] = useState(0);
  const [yourBudgetsNumPages, setYourBudgetsNumPages] = useState(0);

  const [sharedBudgets, setSharedBudgets] = useState([]);
  const [sharedBudgetsPage, setSharedBudgetsPage] = useState(0);
  const [sharedBudgetsNumPages, setSharedBudgetsNumPages] = useState(0);

  useEffect(() => {
    updateBudgets(setYourBudgets, setYourBudgetsNumPages, yourBudgetsPage, 'own');
  }, [yourBudgetsPage]);

  useEffect(() => {
      updateBudgets(setSharedBudgets, setSharedBudgetsNumPages, sharedBudgetsPage, 'shared');
  }, [sharedBudgetsPage])

  return (
    <Container>
      <Alert
        variant="primary"
        onClick={(e) => setYourBudgetsVisible(!yourBudgetsVisible)}
      >
        Your budgets
      </Alert>
      {yourBudgetsVisible && (
        <YourBudgetsOverview
          yourBudgets={yourBudgets}
          yourBudgetsPage={yourBudgetsPage}
          yourBudgetsNumPages={yourBudgetsNumPages}
          setYourBudgetsPage={setYourBudgetsPage}
        ></YourBudgetsOverview>
      )}

      <Alert
        variant="secondary"
        onClick={(e) => setSharedBudgetsVisible(!sharedBudgetsVisible)}
      >
        Budgets shared with you
      </Alert>
      {sharedBudgetsVisible && (
        <SharedBudgetsOverview
          sharedBudgets={sharedBudgets}
          sharedBudgetsPage={sharedBudgetsPage}
          sharedBudgetsNumPages={sharedBudgetsNumPages}
          sharedYourBudgetsPage={setSharedBudgetsPage}
        ></SharedBudgetsOverview>
      )}
    </Container>
  );
}

function Budget(props) {
  const { name, amount, transactions, canDelete } = props;

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Name: {name}</Card.Title>
        <Card.Title>Amount: {amount}</Card.Title>
        <Card.Title>Number of transactions: {transactions.length}</Card.Title>
        <Button variant="primary">View</Button>
        {canDelete && <Button variant="danger">Delete</Button>}
      </Card.Body>
    </Card>
  );
}

function YourBudgetsOverview(props) {
  const {
    yourBudgets,
    yourBudgetsPage,
    yourBudgetsNumPages,
    setYourBudgetsPage,
  } = props;
  return (
    <>
      {getYourBudgets(yourBudgets)}
      {getPagingPanel(yourBudgetsPage, yourBudgetsNumPages, setYourBudgetsPage)}
    </>
  );
}

function SharedBudgetsOverview(props) {
    const {
        sharedBudgets,
        sharedBudgetsPage,
        sharedBudgetsNumPages,
        setSharedBudgetsPage,
    } = props;

    return (
    <>
      {getSharedBudgets(sharedBudgets)}
      {getPagingPanel(sharedBudgetsPage, sharedBudgetsNumPages, setSharedBudgetsPage)}
    </>
    )
}

function updateBudgets(setBudgets, setNumPages, page, type) {
  const url = HOST + "/budgets";
  const reqConfig = {
    params: {
      type: type,
      page: page,
    },
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  };
  axios.get(url, reqConfig).then((res) => {
    const budgets = res.data.budgets;
    const numPages = res.data.num_pages;
    setBudgets(budgets);
    setNumPages(numPages);
  });
}

function getYourBudgets(yourBudgets) {
  return yourBudgets.map((budget, idx) => (
    <Budget
      key={idx}
      name={budget.name}
      amount={budget.amount}
      transactions={budget.transactions}
      canDelete={true}
    />
  ));
}

function getSharedBudgets(sharedBudgets) {
    return sharedBudgets.map((budget, idx) => (
        <Budget
          key={idx}
          name={budget.name}
          amount={budget.amount}
          transactions={budget.transactions}
          canDelete={false}
        />
      ));
}


function getPagingPanel(page, numPages, setPage) {
  return (
    <>
      Page: {page + 1}/{numPages}
      {page > 0 && <Button variant="primary" onClick={() => setPage(page-1)}>Prev</Button>}
      {page >= 0 && page <= numPages && <Button variant="primary" onClick={() => setPage(page+1)}>Next</Button>}
    </>
  );
}
