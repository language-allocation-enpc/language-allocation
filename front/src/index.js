import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App'
import Login from './LoginPage'
import Admin from './Admin'
import Questionnaire from "./Questionnaire";
const routing = (
  <Router>
    <div>
      <Route path="/form" component={Questionnaire} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={Admin} />
    </div>
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
