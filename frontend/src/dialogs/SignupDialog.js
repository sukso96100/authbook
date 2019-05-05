import React, { Component } from 'react';
import { Router, Route, NavLink } from "react-router-dom";
import '../themeing.scss';
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
import { withTranslation } from 'react-i18next';

class SignupDialog extends Component{
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
    
    async signup(){
        this.setState({loading: true});
        try{
            let res = await Api.signup(
            this.state.username,
            this.state.displayName,
            this.state.email,
            this.state.password,
            this.state.passwordCheck);
            if(res.ok){
                this.setState({loading: false, done: true});
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
        const content = this.state.done ? (<div>
                <DialogContent>
                    <h2>Almost done!</h2>
                    <p>We just sent an email that includes email verification code. 
                        To use your account, verify your email with the code on your first login.</p>
                </DialogContent>
                <DialogFooter>
                    <DialogButton isDefault onClick={() => this.setState({isOpen: false, done: false})}>OK</DialogButton>
                </DialogFooter>
            </div>) : 
            (<div>
                <DialogContent>
                    <TextField label={this.props.t("common.serverurl")}>
                        <Input disabled={true}
                            value={this.state.serverUrl}/>
                    </TextField>
                    <TextField label={this.props.t("common.username")}>
                        <Input disabled={this.state.loading}
                            value={this.state.username}
                            onChange={(e) => this.setState({username: e.target.value})}/>
                    </TextField>
                    <TextField label={this.props.t("common.dspname")}>
                        <Input disabled={this.state.loading}
                            value={this.state.displayName}
                            onChange={(e) => this.setState({displayName: e.target.value})}/>
                    </TextField>
                    <TextField label={this.props.t("common.email")}>
                        <Input disabled={this.state.loading}
                            value={this.state.email}
                            onChange={(e) => this.setState({email: e.target.value})}/>
                    </TextField>
                    <TextField label={this.props.t("common.password")}>
                        <Input disabled={this.state.loading}
                            type="password"
                            value={this.state.password}
                            onChange={(e) => this.setState({password: e.target.value})}/>
                    </TextField>
                    <TextField label={this.props.t("common.pwcheck")}>
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
                        onClick={this.signup.bind(this)}>{this.props.t("login.signup")}</DialogButton>
                </DialogFooter>
            </div>)
        return(
            <Dialog open={this.state.isOpen} onClose={()=>this.setState({isOpen: false, done: false})}>
            <DialogTitle>{this.props.t("login.signup")}</DialogTitle>
                {content}
            </Dialog>
        )
    }
}

export default withTranslation(null, {withRef: true})(SignupDialog);