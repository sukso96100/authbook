import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Api from '../data/Api';
import './Login.css';
import logo from '../logo.svg';
import '@material/react-text-field/dist/text-field.css';
import '@material/react-button/dist/button.css';
import TextField, {HelperText, Input} from '@material/react-text-field';
import Button from '@material/react-button';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "", password: "", url: ""
        };
        
    }
  render() {
      return (
    <div class="Login">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Authbook</h1>
        <TextField 
            class="loginForm"
            label='Server URL'>
            <Input
                value={this.state.url}
                onChange={(e) => this.setState({url: e.target.value})}/>
        </TextField><br/>
        <TextField 
            class="loginForm"
            label='Username'>
            <Input
                value={this.state.username}
                onChange={(e) => this.setState({username: e.target.value})}/>
        </TextField><br/>
        <TextField 
            class="loginForm"
            label='Password'>
            <Input
                type="password"
                value={this.state.password}
                onChange={(e) => this.setState({password: e.target.value})}/>
        </TextField><br/>
        <Button raised="true" onClick={this.login.bind(this)}>Log In</Button><br/>
        <Button>Sign Up</Button>
        <Button>Forgot password</Button>
    </div>
      );
  }
    async login(){
        Api.setUrl(this.state.url);
        let res = await Api.login(this.state.username, this.state.password);
    }
}

