import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Router, Route, Link, Redirect } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import App from './App';
import Login from './auth/Login';
import history from './history';
import {AuthbookContext, ContextDefaults} from './data/AuthbookContext';


export class Root extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            ...ContextDefaults,
            setUserinfo: this.setUserinfo.bind(this),
            setEncryptionKey: this.setEncryptionKey.bind(this),
            setAccounts: this.setAccounts.bind(this),
            addAccount: this.addAccount.bind(this),
            updateAccount: this.updateAccount.bind(this),
            deleteAccount: this.deleteAccount.bind(this)
        };
    }
    
    setUserinfo(data){ this.setState({userinfo: data});}

    setEncryptionKey(data){ this.setState({encryptionKey: data});}

    setAccounts(data){ this.setState({accounts: data});}
    
    addAccount(data){ this.setState({accounts: [...this.state.accounts, data]});}

    updateAccount(index, data){ 
        let tmp = this.state.accounts;
        tmp[index] = {
            ...tmp[index],
            seedName: data.seedName,
            url: data.url,
            accountUserName: data.accountUserName,
            seedInfo: data.seedInfo
        };
        if(data.otpKey) tmp[index].otpKey = data.otpKey;
        this.setState({accounts: tmp}); }

    deleteAccount(index){ 
        let tmpArr = this.state.accounts;
        tmpArr.splice(index, 1);
        this.setState({accounts: tmpArr});
    }
    
    
    render(){
        return(
            <AuthbookContext.Provider value={this.state}>
                  <Router history={history}>
                      <div>
                            <Route exact path="/" render={() => (
                                <Redirect to="/app/home"/>
                            )}/>
                            <Route path="/app" component={App} />
                            <Route exact path="/login" component={Login}/>
                      </div>
                  </Router>
            </AuthbookContext.Provider>
        )
    }
}
ReactDOM.render((
<Root></Root>
), document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
