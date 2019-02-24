import React, { Component } from 'react';
import { Router, Route, NavLink } from "react-router-dom";
import history from './history';
import logo from './logo.svg';
import './App.css';
import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-material-icon/dist/material-icon.css';
import "@material/react-drawer/dist/drawer.css";
import '@material/react-list/dist/list.css';
import '@material/react-text-field/dist/text-field.css';
import '@material/react-icon-button/dist/icon-button.css';
import '@material/react-card/dist/card.css';
import '@material/react-layout-grid/dist/layout-grid.css';
import '@material/react-linear-progress/dist/linear-progress.css';
import '@material/react-fab/dist/fab.css';
import 'react-toastify/dist/ReactToastify.css';
import '@material/react-button/dist/button.css';

import TopAppBar, {TopAppBarFixedAdjust} from '@material/react-top-app-bar';
import Drawer, {DrawerAppContent, DrawerContent, DrawerHeader, DrawerTitle, DrawerSubtitle} from '@material/react-drawer';
import MaterialIcon from '@material/react-material-icon';
import List, {ListItem, ListItemGraphic, ListItemText} from '@material/react-list';
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


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            isOpened: false,
            userdata: {
                username:"",
                displayName: ""
            },
            serverUrl: "",
            accounts: [],
            isAddDialogVisible: false,
            isSetKeyDialogVisible: false,
            encryptionKey: "",
            loading: false,
            keySubmited: false,
            isEditDialogVisible: false,
            editDialogInitData: {}
        };
    }
    
    async componentDidMount(){
        if(!localStorage.getItem("session")){
            history.push("/login");
        }else{
            Api.setUrl(localStorage.getItem("serverUrl"));
            this.setState({
                userdata: {
                    username: localStorage.getItem("username"),
                    displayName: localStorage.getItem("displayName")
                },
                serverUrl: Api.url
            });
           
            if(!localStorage.getItem("encryptionKeySet")){
                this.setState({isSetKeyDialogVisible: true});
            }else if(this.state.encryptionKey){
                this.loadAccounts();
            }
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
                item.otp = otplib.totp.generate(raw);
            }
            this.setState({accounts: accounts, loading: false, keySubmited: true});
            console.log(this.state);
        }
        this.otpTimer = setInterval(()=>{
            let tmp = this.state.accounts;
            for(let item of tmp){
                item.otp = otplib.totp.generate(item.otpKey);
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
                                        buffer={0.9} progress={0.8}
                                        reversed={true}/>
                                  <CardActions>
                                    <CardActionIcons>
                                        <IconButton><MaterialIcon icon='file_copy'/></IconButton>
                                        <IconButton><MaterialIcon icon='exit_to_app'/></IconButton>
                                        <IconButton onClick={()=>{
                                                console.log(this.state.accounts[i]);
                                                this.setState({
                                                    isEditDialogVisible: true, 
                                                    editDialogInitData: this.state.accounts[i]
                                                });
                                            }}><MaterialIcon icon='edit'/></IconButton>
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
     <div className='drawer-container'>
        <Drawer modal
            open={this.state.isOpened}
            onClose={() => this.setState({isOpened: false})}>
          <DrawerHeader>
              <DrawerTitle tag='h2'>
                {this.state.userdata.displayName}
              </DrawerTitle>
              <DrawerSubtitle>
                {this.state.userdata.username}<br/>{this.state.serverUrl}
              </DrawerSubtitle>
          </DrawerHeader>

          <DrawerContent>
            <List singleSelection selectedIndex={this.state.selectedIndex}>
              <ListItem>
                <ListItemGraphic graphic={<MaterialIcon icon='account_circle'/>} />
                <ListItemText primaryText='Accounts' />
              </ListItem>
                <ListItem>
                <ListItemGraphic graphic={<MaterialIcon icon='settings'/>} />
                <ListItemText primaryText='Settings' />
              </ListItem>
            <ListItem>
                <ListItemGraphic graphic={<MaterialIcon icon='info'/>} />
                <ListItemText primaryText='About' />
                  </ListItem>
                <NavLink to="/login"> <ListItem>
                <ListItemGraphic graphic={<MaterialIcon icon='lock'/>} />
                <ListItemText primaryText='Logout' />
                  </ListItem></NavLink>
            
            </List>
          </DrawerContent>
        </Drawer>

        <DrawerAppContent className='drawer-app-content'>
             <TopAppBar
        title='Authbook'
        navigationIcon={<MaterialIcon
          icon='menu'
          onClick={() => this.setState({isOpened: !this.state.isOpened})}
        />}
      />
      <TopAppBarFixedAdjust>
          {loading}
          {content}
          <AddAccountDialog isOpen={this.state.isAddDialogVisible}
              onClose={(action)=>this.setState({isAddDialogVisible: false})}
              afterSubmit={()=>{
                  this.setState({isAddDialogVisible: false});
                  this.notify("New account has been added.");
              }}/>
          <SetEncryptionKeyDialog isOpen={this.state.isSetKeyDialogVisible}
              onClose={(action)=>this.setState({isSetKeyDialogVisible: false})}
              afterSubmit={()=>{
                  this.setState({isSetKeyDialogVisible: false});
                  this.notify("Encryption key has been configured.");
              }}/>
          <EditAccountDialog isOpen={this.state.isEditDialogVisible}
              initData={this.state.editDialogInitData}
              onClose={(action)=>this.setState({isEditDialogVisible: false})}
              afterSubmit={(result)=>{
                  this.setState({isEditDialogVisible: false});
                  switch(result){
                          case 0: this.notify("Account updated."); break;
                          case 1: this.notify("Account deleted."); break;
                  }
              }}/>
          <ToastContainer />
      </TopAppBarFixedAdjust>
        </DrawerAppContent>
      </div>
    );
  }
}