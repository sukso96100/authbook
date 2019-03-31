import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Router, Route, Link, Redirect } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import PropTypes from 'prop-types';

import App from './App';
import Login from './auth/Login';
import history from './history';
import authbookApp from './data/Reducers';

const store = createStore(authbookApp);


ReactDOM.render((
<Provider store={store}>
      <Router history={history}>
          <div>
                <Route exact path="/" render={() => (
                    <Redirect to="/app/home"/>
                )}/>
                <Route path="/app" component={App} />
                <Route exact path="/login" component={Login}/>
          </div>
      </Router>
    </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
