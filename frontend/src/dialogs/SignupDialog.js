import React, { Component } from 'react';
import { Router, Route, NavLink } from "react-router-dom";
import '@material/react-text-field/dist/text-field.css';
import "@material/react-dialog/dist/dialog.css";
import '@material/react-linear-progress/dist/linear-progress.css';
import './DialogInputStyle.css';

import TextField, {HelperText, Input} from '@material/react-text-field';
import LinearProgress from '@material/react-linear-progress';
import Api from '../data/Api';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog';

export default class SignupDialog extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            serverUrl:"",
            username: "",
            displayName: "",
            email: "",
            password: "",
            passwordCheck: "",
            loading: false,
            done: false,
            message: ""
        };
    }
    
    openForm(serverUrl){
        this.setState({isOpen: true, serverUrl: serverUrl});
    }
    
    render(){
        const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
        const content = this.state.done ? (<div>
                <DialogContent>
                    <h2>Almost done!</h2>
                    <p>We just sent an email that includes email verification code. 
                        To use your account, verify your email with the code on your first login.</p>
                </DialogContent>
                <DialogFooter>
                    <DialogButton isDefault onClick={async ()=>{
                            this.setState({isOpen: false, done: false})
                        }}>OK</DialogButton>
                </DialogFooter>
            </div>) : 
            (<div>
                <DialogContent>
                    <TextField label='Server URL'>
                        <Input disabled={true}
                            value={this.state.serverUrl}/>
                    </TextField>
                    <TextField label='Username'>
                        <Input disabled={this.state.loading}
                            value={this.state.username}
                            onChange={(e) => this.setState({username: e.target.value})}/>
                    </TextField>
                    <TextField label='Display Name'>
                        <Input disabled={this.state.loading}
                            value={this.state.displayName}
                            onChange={(e) => this.setState({displayName: e.target.value})}/>
                    </TextField>
                    <TextField label='Email Address'>
                        <Input disabled={this.state.loading}
                            value={this.state.email}
                            onChange={(e) => this.setState({email: e.target.value})}/>
                    </TextField>
                    <TextField label='Password'>
                        <Input disabled={this.state.loading}
                            type="password"
                            value={this.state.password}
                            onChange={(e) => this.setState({password: e.target.value})}/>
                    </TextField>
                    <TextField label='Password Check'>
                        <Input disabled={this.state.loading}
                            type="password"
                            value={this.state.passwordCheck}
                            onChange={(e) => this.setState({passwordCheck: e.target.value})}/>
                    </TextField>
                    <p>{this.state.message}</p>
                </DialogContent>
                    {loading}
                <DialogFooter>
                    <DialogButton isDefault disabled={this.state.loading}
                        onClick={async ()=>{
                            this.setState({loading: true})
                            const res = await Api.addAccount(
                                            this.state.username,
                                            this.state.displayName,
                                            this.state.email,
                                            this.state.password,
                                            this.state.passwordCheck)
                            const result = await res.json();
                            if(res.ok){
                                this.setState({loading: false, done: true});

                            }else{
                                this.setState({loading: false, message: result.message});
                            }
                        }}>Sign Up</DialogButton>
                </DialogFooter>
            </div>)
        return(
            <Dialog open={this.state.isOpen} onClose={()=>this.setState({isOpen: false, done: false})}>
            <DialogTitle>Sign Up</DialogTitle>
                {content}
            </Dialog>
        )
    }
}