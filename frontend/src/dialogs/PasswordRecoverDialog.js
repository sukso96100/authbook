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

class PasswordRecoverDialog extends Component{
    
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
            this.setState({loading: false, message: error});
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
                        <p>{this.props.t("login.recover_init")}</p>
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.REQUEST})
                            }}>{this.props.t("common.no")}</DialogButton>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.VERIFY})
                            }}>{this.props.t("common.yes")}</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.REQUEST:
                content = (<div>
                    <DialogContent>
                        <p>{this.props.t("login.recover_request")}</p>
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
                            onClick={this.requestRecover.bind(this)}>{this.props.t("common.submit")}</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.REQUESTED:
                content = (<div>
                    <DialogContent>
                        <p>{this.props.t("login.recover_requested")}</p>
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.REQUEST})
                            }}>{this.props.t("commom.prev")}</DialogButton>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.VERIFY})
                            }}>{this.props.t("common.next")}</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.VERIFY:
                content = (<div>
                    <DialogContent>
                        <p>{this.props.t("login.recover_verify")}</p>
                        <TextField label={this.props.t("common.serverurl")}>
                            <Input disabled={true}
                                value={this.state.serverUrl}/>
                        </TextField>
                        <TextField label={this.props.t("common.username")}>
                            <Input disabled={this.state.loading}
                                value={this.state.username}
                                onChange={(e) => this.setState({username: e.target.value})}/>
                        </TextField>
                        <TextField label={this.props.t("common.ver_code")}>
                            <Input disabled={this.state.loading}
                                value={this.state.verificationCode}
                                onChange={(e) => this.setState({verificationCode: e.target.value})}/>
                        </TextField>
                        <TextField label={this.props.t("login.new_pw")}>
                            <Input disabled={this.state.loading}
                                value={this.state.password} type="password"
                                onChange={(e) => this.setState({password: e.target.value})}/>
                        </TextField>
                        <TextField label={this.props.t("login.new_pw_chk")}>
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
            <DialogTitle>{this.props.t("login.recover")}</DialogTitle>
                {content}
            </Dialog>
        )
    }
}

export default withTranslation(null,{withRef: true})(PasswordRecoverDialog);