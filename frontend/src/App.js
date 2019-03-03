import React, { Component } from 'react';
import { Router, Route, NavLink } from "react-router-dom";
import history from './history';
import logo from './logo.svg';
import './App.css';
import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-material-icon/dist/material-icon.css';
import "@material/react-drawer/dist/drawer.css";
import '@material/react-list/dist/list.css';
import '@material/react-icon-button/dist/icon-button.css';
import '@material/react-button/dist/button.css';

import TopAppBar, {TopAppBarFixedAdjust} from '@material/react-top-app-bar';
import Drawer, {DrawerAppContent, DrawerContent, DrawerHeader, DrawerTitle, DrawerSubtitle} from '@material/react-drawer';
import MaterialIcon from '@material/react-material-icon';
import List, {ListItem, ListItemGraphic, ListItemText} from '@material/react-list';
import IconButton from '@material/react-icon-button';
import LinearProgress from '@material/react-linear-progress';
import Api from './data/Api';
import Button from '@material/react-button';
import Home from './Home';


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
           
        }
    }
    
    
    render() {
       
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
          <Route exact path="/app" component={Home} />
      </TopAppBarFixedAdjust>
        </DrawerAppContent>
      </div>
    );
  }
}