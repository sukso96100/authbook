import React, { Component } from 'react';
import { Router, Route, Link } from "react-router-dom";
import history from '../history';
import Api from '../data/Api';
import './Login.scss';
import '../themeing.scss';
import logo from '../logo.svg';
import TextField, {HelperText, Input} from '@material/react-text-field';
import Button from '@material/react-button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog';
import {Chip} from '@material/react-chips';
import LinearProgress from '@material/react-linear-progress';
import Card, {
  CardPrimaryContent,
  CardMedia,
  CardActions,
  CardActionButtons,
  CardActionIcons
} from "@material/react-card";
import SignupDialog from '../dialogs/SignupDialog';
import PasswordRecoverDialog from '../dialogs/PasswordRecoverDialog';
import {AuthbookContext} from '../data/AuthbookContext';
import { withTranslation } from 'react-i18next';

class Login extends Component {
    static contextType = AuthbookContext;
    constructor(props) {
        super(props);
        this.state = {
            username: "", password: "", url: "https://authbook.herokuapp.com",
            isOpen: false, message: "", loading: false,
            userinfo: this.context
        };
        Api.setUrl(this.state.url);
        this.signup = React.createRef();
        this.pwRecover = React.createRef();
    }
    
    async login(){
        this.setState({loading: true});
        Api.setUrl(this.state.url);
        let res = await Api.login(this.state.username, this.state.password);
        if(res.ok){
            let userdata = await res.json();
            localStorage.setItem("serverUrl", Api.url);
            localStorage.setItem("session", res.headers.get("SESSION"));
            this.setState({loading: false});
            this.context.setUserinfo({ displayName: userdata.displayName,
                             username: userdata.username,
                             email: userdata.email, 
                             encryptionKeySet: userdata.isSeedKeySet,
                             isEmailVerified: userdata.isEmailVerified });
            history.push("/");
        }else{
            let result = await res.json();
            this.setState({message: result.message, loading: false});
        }
    }
    
  render() {
      const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
      return (
    <div class="Login">
              <Card>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Authbook</h1><br/>
              
                  <Chip id="urlChip" label={this.state.url} onClick={()=>{this.setState({isOpen: true})}}/><br/>
        <TextField 
            class="loginForm"
            label={this.props.t("common.username")}>
            <Input disabled={this.state.loading}
                value={this.state.username}
                onChange={(e) => this.setState({username: e.target.value})}/>
        </TextField><br/>
        <TextField 
            class="loginForm"
            label={this.props.t("common.password")}>
            <Input disabled={this.state.loading}
                type="password"
                value={this.state.password}
                onChange={(e) => this.setState({password: e.target.value})}/>
        </TextField><br/>
              <p>{this.state.message}</p>
              {loading}
        <Button raised="true" onClick={this.login.bind(this)}>{this.props.t("login.login")}</Button><br/>
        <Button onClick={()=>this.signup.current.openForm(this.state.url)}>{this.props.t("login.signup")}</Button>
        <Button onClick={()=>this.pwRecover.current.openForm(this.state.url)}>{this.props.t("login.forgot")}</Button>
              </Card>
                <Dialog open={this.state.isOpen}>
            <DialogTitle>{this.props.t("login.server_config")}</DialogTitle>
            <DialogContent>
            <p>{this.props.t("login.server_config_desc")}</p>
              <TextField textarea
                  label={this.props.t("common.serverurl")}>
                <Input
                    value={this.state.url}
                    onChange={(e) => this.setState({url: e.target.value})}/>
            </TextField>
            </DialogContent>
            <DialogFooter>
              <DialogButton isDefault onClick={()=>{
                        Api.setUrl(this.state.url);
                        this.setState({isOpen: false})
                    }}>{this.props.t("common.configure")}</DialogButton>
            </DialogFooter>
      </Dialog>
        <SignupDialog ref={this.signup}/>
        <PasswordRecoverDialog ref={this.pwRecover}/>
    </div>       
      );
  }
}

export default withTranslation()(Login);