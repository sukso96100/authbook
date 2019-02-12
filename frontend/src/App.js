import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-material-icon/dist/material-icon.css';
import "@material/react-drawer/dist/drawer.css";
import '@material/react-list/dist/list.css';
import '@material/react-text-field/dist/text-field.css';
import '@material/react-icon-button/dist/icon-button.css';
import '@material/react-card/dist/card.css';

import TopAppBar, {TopAppBarFixedAdjust} from '@material/react-top-app-bar';
import Drawer, {DrawerAppContent, DrawerContent, DrawerHeader, DrawerTitle} from '@material/react-drawer';
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

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            isOpened: false,
            keyword: ""
        };
    }
  render() {
    return (
     <div className='drawer-container'>
        <Drawer dismissible open={this.state.isOpened}>
          <DrawerHeader>
            <DrawerTitle tag='h2'>
              jane.smith@gmail.com
            </DrawerTitle>
          </DrawerHeader>

          <DrawerContent>
            <List singleSelection selectedIndex={this.state.selectedIndex}>
              <ListItem>
                <ListItemGraphic graphic={<MaterialIcon icon='folder'/>} />
                <ListItemText primaryText='Mail' />
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
        <Card>
           <CardPrimaryContent>
            <h1>OTP CODE</h1>
            <span>Site name / url</span>
              <span>username</span>
          </CardPrimaryContent>

              <CardActions>
                <CardActionButtons>
                  <button>Click Me</button>
                </CardActionButtons>

                <CardActionIcons>
                  <i>Click Me Too!</i>
                </CardActionIcons>
              </CardActions>
          </Card>
      </TopAppBarFixedAdjust>
        </DrawerAppContent>
      </div>
    );
  }
}

