import React, { Component } from 'react'
import {Redirect, Route, Switch} from 'react-router-dom';
import { withSnackbar } from 'notistack';

import Header from "./Header"
import Footer from "./Footer"
import routes from "../routes"

class Container extends Component {
  state = {
    title: "Home"
  }
  changeTitle = (val) => {
    this.setState({title: val});
  }
  render() {
    return (
      <div style={{backgroundColor:"#dae0e6"}}>
          <Header title={this.state.title} changeTitle={this.changeTitle}/>
            <Switch>
            {routes.map((route, idx) => {
                    return route.component ? <Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                        <route.component {...props} enqueueSnackbar={this.props.enqueueSnackbar} changeTitle={this.changeTitle}/>
                      )} />
                      : (null);
                  },
                )}
                <Redirect to="/" />
            </Switch>
         <Footer />
      </div>
    )
  }
};


export default withSnackbar(Container)
