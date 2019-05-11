import React, { Component } from 'react';
import { Router, Route, NavLink } from 'react-router-dom';
import history from './history';
import './App.css';
import './themeing.scss';

import MaterialIcon from '@material/react-material-icon';
import List, {ListItem, ListItemText, ListGroup, 
    ListGroupSubheader,ListDivider} from '@material/react-list';
import LinearProgress from '@material/react-linear-progress';
import Api from './data/Api';
import Button from '@material/react-button';
import EmailVerifyDialog from './dialogs/EmailVerifyDialog';
import ChangePasswordDialog from './dialogs/ChangePasswordDialog';
import ChangeEncryptionKeyDialog from './dialogs/ChangeEncryptionKeyDialog';
import CloseAccountDialog from './dialogs/CloseAccountDialog';
import {AuthbookContext} from './data/AuthbookContext';
import {withTranslation} from 'react-i18next';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serverUrl: ''
        };
        this.emailVerify = React.createRef();
        this.changePassword = React.createRef();
        this.changeKey = React.createRef();
        this.closeAccount = React.createRef();

        this.listItems = [
            {title: this.props.t('settings.change_email'), desc: this.props.t('settings.change_email_desc'),
                onClick: ()=>{
                    this.emailVerify.current.openForm();
                }},
            {title: this.props.t('settings.change_pw'), desc: this.props.t('settings.change_pw_desc'),
                onClick: ()=>{
                    this.changePassword.current.openForm();
                }},
            {title:this.props.t('settings.change_enckey'), desc: this.props.t('settings.change_enckey_desc'),
                onClick: ()=>{
                    this.changeKey.current.openForm();
                }},
            {title: this.props.t('settings.close_acc'), desc: this.props.t('settings.close_acc_desc'),
                onClick: ()=>{
                    this.closeAccount.current.openForm();
                }}
        ];
    }
    
    async componentDidMount(){
        this.setState({ serverUrl: Api.url});
    }
    

    render() {
        return (
            <div class="listMargin">
                <ListGroup>
                    <ListGroupSubheader tag='h3'><b>{this.props.t('settings.acc_info')}</b></ListGroupSubheader>
                    <List twoLine={true}>
                        <AuthbookContext.Consumer>
                            {({userinfo}) => (
                                <ListItem>
                                    <ListItemText
                                        primaryText={userinfo.displayName}
                                        secondaryText={userinfo.username} />
                                </ListItem>
                            )}
                        </AuthbookContext.Consumer>
                        <ListItem>
                            <ListItemText
                                primaryText="Server URL"
                                secondaryText={this.state.serverUrl} />
                        </ListItem>
                    </List>
                    <ListDivider tag="div" />
                    <ListGroupSubheader tag='h3'><b>{this.props.t('settings.acc_settings')}</b></ListGroupSubheader>
                    <List twoLine={true}>
                        {this.listItems.map((item, i)=>{
                            return(
                                <ListItem onClick={item.onClick.bind(this)}>
                                    <ListItemText 
                                        primaryText={item.title}
                                        secondaryText={item.desc}/>
                                </ListItem>
                            );
                        })}
                    </List>
                </ListGroup>
                <EmailVerifyDialog ref={this.emailVerify}/>
                <ChangePasswordDialog ref={this.changePassword}/>
                <ChangeEncryptionKeyDialog ref={this.changeKey}/>
                <CloseAccountDialog ref={this.closeAccount}/>
            </div>
        );
    }
}

export default withTranslation()(Settings);