import React, { Component } from 'react';
import '../themeing.scss';
import './DialogInputStyle.css';
import history from '../history';
import TextField, {HelperText, Input} from '@material/react-text-field';
import LinearProgress from '@material/react-linear-progress';
import Api from '../data/Api';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog';
import {AuthbookContext} from '../data/AuthbookContext';


const initState = {
    password: "",
    encryptionKey: "",
    loading: false,
    message: "",
    isOpen: false,
    success: false
};

export default class CloseAccountDialog extends Component{
    static contextType = AuthbookContext;
    constructor(props) {
        super(props);
        this.state = initState;
    }
    
    openForm(){
        this.setState({
            isOpen: true
        });
    }
    
    onClose(){
        this.setState(initState);
    }
    
    render(){
        const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
        const content = this.state.success ? (
            <div>
                <DialogContent>
                    <p>Your account is now closed and no longer available.</p>
                </DialogContent>
                <DialogFooter>
                    <DialogButton onClick={async ()=>{
                            localStorage.clear();
                            this.context.resetStates();
                            history.push("/login");
                        }}>Ok</DialogButton>
                </DialogFooter>
            </div>
            
        ) : (
            <div>
                <DialogContent>
                    <p>Your account and and all of its data will be deleted. Type your password and encryption key to confirm.</p>
                    <TextField label='Password'>
                        <Input disabled={this.state.loading} type="password"
                            value={this.state.password}
                            onChange={(e) => this.setState({password: e.target.value})}/>
                    </TextField>
                    <TextField label='Encryption Key'>
                        <Input disabled={this.state.loading} type="password"
                            value={this.state.encryptionKey}
                            onChange={(e) => this.setState({encryptionKey: e.target.value})}/>
                    </TextField>
                    <p>{this.state.message}</p>
                </DialogContent>
                {loading}
                <DialogFooter>
                    <DialogButton onClick={async ()=>this.onClose()}>Cancel</DialogButton>
                    <DialogButton isDefault onClick={async ()=>{
                            this.setState({loading: true});
                            const res = await Api.closeAccount(
                                            this.state.password,
                                            this.state.encryptionKey);
                            if(res.ok){
                                this.setState({loading: false, success: true});
                            }else{
                                const result = await res.json();
                                this.setState({loading: false, message: result.message});
                            }
                        }}>Close Account</DialogButton>
                </DialogFooter>
            </div>
        )
        return(
            <Dialog open={this.state.isOpen} onClose={this.onClose.bind(this)}
                 scrimClickAction="" escapeKeyAction="">
            <DialogTitle>Close Account</DialogTitle>
            {content}
          </Dialog>
        );
    }
}
