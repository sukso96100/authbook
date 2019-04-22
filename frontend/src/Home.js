import React, { Component } from 'react';
import { Router, Route, NavLink } from "react-router-dom";
import history from './history';
import logo from './logo.svg';
import './App.css';
import './themeing.scss';
import 'react-toastify/dist/ReactToastify.css';


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
import DetailsDialog from './dialogs/DetailsDialog';
import {AuthbookContext} from './data/AuthbookContext';

export default class Home extends Component {
    static contextType = AuthbookContext;
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
            accounts: [],
            isSetKeyDialogVisible: false,
            encryptionKeyInput: "",
            loading: false,
            ticker: true,
            userinfo: this.context
        };
        this.emailVerify = React.createRef();
        this.addAccount = React.createRef();
        this.editAccount = React.createRef();
        this.details = React.createRef();
        this.authenticator = authenticator;
    }
    
    async componentDidMount(){
        console.log("mount");
        const result = await Api.fetchUserInfo();
        if(result.ok){
            const userdata = await result.json();
            this.context.setUserinfo({ displayName: userdata.displayName,
                             username: userdata.username,
                             email: userdata.email, 
                             encryptionKeySet: userdata.isSeedKeySet,
                             isEmailVerified: userdata.isEmailVerified });
        }
        if(!this.context.userinfo.encryptionKeySet){
            this.setState({isSetKeyDialogVisible: true});
        }else if(!this.context.userinfo.isEmailVerified){
            this.emailVerify.current.openForm(
                this.emailVerify.current.step.VERIFY);
        }else if(this.state.encryptionKey){
            this.loadAccounts();
        }else if(this.context.encryptionKey){
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
                item.otpKey = await Crypto.decrypt(this.context.encryptionKey, item.encryptedSeed);
                item.otp = this.authenticator.generate(item.otpKey);
                
                const timeUsed = this.authenticator.timeUsed();
                const timeLeft = this.authenticator.timeRemaining();
                item.timeLeft = timeLeft / (timeUsed + timeLeft);
            }
            this.context.setAccounts(accounts);
            this.setState({loading: false});
        }
        
        this.setupTimer();
    }
    
    setupTimer(){
        this.otpTimer = setInterval(()=>{
            let tmp = this.context.accounts;
            for(let item of tmp){
                item.otp = this.authenticator.generate(item.otpKey);
                const timeUsed = this.authenticator.timeUsed();
                const timeLeft = this.authenticator.timeRemaining();
                item.timeLeft = timeLeft / (timeUsed + timeLeft);
            }
            this.context.setAccounts(tmp);
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
                        this.context.setEncryptionKey(this.state.encryptionKeyInput);
                        await this.loadAccounts();
                    }}>Decrypt</Button><br/>
             </div>
         );
         
         const accounts = (
             <div>
          <Grid>
            <Row id="otpCardsGrid">
                <AuthbookContext.Consumer>
                    {({accounts}) => 
                        accounts.map((item, i)=>{
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
                                    <IconButton onClick={()=>{
                                        this.details.current.openForm(item);
                                    }}>
                                        <MaterialIcon icon='info'/>
                                    </IconButton>
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
                })
                    }
                </AuthbookContext.Consumer>
            </Row>
          </Grid> 
        <Fab id="addbtn" icon={<MaterialIcon icon="add"/>} textLabel="Add Account"
            disabled={this.state.loading} onClick={()=>this.addAccount.current.openForm()}/>
                 </div>
         );
         
         const content = this.context.encryptionKey != "" ? accounts : decryptPrompt;
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
                <DetailsDialog ref={this.details}/>
              <ToastContainer />
          </div>
    );
  }
}

