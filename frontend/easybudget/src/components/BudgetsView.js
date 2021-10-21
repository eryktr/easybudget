import { Container, Alert, Card, Button, ListGroup } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { HOST } from "../const";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import Budget from "./Budget";

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

export default function BudgetsView() {
  const [yourBudgetsVisible, setYourBudgetsVisible] = useState(false);
  const [sharedBudgetsVisible, setSharedBudgetsVisible] = useState(false);

  const [yourBudgets, setYourBudgets] = useState([]);
  const [yourBudgetsPage, setYourBudgetsPage] = useState(0);
  const [yourBudgetsNumPages, setYourBudgetsNumPages] = useState(0);

  const [sharedBudgets, setSharedBudgets] = useState([]);
  const [sharedBudgetsPage, setSharedBudgetsPage] = useState(0);
  const [sharedBudgetsNumPages, setSharedBudgetsNumPages] = useState(0);

  const [deletedBudgetId, setDeletedBudgetId] = useState(0);

  useEffect(() => {
    updateBudgets(setYourBudgets, setYourBudgetsNumPages, yourBudgetsPage, 'own');
  }, [yourBudgetsPage, deletedBudgetId, yourBudgetsVisible]);

  useEffect(() => {
      updateBudgets(setSharedBudgets, setSharedBudgetsNumPages, sharedBudgetsPage, 'shared');
  }, [sharedBudgetsPage, sharedBudgetsVisible]);

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
          setDeletedBudgetId={setDeletedBudgetId}
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


function YourBudgetsOverview(props) {
  const {
    yourBudgets,
    yourBudgetsPage,
    yourBudgetsNumPages,
    setYourBudgetsPage,
    setDeletedBudgetId,
  } = props;
  return (
    <>
      {getYourBudgets(yourBudgets, setDeletedBudgetId)}
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

function getYourBudgets(yourBudgets, setDeletedBudgetId) {
  return yourBudgets.map((budget, idx) => (
    <Budget
      key={idx}
      budgetData={budget}
      canDelete={true}
      setDeletedBudgetId={setDeletedBudgetId}
    />
  ));
}

function getSharedBudgets(sharedBudgets) {
    return sharedBudgets.map((budget, idx) => (
        <Budget
          key={idx}
          budgetData={budget}
          canDelete={false}
        />
      ));
}


function getPagingPanel(page, numPages, setPage) {
  return (
    <>
      Page: {page + 1}/{numPages}
      {page > 0 && <Button variant="primary" onClick={() => setPage(page-1)}>Prev</Button>}
      {page >= 0 && page + 1 < numPages && <Button variant="primary" onClick={() => setPage(page+1)}>Next</Button>}
    </>
  );
}
