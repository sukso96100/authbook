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

export default class AddAccountDialog extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            url: "",
            username: "",
            info: "",
            seed: "",
            key: "",
            loading: false,
            mseeage: ""
        };
    }
    
    componentDidMount(){
     
    }
    
    render(){
        const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
        return(
            <Dialog open={this.props.isOpen}>
            <DialogTitle>Add new account</DialogTitle>
            <DialogContent>
                <TextField label='Website/Service Name'>
                    <Input
                        value={this.state.name}
                        onChange={(e) => this.setState({name: e.target.value})}/>
                </TextField>
                <TextField label='URL'>
                    <Input
                        value={this.state.url}
                        onChange={(e) => this.setState({url: e.target.value})}/>
                </TextField>
                <TextField label='Username'>
                    <Input
                        value={this.state.username}
                        onChange={(e) => this.setState({username: e.target.value})}/>
                </TextField>
                <TextField label='Information' textarea>
                    <Input
                        value={this.state.info}
                        onChange={(e) => this.setState({info: e.target.value})}/>
                </TextField>
                <TextField label='OTP Key'>
                    <Input
                        value={this.state.seed}
                        onChange={(e) => this.setState({seed: e.target.value})}/>
                </TextField>
                <TextField label='Encryption Key'>
                    <Input
                        type="password"
                        value={this.state.key}
                        onChange={(e) => this.setState({key: e.target.value})}/>
                </TextField>
                <span class="mseeage">{this.state.mseeage}</span>
            </DialogContent>
                {loading}
            <DialogFooter>
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
                            this.setState({isOpen: false, loading: false});
                        }else{
                            this.setState({isOpen: false, loading: false, mseeage: result.message});
                        }
                    }}>Submit</DialogButton>
            </DialogFooter>
      </Dialog>
        )
    }
}