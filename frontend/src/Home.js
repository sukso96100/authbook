import React, { Component } from 'react';
import { Router, Route, NavLink } from "react-router-dom";
import history from './history';
import logo from './logo.svg';
import './App.css';
import '@material/react-material-icon/dist/material-icon.css';
import '@material/react-text-field/dist/text-field.css';
import '@material/react-icon-button/dist/icon-button.css';
import '@material/react-card/dist/card.css';
import '@material/react-layout-grid/dist/layout-grid.css';
import '@material/react-linear-progress/dist/linear-progress.css';
import '@material/react-fab/dist/fab.css';
import 'react-toastify/dist/ReactToastify.css';
import '@material/react-button/dist/button.css';

import MaterialIcon from '@material/react-material-icon';
import TextField, {HelperText, Input} from '@material/react-text-field';
import IconButton from '@material/react-icon-button';
import Card, {
  CardPrimaryContent,
  CardMedia,
  CardActions,
  CardActionButtons,
  CardActionIcons
} from "@material/react-card";
import {Cell, Grid, Row} from '@material/react-layout-grid';
import LinearProgress from '@material/react-linear-progress';
import {Fab} from '@material/react-fab';
import Api from './data/Api';
import AddAccountDialog from './dialogs/AddAccountDialog';
import SetEncryptionKeyDialog from './dialogs/SetEncryptionKeyDialog';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';
import Crypto from './data/Crypto';
import Button from '@material/react-button';
import {authenticator} from 'otplib/otplib-browser';
import EditAccountDialog from './dialogs/EditAccountDialog';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import EmailVerifyDialog from './dialogs/EmailVerifyDialog';

import { setUserinfo, refreshAccounts, enterEncryptionKey } from './data/Actions';
import { connect } from "react-redux";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
            accounts: [],
            isSetKeyDialogVisible: false,
            encryptionKeyInput: "",
            loading: false,
            ticker: true
        };
        this.emailVerify = React.createRef();
        this.addAccount = React.createRef();
        this.editAccount = React.createRef();
        this.authenticator = authenticator;

    }
    
    async componentDidMount(){
        console.log("mount");
        const result = await Api.fetchUserInfo();
        if(result.ok){
            const userdata = await result.json();
            this.props.setUserinfo(userdata.displayName, userdata.username, userdata.email,
                                  userdata.isSeedKeySet, userdata.isEmailVerified);
        }
        if(!this.props.userinfo.encryptionKeySet){
            this.setState({isSetKeyDialogVisible: true});
        }else if(!this.props.userinfo.isEmailVerified){
            this.emailVerify.current.openForm(
                this.emailVerify.current.step.VERIFY);
        }else if(this.state.encryptionKey){
            this.loadAccounts();
        }else if(this.props.encryptionKey){
            this.setupTimer();
        }
    }
    
    componentWillUnmount(){
        clearInterval(this.otpTimer);
    }
    
    notify(msg){
        toast(msg, {
          className: css({
            background: '#333',
            "border-radius": "8px"
          }),
          progressClassName: css({
            background: "white"
          })
        });
    }
    
    async loadAccounts(){
        console.log("loading./..");
        if(this.otpTimer){
            clearInterval(this.otpTimer);
        }
        this.setState({loading: true});
        let res = await Api.getAccounts();
        if(res.ok){
            let accounts = await res.json();
            for(let item of accounts){
                item.otpKey = await Crypto.decrypt(this.props.encryptionKey, item.encryptedSeed);
                item.otp = this.authenticator.generate(item.otpKey);
                
                const timeUsed = this.authenticator.timeUsed();
                const timeLeft = this.authenticator.timeRemaining();
                item.timeLeft = timeLeft / (timeUsed + timeLeft);
            }
            this.props.refreshAccounts(accounts);
            this.setState({loading: false});
        }
        
        this.setupTimer();
    }
    
    setupTimer(){
        this.otpTimer = setInterval(()=>{
            let tmp = this.props.accounts;
            for(let item of tmp){
                item.otp = this.authenticator.generate(item.otpKey);
                const timeUsed = this.authenticator.timeUsed();
                const timeLeft = this.authenticator.timeRemaining();
                item.timeLeft = timeLeft / (timeUsed + timeLeft);
            }
            this.props.refreshAccounts(tmp);
            this.setState({ticker: !this.state.ticker});
        }, 1000);
    }
    
    render() {
        const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
        const decryptPrompt = (
            <div class="decryptPrompt">
                <p>Type your encryption key to decrypt your accounts.</p>
                <TextField label='Encryption Key'>
                    <Input disabled={this.state.loading}
                        type="password"
                        value={this.state.encryptionKeyInput}
                        onChange={(e) => this.setState({encryptionKeyInput: e.target.value})}/>
                </TextField><br/><br/>
                 <Button raised="true" onClick={async ()=>{
                        this.props.enterEncryptionKey(this.state.encryptionKeyInput);
                        await this.loadAccounts();
                    }}>Decrypt</Button><br/>
             </div>
         );
         
         const accounts = (
             <div>
          <Grid>
            <Row id="otpCardsGrid">
                {this.props.accounts.map((item, i)=>{
                    return(
                        <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4} key={`${i}_${item.id}`}>
                            <Card>
                                  <CardPrimaryContent>
                                      <div class="seedInfoItem">
                                          <span class="otpcode">{item.otp}</span><br/>
                                          <span>{item.seedName} - {item.url}</span><br/>
                                          <span>{item.accountUserName}</span>
                                      </div>
                                  </CardPrimaryContent>
                                    <LinearProgress
                                        progress={item.timeLeft} bufferingDots={false}/>
                                  <CardActions>
                                    <CardActionIcons>
                                        <CopyToClipboard text={item.otp}
                                            onCopy={() => this.notify("Copied!")}>
                                            <IconButton>
                                                <MaterialIcon icon='file_copy'/></IconButton>
                                        </CopyToClipboard>
                                        <CopyToClipboard text={item.otp}
                                            onCopy={() => {
                                                this.notify("Copied!");
                                                window.open(item.url, "_blank");
                                            }}>
                                            <IconButton>
                                                <MaterialIcon icon='exit_to_app'/></IconButton>
                                        </CopyToClipboard>
                                        
                                        <IconButton onClick={()=>{
                                                this.editAccount.current.openForm(i, item);
                                            }}>
                                            <MaterialIcon icon='edit'/>
                                        </IconButton>
                                    </CardActionIcons>
                                  </CardActions>
                              </Card>
                        </Cell>
                    )
                })}
            </Row>
          </Grid> 
        <Fab id="addbtn" icon={<MaterialIcon icon="add"/>} textLabel="Add Account"
            disabled={this.state.loading} onClick={()=>this.addAccount.current.openForm()}/>
                 </div>
         );
         
         const content = this.props.encryptionKey != "" ? accounts : decryptPrompt;
        return (
            <div>
                {loading}
                {content}
              <AddAccountDialog ref={this.addAccount}
                  afterSubmit={()=> this.notify("New account has been added.")}/>
              <SetEncryptionKeyDialog isOpen={this.state.isSetKeyDialogVisible}
                  onClose={(action)=>this.setState({isSetKeyDialogVisible: false})}
                  afterSubmit={()=>{
                        this.setState({isSetKeyDialogVisible: false});
                        this.notify("Encryption key has been configured.");
                        if(!JSON.parse(localStorage.getItem("isEmailVerified"))){
                            this.emailVerify.current.openForm(
                                this.emailVerify.current.step.VERIFY);
                        }
                  }}/>
              <EditAccountDialog ref={this.editAccount}
                  afterSubmit={(result, item)=>{
                      switch(result){
                          case 0:
                              this.notify("Account updated.");
                              break;
                          case 1: 
                              this.notify("Account deleted."); 
                              break;
                      }
                  }}/>
                <EmailVerifyDialog ref={this.emailVerify}/>
              <ToastContainer />
          </div>
    );
  }
}

function mapStateToProps(state){
    return({
        userinfo: state.userinfo,
        accounts: state.accounts,
        encryptionKey: state.encryptionKey
    });
}

export default connect(mapStateToProps, {setUserinfo, refreshAccounts, enterEncryptionKey})(Home)