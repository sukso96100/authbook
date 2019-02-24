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

export default class EditAccountDialog extends Component{
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                id: 0,
                name: "",
                url: "",
                username: "",
                seed: "",
                key: "",
                message: ""
            },
            info: "",
            loading: false,
        };
    }
    
    componentDidUpdate(prevProps) {
      if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen) {
        this.setState({formData: this.props.initData});
      }
    }
    
    
    render(){
        const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
        return(
            <Dialog open={this.props.isOpen}
                onClose={this.props.onClose}>
            <DialogTitle>Edit account</DialogTitle>
            <DialogContent>
                <TextField label='Website/Service Name'>
                    <Input disabled={this.state.loading}
                        value={this.state.formData.name}
                        onChange={(e) => this.setState((prevState) => ({
                            formData:{...prevState.formData, name: e.target.value}}))}/>
                </TextField>
                <TextField label='URL'>
                    <Input disabled={this.state.loading}
                        value={this.state.formData.url}
                        onChange={(e) => this.setState((prevState) => ({
                            formData:{...prevState.formData, url: e.target.value}}))}/>
                </TextField>
                <TextField label='Username'>
                    <Input disabled={this.state.loading}
                        value={this.state.formData.username}
                        onChange={(e) => this.setState((prevState) => ({
                            formData:{...prevState.formData, username: e.target.value}}))}/>
                </TextField>
                <TextField label='Information' textarea>
                    <Input disabled={this.state.loading}
                        value={this.state.formData.info}
                        onChange={(e) => this.setState((prevState) => ({
                            formData:{...prevState.formData, info: e.target.value}}))}/>
                </TextField>
                <TextField label='OTP Key'
                    helperText={<HelperText>Leave this field empty to not update otp key.</HelperText>}>
                    <Input disabled={this.state.loading}
                        value={this.state.formData.seed}
                        onChange={(e) => this.setState((prevState) => ({
                            formData:{...prevState.formData, seed: e.target.value}}))}/>
                </TextField>
                <TextField label='Encryption Key'>
                    <Input disabled={this.state.loading}
                        type="password"
                        value={this.state.formData.key}
                        onChange={(e) => this.setState((prevState) => ({
                            formData:{...prevState.formData, key: e.target.value}}))}/>
                </TextField>
                <p>{this.state.message}</p>
            </DialogContent>
                {loading}
            <DialogFooter>
                <DialogButton isDefault onClick={async ()=>{
                        this.setState({loading: true})
                        const res = await Api.deleteAccount(this.state.id);
                        const result = await res.json();
                        if(res.ok){
                            this.setState({loading: false});
                            this.props.afterSubmit(1);
                        }else{
                            this.setState({loading: false, message: result.message});
                        }
                    }}>Delete</DialogButton>
                <DialogButton isDefault onClick={async ()=>{
                        this.setState({loading: true})
                        const res = await Api.updateAccount(
                                        this.state.id,
                                        this.state.name,
                                        this.state.url,
                                        this.state.username,
                                        this.state.info,
                                        this.state.seed,
                                        this.state.key);
                        const result = await res.json();
                        if(res.ok){
                            this.setState({loading: false});
                            this.props.afterSubmit(0);
                        }else{
                            this.setState({loading: false, message: result.message});
                        }
                    }}>Submit</DialogButton>
            </DialogFooter>
      </Dialog>
        )
    }
}