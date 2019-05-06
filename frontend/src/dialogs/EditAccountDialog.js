import React, { Component } from 'react';
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
import {withTranslation} from 'react-i18next';

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

class EditAccountDialog extends Component{
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
            <DialogTitle>{this.props.t('home.acc_edit')}</DialogTitle>
            <DialogContent>
                <TextField label={this.props.t('common.acc_name')}>
                    <Input disabled={this.state.loading} value={this.state.formData.seedName}
                        onChange={(e) => this.setState({
                            formData:{...this.state.formData, seedName: e.target.value}
                        })}/>
                </TextField>
                <TextField label={this.props.t('common.url')}>
                    <Input disabled={this.state.loading} value={this.state.formData.url}
                        onChange={(e) => this.setState({
                            formData:{...this.state.formData, url: e.target.value}
                        })}/>
                </TextField>
                <TextField label={this.props.t('common.username')}>
                    <Input disabled={this.state.loading} value={this.state.formData.accountUserName}
                        onChange={(e) => this.setState({
                            formData:{...this.state.formData, accountUserName: e.target.value}
                        })}/>
                </TextField>
                <TextField label={this.props.t('common.info')} textarea>
                    <Input disabled={this.state.loading} value={this.state.formData.seedInfo}
                        onChange={(e) => this.setState({
                            formData:{...this.state.formData, seedInfo: e.target.value}
                        })}/>
                </TextField>
                <TextField label={this.props.t('common.otpkey')}
                    helperText={<HelperText>{this.props.t('home.acc_edit_otpkey_desc')}</HelperText>}>
                    <Input disabled={this.state.loading} value={this.state.seed}
                        onChange={(e) => this.setState({seed: e.target.value})}/>
                </TextField>
                <TextField label={this.props.t('common.enckey')}>
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
                    }}>{this.props.t('common.delete')}</DialogButton>
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
                    }}>{this.props.t('common.submit')}</DialogButton>
            </DialogFooter>
      </Dialog>
        )
    }
}

export default withTranslation(null, {withRef: true})(EditAccountDialog);