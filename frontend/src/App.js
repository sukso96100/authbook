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
import Settings from './Settings';
import { connect } from "react-redux";

class App extends Component {
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
        return (
         <div className='drawer-container'>
            <Drawer modal
                open={this.state.isOpened}
                onClose={() => this.setState({isOpened: false})}>
              <DrawerHeader>
                  <DrawerTitle tag='h2'>
                    {this.props.userinfo.displayName}
                  </DrawerTitle>
                  <DrawerSubtitle>
                    {this.props.userinfo.username}<br/>{this.state.serverUrl}
                  </DrawerSubtitle>
              </DrawerHeader>

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
                      <ListItem onClick={()=>{
                              this.setState({selectedIndex: 4, isOpened: false});
                              localStorage.clear();
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

function mapStateToProps(state){
    return({
        userinfo: state.userinfo
    });
}

export default connect(mapStateToProps)(App)