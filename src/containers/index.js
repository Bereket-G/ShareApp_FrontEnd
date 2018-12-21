import React, { Component } from 'react'
import {Redirect, Route, Switch} from 'react-router-dom';

import Header from "./Header"
import Footer from "./Footer"
import routes from "../routes"

export default class Container extends Component {
  render() {
    return (
      <div>
          <Header />
            <Switch>
            {routes.map((route, idx) => {
                    return route.component ? <Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                        <route.component {...props} />
                      )} />
                      : (null);
                  },
                )}
            </Switch>
         <Footer />
      </div>
    )
  }
}
