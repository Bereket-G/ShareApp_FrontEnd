import React, { Component } from 'react';
import Api from '../../api';

export default class Signup extends Component {
    constructor(props){
        super(props);
        this.state = {
            username:"",
            password:"",
            firstname:"",
            lastname:"",
            email:""
        }
    }

    signup = () => {
      let data = {
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
        firstname: this.state.firstname,
        lastname: this.state.lastname
      }
      Api.signup(data)
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
        <input type="text" name="firstname" onChange={(e)=>{this.setState({firstname:e.target.value});}}></input> <br />
        <input type="text" name="lastname" onChange={(e)=>{this.setState({lastname:e.target.value});}}></input> <br />
        <input type="email" name="email" onChange={(e)=>{this.setState({email:e.target.value});}}></input> <br />
        <input type="text" name="username" onChange={(e)=>{this.setState({username:e.target.value});}}></input> <br />
        <input type="password" name="username"  onChange={(e)=>{this.setState({password:e.target.value});}}></input> <br />
        <button onClick={this.signup}>Sign Up</button>
        
      </div>
    )
  }
}
