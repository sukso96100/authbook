import React, { Component } from 'react';
import { Router, Route, NavLink } from "react-router-dom";
import history from './history';
import logo from './logo.svg';
import './App.css';
import './themeing.scss';


import TopAppBar, {TopAppBarFixedAdjust} from '@material/react-top-app-bar';
import Drawer, {DrawerAppContent, DrawerContent, DrawerHeader, DrawerTitle, DrawerSubtitle} from '@material/react-drawer';
import MaterialIcon from '@material/react-material-icon';
import List, {ListItem, ListItemGraphic, ListItemText} from '@material/react-list';
import IconButton from '@material/react-icon-button';
import LinearProgress from '@material/react-linear-progress';
import Api from './data/Api';
import Button from '@material/react-button';
import Home from './Home';
import Settings from './Settings';
import {AuthbookContext} from './data/AuthbookContext';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            isOpened: false,
            serverUrl: "",
        };
    }
    
    async componentDidMount(){
        if(!localStorage.getItem("session")){
            history.push("/login");
        }else{
            Api.setUrl(localStorage.getItem("serverUrl"));
            this.setState({
                serverUrl: Api.url
            });
        }
    }
    
    render() {
        let userinfo = this.context;
        return (
         <div className='drawer-container'>
            <Drawer modal
                open={this.state.isOpened}
                onClose={() => this.setState({isOpened: false})}>
              
                  <AuthbookContext.Consumer>
                      {({userinfo}) => (
                          <DrawerHeader>
                              <DrawerTitle tag='h2'>{userinfo.displayName}</DrawerTitle>
                              <DrawerSubtitle>{userinfo.username}<br/>{this.state.serverUrl}</DrawerSubtitle>
                          </DrawerHeader>
                      )}
                  </AuthbookContext.Consumer>
              

              <DrawerContent>
                  <List singleSelection selectedIndex={this.state.selectedIndex}>
                      <ListItem onClick={()=>{
                              history.push("/app/home");
                              this.setState({selectedIndex: 0, isOpened: false});
                          }}>
                          <ListItemGraphic graphic={<MaterialIcon icon='account_circle'/>} />
                          <ListItemText primaryText='Accounts' />
                      </ListItem>
                      <ListItem onClick={()=>{
                              history.push("/app/settings");
                              this.setState({selectedIndex: 1, isOpened: false});
                          }}>
                          <ListItemGraphic graphic={<MaterialIcon icon='settings'/>} />
                          <ListItemText primaryText='Settings' />
                      </ListItem>
                      <ListItem>
                          <ListItemGraphic graphic={<MaterialIcon icon='info'/>} />
                          <ListItemText primaryText='About' />
                      </ListItem>
                      <ListItem onClick={async ()=>{
                              await Api.logout();
                              this.setState({selectedIndex: 4, isOpened: false});
                              localStorage.clear();
                              // this.props.resetStates();
                              history.push("/login");
                          }}>
                          <ListItemGraphic graphic={<MaterialIcon icon='lock'/>} />
                          <ListItemText primaryText='Logout' />
                      </ListItem>

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
              <Route exact path="/app/home" component={Home} />
              <Route exact path="/app/settings" component={Settings} />
          </TopAppBarFixedAdjust>
            </DrawerAppContent>
          </div>
        );
  }
}
