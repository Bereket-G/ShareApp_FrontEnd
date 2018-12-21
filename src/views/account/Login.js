import React, { Component } from 'react';
import Api from '../../api';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username:"",
            password:""
        }
    }

    login = () => {
        Api.login(this.state.username, this.state.password)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
    }
  render() {
    return (
      <div>
        <input type="text" name="username" onChange={(e)=>{this.setState({username:e.target.value});}}></input> <br />
        <input type="password" name="username"  onChange={(e)=>{this.setState({password:e.target.value});}}></input> <br />
        <button onClick={this.login}>Submit</button>
        
      </div>
    )
  }
}
