import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import Login from './views/account/Login';
import Signup from './views/account/Signup';
import Container from './containers';
import PrivateRoute from './PrivateRoute';

// import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <SnackbarProvider maxSnack={3}>
        <HashRouter>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route exact path="/register" name="Register Page" component={Signup} />
            <PrivateRoute path="/" name="Home" component={Container} />
          </Switch>
        </HashRouter>
      </SnackbarProvider>
    );
  }
}

export default App;
