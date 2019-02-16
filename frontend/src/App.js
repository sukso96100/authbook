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
import "@material/react-chips/dist/chips.css";
import '@material/react-fab/dist/fab.css';

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
import {Chip} from '@material/react-chips';
import {Fab} from '@material/react-fab';
import Api from './data/Api';

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
            serverUrl: ""
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
            let res = await Api.getAccounts();
            if(res.ok){
                let accounts = await res.json();
            }
        }
        
    }
  render() {
      const card = (
          <Card>
              <CardPrimaryContent>
                  <div class="seedInfoItem">
                      <span class="otpcode">123 456</span><br/>
                      <span>Facebook - https://facebook.com</span><br/>
                      <span>Youngbin Han</span>
                  </div>
              </CardPrimaryContent>
                <LinearProgress
                    buffer={0.9} progress={0.8}
                    reversed={true}/>
              <CardActions>
                <CardActionIcons>
                    <IconButton><MaterialIcon icon='file_copy'/></IconButton>
                    <IconButton><MaterialIcon icon='exit_to_app'/></IconButton>
                    <IconButton><MaterialIcon icon='edit'/></IconButton>
                </CardActionIcons>
              </CardActions>
          </Card>)
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
          <Grid>
            <Row id="otpCardsGrid">
              <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
              <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
            <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
                <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
              <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
                <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
            </Row>
          </Grid> 
        <Fab id="addbtn" icon={<MaterialIcon icon="add"/>} textLabel="Add Account"/>
      </TopAppBarFixedAdjust>
        </DrawerAppContent>
      </div>
    );
  }
}