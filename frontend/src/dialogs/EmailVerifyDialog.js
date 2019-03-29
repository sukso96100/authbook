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

export default class EmailVerifyDialog extends Component{
    
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
            isOpen: false,
            step: this.step.INIT,
            email: "",
            verificationCode: "",
            loading: false,
            message: ""
        };
    }
    
    openForm(step=this.step.INIT){
        this.setState({isOpen: true, step: step});
    }

    onClose(){
        this.setState({
            isOpen: false,
            step: this.step.INIT,
            email: "",
            verificationCode: "",
            loading: false,
            message: ""
        });
    }
    
    async changeEmail(){
        this.setState({loading: true});
        try{
            let res = await Api.changeEmail(this.state.email);
            if(res.ok){
                this.setState({loading: false, step: this.step.REQUESTED});
            }else{
                const result = await res.json();
                this.setState({loading: false, message: result.message});
            }
        }catch(error){
            console.log(error);
            this.setState({loading: false, message: error});
        }
    }

    async verifyEmail(){
        this.setState({loading: true});
        try{
            let res = await Api.verifyEmail(this.state.verificationCode);
            if(res.ok){
                this.setState({loading: false, step: this.step.DONE});
            }else{
                const result = await res.json();
                this.setState({loading: false, message: result.message});
            }
        }catch(error){
            console.log(error);
            this.setState({loading: false, message: error});
        }
    }
    
    render(){
        const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
        let content;
        switch(this.state.step){
            case this.step.INIT:
                content = (<div>
                    <DialogContent>
                        <p>Did you received a verification code for verifying your email address?</p>
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton isDefault onClick={()=>this.onClose()}>Cancel</DialogButton>
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
                        <p>Submit the new email address that will replace the current one.</p>
                        <TextField label='New Email Address'>
                            <Input disabled={this.state.loading}
                                value={this.state.email}
                                onChange={(e) => this.setState({email: e.target.value})}/>
                        </TextField>
                        <p>{this.state.message}</p>
                    </DialogContent>
                        {loading}
                    <DialogFooter>
                        <DialogButton isDefault disabled={this.state.loading}
                            onClick={this.changeEmail.bind(this)}>Submit</DialogButton>
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
                        <p>Use the verification code you received to verify your email address.</p>
                        <TextField label='Verification Code'>
                            <Input disabled={this.state.loading}
                                value={this.state.verificationCode}
                                onChange={(e) => this.setState({verificationCode: e.target.value})}/>
                        </TextField>
                        <p>{this.state.message}</p>
                    </DialogContent>
                        {loading}
                    <DialogFooter>
                        <DialogButton isDefault disabled={this.state.loading}
                            onClick={this.verifyEmail.bind(this)}>Submit</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.DONE:
                content = (<div>
                    <DialogContent>
                        <p>Done! Your email is now updated and verified.</p>
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton isDefault onClick={()=>this.onClose()}>Ok</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
        }
        return(
            <Dialog open={this.state.isOpen} scrimClickAction="" escapeKeyAction=""
                onClose={()=>this.onClose()}>
            <DialogTitle>Update/Verify Email</DialogTitle>
                {content}
            </Dialog>
        )
    }
}