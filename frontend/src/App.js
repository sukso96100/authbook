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
import '@material/react-layout-grid/dist/layout-grid.css';
import '@material/react-linear-progress/dist/linear-progress.css';

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
import {Cell, Grid, Row} from '@material/react-layout-grid';
import LinearProgress from '@material/react-linear-progress';

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
          <Grid>
            <Row>
              <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
              <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
            <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
                <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
              <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
                <Cell desktopColumns={4} phoneColumns={4} tabletColumns={4}>{card}</Cell>
            </Row>
          </Grid>
        
      </TopAppBarFixedAdjust>
        </DrawerAppContent>
      </div>
    );
  }
}

