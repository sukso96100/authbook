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

export default class PasswordRecoverDialog extends Component{
    
    step = {
        INIT: 0,
        REQUEST: 1,
        REQUESTED: 2,
        VERIFY: 3,
        DONE: 4
    };
    
    constructor(props) {
        super(props);
        this.state = {
            serverUrl:"",
            isOpen: false,
            step: this.step.INIT,
            email: "",
            username: "",
            verificationCode: "",
            password: "",
            passwordCheck: "",
            loading: false,
            message: ""
        };
    }
    
    openForm(serverUrl){
        this.setState({isOpen: true, serverUrl: serverUrl});
    }

    onClose(){
        this.setState({
            serverUrl:"",
            isOpen: false,
            step: this.step.INIT,
            email: "",
            username: "",
            verificationCode: "",
            password: "",
            passwordCheck: "",
            loading: false,
            message: ""
        });
    }
    
    async requestRecover(){
        this.setState({loading: true});
        try{
            let res = await Api.reqPasswordRecovery(this.state.email);
            if(res.ok){
                this.setState({loading: false, step: this.step.REQUESTED});
            }else{
                const result = await res.json();
                this.setState({loading: false, message: result.message});
            }
        }catch(error){
            console.log(error);
        }
    }

    async recoverPassword(){
        this.setState({loading: true});
        try{
            let res = await Api.recoverPassword(
                this.state.username,
                this.state.verificationCode,
                this.state.password,
                this.state.passwordCheck);
            if(res.ok){
                this.setState({loading: false, step: this.step.DONE});
            }else{
                const result = await res.json();
                this.setState({loading: false, message: result.message});
            }
        }catch(error){
            console.log(error);
        }
    }
    
    render(){
        const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
        let content;
        switch(this.state.step){
            case this.step.INIT:
                content = (<div>
                    <DialogContent>
                        <p>Did you received a verification code for recovering your password via email?</p>
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.REQUEST})
                            }}>No</DialogButton>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.VERIFY})
                            }}>Yes</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.REQUEST:
                content = (<div>
                    <DialogContent>
                        <p>Submit email address of your authbook account to get a verification code.</p>
                        <TextField label='Server URL'>
                            <Input disabled={true}
                                value={this.state.serverUrl}/>
                        </TextField>
                        <TextField label='Email Address'>
                            <Input disabled={this.state.loading}
                                value={this.state.email}
                                onChange={(e) => this.setState({email: e.target.value})}/>
                        </TextField>
                        <p>{this.state.message}</p>
                    </DialogContent>
                        {loading}
                    <DialogFooter>
                        <DialogButton isDefault disabled={this.state.loading}
                            onClick={this.requestRecover.bind(this)}>Submit</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.REQUESTED:
                content = (<div>
                    <DialogContent>
                        <p>Now, check your inbox and prepare your verification code.<br/>
                            Couldn't received? You can move to previous step and request again.<br/>
                            Click "Next" if you are ready.</p>
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.REQUEST})
                            }}>Previous</DialogButton>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.VERIFY})
                            }}>Next</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.VERIFY:
                content = (<div>
                    <DialogContent>
                        <p>Use the verification code you received to recover password.</p>
                        <TextField label='Server URL'>
                            <Input disabled={true}
                                value={this.state.serverUrl}/>
                        </TextField>
                        <TextField label='Username'>
                            <Input disabled={this.state.loading}
                                value={this.state.username}
                                onChange={(e) => this.setState({username: e.target.value})}/>
                        </TextField>
                        <TextField label='Verification Code'>
                            <Input disabled={this.state.loading}
                                value={this.state.verificationCode}
                                onChange={(e) => this.setState({verificationCode: e.target.value})}/>
                        </TextField>
                        <TextField label='New Password'>
                            <Input disabled={this.state.loading}
                                value={this.state.password} type="password"
                                onChange={(e) => this.setState({password: e.target.value})}/>
                        </TextField>
                        <TextField label='Confirm New Password'>
                            <Input disabled={this.state.loading}
                                value={this.state.passwordCheck} type="password"
                                onChange={(e) => this.setState({passwordCheck: e.target.value})}/>
                        </TextField>
                        <p>{this.state.message}</p>
                    </DialogContent>
                        {loading}
                    <DialogFooter>
                        <DialogButton isDefault disabled={this.state.loading}
                            onClick={this.recoverPassword.bind(this)}>Submit</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.DONE:
                content = (<div>
                    <DialogContent>
                        <p>Done! You can now use your new password.</p>
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton isDefault onClick={()=>this.onClose()}>Ok</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
        }
        return(
            <Dialog open={this.state.isOpen} onClose={()=>this.onClose()}>
            <DialogTitle>Password recovery</DialogTitle>
                {content}
            </Dialog>
        )
    }
}