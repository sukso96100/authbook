import React, {Component} from 'react';
import {Router, Route, NavLink} from 'react-router-dom';
import history from './history';
import logo from './logo.svg';
import './App.css';
import './themeing.scss';


import TopAppBar, {TopAppBarFixedAdjust, TopAppBarIcon,
  TopAppBarTitle, TopAppBarRow, TopAppBarSection} from '@material/react-top-app-bar';
import Drawer, {DrawerAppContent, DrawerContent, DrawerHeader, DrawerTitle, DrawerSubtitle} from '@material/react-drawer';
import MaterialIcon from '@material/react-material-icon';
import List, {ListItem, ListItemGraphic, ListItemText} from '@material/react-list';
import Api from './data/Api';
import Home from './Home';
import Settings from './Settings';
import {AuthbookContext} from './data/AuthbookContext';
import {withTranslation} from 'react-i18next';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      isOpened: false,
      serverUrl: '',
    };
  }

  async componentDidMount() {
    if (!localStorage.getItem('session')) {
      history.push('/login');
    } else {
      Api.setUrl(localStorage.getItem('serverUrl'));
      this.setState({
        serverUrl: Api.url,
      });
    }
  }

  render() {
    const userinfo = this.context;
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
                history.push('/app/home');
                this.setState({selectedIndex: 0, isOpened: false});
              }}>
                <ListItemGraphic graphic={<MaterialIcon icon='account_circle'/>} />
                <ListItemText primaryText={this.props.t('menu.accounts')} />
              </ListItem>
              <ListItem onClick={()=>{
                history.push('/app/settings');
                this.setState({selectedIndex: 1, isOpened: false});
              }}>
                <ListItemGraphic graphic={<MaterialIcon icon='settings'/>} />
                <ListItemText primaryText={this.props.t('menu.settings')} />
              </ListItem>
              <ListItem>
                <ListItemGraphic graphic={<MaterialIcon icon='info'/>} />
                <ListItemText primaryText={this.props.t('menu.about')} />
              </ListItem>
              <ListItem onClick={async ()=>{
                await Api.logout();
                this.setState({selectedIndex: 4, isOpened: false});
                localStorage.clear();
                // this.props.resetStates();
                history.push('/login');
              }}>
                <ListItemGraphic graphic={<MaterialIcon icon='lock'/>} />
                <ListItemText primaryText={this.props.t('menu.logout')} />
              </ListItem>

            </List>
          </DrawerContent>
        </Drawer>

        <DrawerAppContent className='drawer-app-content'>
          <TopAppBar>
            <TopAppBarRow>
              <TopAppBarSection align='start'>
                <TopAppBarIcon navIcon tabIndex={0}>
                  <MaterialIcon hasRipple icon='menu' onClick={() => this.setState({isOpened: !this.state.isOpened})}/>
                </TopAppBarIcon>
                <TopAppBarTitle>Authbook</TopAppBarTitle>
              </TopAppBarSection>
            </TopAppBarRow>
          </TopAppBar>
          <TopAppBarFixedAdjust>
            <Route exact path="/app/home" component={Home} />
            <Route exact path="/app/settings" component={Settings} />
          </TopAppBarFixedAdjust>
        </DrawerAppContent>
      </div>
    );
  }
}

export default withTranslation()(App);
