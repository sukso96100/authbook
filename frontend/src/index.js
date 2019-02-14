import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Router, Route, Link } from "react-router-dom";
import * as serviceWorker from './serviceWorker';

import App from './App';
import Login from './auth/Login';
import history from './history';

const routing = (
  <Router history={history}>
        <div>
            <Route exact path="/" component={App} />
            <Route exact path="/login" component={Login}/>
        </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
