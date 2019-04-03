import React, { Component } from 'react';
import { Router, Route, NavLink } from "react-router-dom";
import history from './history';
import logo from './logo.svg';
import './App.css';
import '@material/react-material-icon/dist/material-icon.css';
import '@material/react-linear-progress/dist/linear-progress.css';
import '@material/react-button/dist/button.css';
import '@material/react-list/dist/list.css';

import MaterialIcon from '@material/react-material-icon';
import List, {ListItem, ListItemText, ListGroup, 
  ListGroupSubheader,ListDivider} from '@material/react-list';
import LinearProgress from '@material/react-linear-progress';
import Api from './data/Api';
import Button from '@material/react-button';
import EmailVerifyDialog from './dialogs/EmailVerifyDialog';
import ChangePasswordDialog from './dialogs/ChangePasswordDialog';
import { connect } from "react-redux";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
                serverUrl: ""
        };
        this.emailVerify = React.createRef();
        this.changePassword = React.createRef();
    }
    
    async componentDidMount(){
            this.setState({
                serverUrl: Api.url
            });
    }
    
    listItems = [
        {title: "Change Email Address", desc:"Click to change your email address",
         onClick: ()=>{
            this.emailVerify.current.openForm();
        }},
        {title: "Change Password", desc:"Change the password of your account",
        onClick: ()=>{
            this.changePassword.current.openForm();
        }}
    ]
    
    
    render() {
    return (
        <div class="listMargin">
            <ListGroup>
                <ListGroupSubheader tag='h3'><b>Account Information</b></ListGroupSubheader>
                <List twoLine={true}>
                    <ListItem>
                        <ListItemText
                            primaryText={this.props.userinfo.displayName}
                            secondaryText={this.props.userinfo.username} />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primaryText="Server URL"
                            secondaryText={this.state.serverUrl} />
                    </ListItem>
                </List>
                <ListDivider tag="div" />
                <ListGroupSubheader tag='h3'><b>Account Settings</b></ListGroupSubheader>
                <List twoLine={true}>
                    {this.listItems.map((item, i)=>{
                        return(
                            <ListItem onClick={item.onClick.bind(this)}>
                                <ListItemText 
                                    primaryText={item.title}
                                    secondaryText={item.desc}/>
                            </ListItem>
                        )
                    })}
                </List>
            </ListGroup>
            <EmailVerifyDialog ref={this.emailVerify}/>
            <ChangePasswordDialog ref={this.changePassword}/>
      </div>
    );
  }
}

function mapStateToProps(state){
    return({
        userinfo: state.userinfo
    });
}

export default connect(mapStateToProps)(Settings)