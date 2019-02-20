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

export default class SetEncryptionKeyDialog extends Component{
    constructor(props) {
        super(props);
        this.state = {
            key: "",
            keyCheck: "",
            loading: false,
            message: ""
        };
    }
    
    render(){
        const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
        return(
            <Dialog open={this.props.isOpen}
                onClose={this.props.onClose}>
            <DialogTitle>Configure your encryption key</DialogTitle>
            <DialogContent>
                <p>Encryption key will be used to encrypt your account OTP data.</p>
                <TextField label='Encryption Key'>
                    <Input disabled={this.state.loading}
                        value={this.state.key}
                        onChange={(e) => this.setState({key: e.target.value})}/>
                </TextField>
                <TextField label='Encryption Key Check'>
                    <Input disabled={this.state.loading}
                        value={this.state.keyCheck}
                        onChange={(e) => this.setState({keyCheck: e.target.value})}/>
                </TextField>
               
                <p>{this.state.message}</p>
            </DialogContent>
                {loading}
            <DialogFooter>
                <DialogButton action='dismiss'>Cancel</DialogButton>
                <DialogButton isDefault action='confirm' onClick={async ()=>{
                        this.setState({loading: true})
                        const res = await Api.setEncryptionKey(this.state.key, this.state.keyCheck);
                        const result = await res.json();
                        if(res.ok){
                            this.setState({loading: false});
                            this.props.afterSubmit();
                        }else{
                            this.setState({loading: false, mseeage: result.message});
                        }
                    }}>Submit</DialogButton>
            </DialogFooter>
      </Dialog>
        )
    }
}