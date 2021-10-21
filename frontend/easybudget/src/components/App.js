import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import TopBar from './TopBar';
import React, { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { AuthRoute, ProtectedRoute } from '../components/Routes'
import  Logout  from '../components/Logout'
import CreateBudget from '../components/CretaeBudget'
import BudgetsView from './BudgetsView';
import { Container } from 'react-bootstrap'
import { UserContextProvider } from '../contexts/UserContext';

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const jwt = localStorage.getItem('accessToken');
    if (!jwt) return;
    setUser(jwt_decode(jwt).username);
  }, []);

  return (
    <Router>
      <TopBar user={user}/>
      <Switch>
        <AuthRoute path="/login" isAuth={user !== undefined} setUser={setUser} component={LoginPage}/>
        <AuthRoute path="/register" isAuth={user !== undefined} component={RegisterPage}/>
        <ProtectedRoute path="/logout" isAuth={user !== undefined} setUser={setUser} component={Logout}/>
        <Route path="/" exact>
          <Container>
            {
            user
            && 
            <Container>
              <CreateBudget user={user}/>
              <UserContextProvider value={user}>
                <BudgetsView user={user}/>
              </UserContextProvider>
            </Container>
            }
          </Container>
        </Route>
      </Switch>

    </Router>
    
  );
}

export default App;