import React, { Component } from 'react';
import { Router, Route, NavLink } from "react-router-dom";
import '@material/react-text-field/dist/text-field.css';
import "@material/react-dialog/dist/dialog.css";
import '@material/react-linear-progress/dist/linear-progress.css';
import './DialogInputStyle.css';

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
            name: "",
            url: "",
            username: "",
            info: "",
            seed: "",
            key: "",
            loading: false,
            message: "",
            isOpen: false
        };

export default class AddAccountDialog extends Component{
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
        return(
            <Dialog open={this.state.isOpen} onClose={this.onClose.bind(this)}
                 scrimClickAction="" escapeKeyAction="">
            <DialogTitle>Add new account</DialogTitle>
            <DialogContent>
                <TextField label='Website/Service Name'>
                    <Input disabled={this.state.loading}
                        value={this.state.name}
                        onChange={(e) => this.setState({name: e.target.value})}/>
                </TextField>
                <TextField label='URL'>
                    <Input disabled={this.state.loading}
                        value={this.state.url}
                        onChange={(e) => this.setState({url: e.target.value})}/>
                </TextField>
                <TextField label='Username'>
                    <Input disabled={this.state.loading}
                        value={this.state.username}
                        onChange={(e) => this.setState({username: e.target.value})}/>
                </TextField>
                <TextField label='Information' textarea>
                    <Input disabled={this.state.loading}
                        value={this.state.info}
                        onChange={(e) => this.setState({info: e.target.value})}/>
                </TextField>
                <TextField label='OTP Key'>
                    <Input disabled={this.state.loading}
                        value={this.state.seed}
                        onChange={(e) => this.setState({seed: e.target.value})}/>
                </TextField>
                <TextField label='Encryption Key'>
                    <Input disabled={this.state.loading}
                        type="password"
                        value={this.state.key}
                        onChange={(e) => this.setState({key: e.target.value})}/>
                </TextField>
                <p>{this.state.message}</p>
            </DialogContent>
                {loading}
            <DialogFooter>
                <DialogButton onClick={async ()=>this.onClose()}>Cancel</DialogButton>
                <DialogButton isDefault onClick={async ()=>{
                        this.setState({loading: true})
                        const res = await Api.addAccount(
                                        this.state.name,
                                        this.state.url,
                                        this.state.username,
                                        this.state.info,
                                        this.state.seed,
                                        this.state.key)
                        const result = await res.json();
                        if(res.ok){
                            console.log(result);
                            this.context.addAccount({
                                ...result,
                                otpKey: this.state.seed
                            });
                            this.onClose();
                            this.props.afterSubmit();
                        }else{
                            this.setState({loading: false, message: result.message});
                        }
                    }}>Submit</DialogButton>
            </DialogFooter>
      </Dialog>
        )
    }
}


// export default connect(null, {addAccount}, null, {forwardRef: true})(AddAccountDialog);