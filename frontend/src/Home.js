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
import otplib from 'otplib/otplib-browser';
import EditAccountDialog from './dialogs/EditAccountDialog';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import EmailVerifyDialog from './dialogs/EmailVerifyDialog';


export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
            accounts: [],
            isSetKeyDialogVisible: false,
            encryptionKey: "",
            loading: false,
            keySubmited: false,
            isEditDialogVisible: false,
            editDialogInitData: {},
            editIndex: 0
        };
        this.emailVerify = React.createRef();
        this.addAccount = React.createRef();
    }
    
    async componentDidMount(){
        await Api.fetchUserInfo();
        if(!JSON.parse(localStorage.getItem("encryptionKeySet"))){
            this.setState({isSetKeyDialogVisible: true});
        }else if(!JSON.parse(localStorage.getItem("isEmailVerified"))){
            this.emailVerify.current.openForm(
                this.emailVerify.current.step.VERIFY);
        }else if(this.state.encryptionKey){
            this.loadAccounts();
        }
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
        if(this.otpTimer){
            clearInterval(this.otpTimer);
        }
        this.setState({loading: true});
        let res = await Api.getAccounts();
        if(res.ok){
            let accounts = await res.json();
            for(let item of accounts){
                let raw = await Crypto.decrypt(this.state.encryptionKey, item.encryptedSeed);
                item.otpKey = raw;
                console.log(raw, typeof raw);
                item.otp = otplib.authenticator.generate(raw);
                
                const timeUsed = otplib.authenticator.timeUsed();
                const timeLeft = otplib.authenticator.timeRemaining();
                item.timeLeft = timeLeft / (timeUsed + timeLeft);
            }
            this.setState({accounts: accounts, loading: false, keySubmited: true});
            console.log(this.state);
        }
        this.otpTimer = setInterval(()=>{
            let tmp = this.state.accounts;
            for(let item of tmp){
                item.otp = otplib.authenticator.generate(item.otpKey);
                const timeUsed = otplib.authenticator.timeUsed();
                const timeLeft = otplib.authenticator.timeRemaining();
                item.timeLeft = timeLeft / (timeUsed + timeLeft);
            }
            this.setState({accounts: tmp});
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
                        value={this.state.encryptionKey}
                        onChange={(e) => this.setState({encryptionKey: e.target.value})}/>
                </TextField><br/><br/>
                 <Button raised="true" onClick={this.loadAccounts.bind(this)}>Decrypt</Button><br/>
             </div>
         );
         
         const accounts = (
             <div>
          <Grid>
            <Row id="otpCardsGrid">
                {this.state.accounts.map((item, i)=>{
                    return(
                        <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>
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
                                                console.log(this.state.accounts[i]);
                                                this.setState({
                                                    isEditDialogVisible: true, 
                                                    editDialogInitData: this.state.accounts[i],
                                                    editIndex: i
                                                });
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
            onClick={()=>this.setState({isAddDialogVisible: true})}/>
                 </div>
         );
         
         const content = this.state.keySubmited ? accounts : decryptPrompt;
    return (
     <div>
             {loading}
          {content}
          <AddAccountDialog ref={this.addAccount}
              afterSubmit={(newItem)=>{
                  let tmp = this.state.accounts;
                  tmp.push(newItem);
                  this.setState({accounts: tmp});
                  this.notify("New account has been added.");
              }}/>
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
          <EditAccountDialog isOpen={this.state.isEditDialogVisible}
              editIndex={this.state.editIndex}
              initData={this.state.editDialogInitData}
              onClose={(action)=>this.setState({isEditDialogVisible: false})}
              afterSubmit={(result, item)=>{
                  this.setState({isEditDialogVisible: false});
                  switch(result){
                          case 0:
                              let tmp = this.state.accounts;
                              tmp[item.editIndex].seedName = item.seedName;
                              tmp[item.editIndex].url = item.url;
                              tmp[item.editIndex].accountUserName = item.accountUserName;
                              tmp[item.editIndex].seedInfo = item.seedInfo;
                              tmp[item.editIndex].otpkey = item.seed;
                              this.setState({accounts: tmp});
                              this.notify("Account updated.");
                              break;
                          case 1: 
                              this.setState({accounts: this.state.accounts.splice(item.editIndex, 1)});
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