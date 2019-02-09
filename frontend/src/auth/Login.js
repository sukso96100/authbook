import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './Login.css';
import logo from '../logo.svg';
import '@material/react-text-field/dist/text-field.css';
import '@material/react-button/dist/button.css';
import TextField, {HelperText, Input} from '@material/react-text-field';
import Button from '@material/react-button';

export default class App extends Component {
    constructor(){
        super();
        this.state = {
            id: "", password: ""
        };
        
    }
  render() {
    return (
    <div class="Login">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Authbook</h1>
        <TextField 
            class="loginForm"
            label='ID'>
            <Input
                value={this.state.id}
                onChange={(e) => this.setState({id: e.target.value})}/>
        </TextField><br/>
        <TextField 
            class="loginForm"
            label='Password'>
            <Input
                type="password"
                value={this.state.password}
                onChange={(e) => this.setState({password: e.target.value})}/>
        </TextField><br/>
        <Button>Sign Up</Button>
        <Button raised="true">Log In</Button>
    </div>
    );
  }
}

