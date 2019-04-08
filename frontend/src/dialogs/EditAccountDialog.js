import React, { Component } from 'react';
import { Router, Route, NavLink } from "react-router-dom";
import '../themeing.scss';
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
    formData: {
        id: 0,
        seedName: "",
        url: "",
        accountUserName: "",
        seed: "",
        key: "",
        seedInfo: ""
    },
    isOpen: false,
    message: "",
    loading: false,
    editIndex: 0
};

export default class EditAccountDialog extends Component{
    static contextType = AuthbookContext;
    constructor(props) {
        super(props);
        this.state = initState;
    }
    
    openForm(index, initData){
        this.setState({
            formData: initData, 
            isOpen: true,
            editIndex: index});
    }
    
    closeForm(){
        this.setState(initState);
    }
    
    render(){
        const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
        return(
            <Dialog open={this.state.isOpen} onClose={this.closeForm.bind(this)}>
            <DialogTitle>Edit account</DialogTitle>
            <DialogContent>
                <TextField label='Website/Service Name'>
                    <Input disabled={this.state.loading} value={this.state.formData.seedName}
                        onChange={(e) => this.setState({
                            formData:{...this.state.formData, seedName: e.target.value}
                        })}/>
                </TextField>
                <TextField label='URL'>
                    <Input disabled={this.state.loading} value={this.state.formData.url}
                        onChange={(e) => this.setState({
                            formData:{...this.state.formData, url: e.target.value}
                        })}/>
                </TextField>
                <TextField label='Username'>
                    <Input disabled={this.state.loading} value={this.state.formData.accountUserName}
                        onChange={(e) => this.setState({
                            formData:{...this.state.formData, accountUserName: e.target.value}
                        })}/>
                </TextField>
                <TextField label='Information' textarea>
                    <Input disabled={this.state.loading} value={this.state.formData.seedInfo}
                        onChange={(e) => this.setState({
                            formData:{...this.state.formData, seedInfo: e.target.value}
                        })}/>
                </TextField>
                <TextField label='OTP Key'
                    helperText={<HelperText>Leave this field empty to not update otp key.</HelperText>}>
                    <Input disabled={this.state.loading} value={this.state.seed}
                        onChange={(e) => this.setState({seed: e.target.value})}/>
                </TextField>
                <TextField label='Encryption Key'>
                    <Input disabled={this.state.loading}
                        type="password" value={this.state.key}
                        onChange={(e) => this.setState({key: e.target.value})}/>
                </TextField>
                <p>{this.state.message}</p>
            </DialogContent>
                {loading}
            <DialogFooter>
                <DialogButton onClick={async ()=>{
                        this.setState({loading: true});
                        const res = await Api.deleteAccount(this.state.formData.id);
                        if(res.ok){
                            this.setState({loading: false});
                            this.context.deleteAccount(this.state.editIndex);
                            this.props.afterSubmit(1);
                            this.closeForm();
                        }else{
                            const result = await res.json();
                            this.setState({loading: false, message: result.message});
                        }
                    }}>Delete</DialogButton>
                <DialogButton isDefault onClick={async ()=>{
                        this.setState({loading: true});
                        const res = await Api.updateAccount(
                                        this.state.formData.id,
                                        this.state.formData.seedName,
                                        this.state.formData.url,
                                        this.state.formData.accountUserName,
                                        this.state.formData.seedInfo,
                                        this.state.seed,
                                        this.state.key);
                        if(res.ok){
                            this.setState({loading: false});
                            
                            let newItem = {
                                seedName: this.state.formData.seedName,
                                url: this.state.formData.url,
                                accountUserName: this.state.formData.accountUserName,
                                seedInfo: this.state.formData.seedInfo
                            };
                            
                            if(this.state.formData.seed != "") newItem.otpKey = this.state.formData.seed;
                            this.context.updateAccount(this.editIndex, newItem);
                            this.props.afterSubmit(0);
                            this.closeForm();
                        }else{
                            const result = await res.json();
                            this.setState({loading: false, message: result.message});
                        }
                    }}>Submit</DialogButton>
            </DialogFooter>
      </Dialog>
        )
    }
}

// export default connect(null, { updateAccountItem, removeAccountItem }, null, {forwardRef: true})(EditAccountDialog);