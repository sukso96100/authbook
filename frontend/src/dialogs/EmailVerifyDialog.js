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
import {withTranslation} from 'react-i18next';

class EmailVerifyDialog extends Component{
    
    step = {
        INIT: 0,
        REQUEST: 1,
        REQUESTED: 2,
        VERIFY: 3,
        DONE: 4
    };
    
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            step: this.step.INIT,
            email: "",
            verificationCode: "",
            loading: false,
            message: ""
        };
    }
    
    openForm(step=this.step.INIT){
        this.setState({isOpen: true, step: step});
    }

    onClose(){
        this.setState({
            isOpen: false,
            step: this.step.INIT,
            email: "",
            verificationCode: "",
            loading: false,
            message: ""
        });
    }
    
    async changeEmail(){
        this.setState({loading: true});
        try{
            let res = await Api.changeEmail(this.state.email);
            if(res.ok){
                this.setState({loading: false, step: this.step.REQUESTED});
            }else{
                const result = await res.json();
                this.setState({loading: false, message: result.message});
            }
        }catch(error){
            console.log(error);
            this.setState({loading: false, message: error});
        }
    }

    async verifyEmail(){
        this.setState({loading: true});
        try{
            let res = await Api.verifyEmail(this.state.verificationCode);
            if(res.ok){
                this.setState({loading: false, step: this.step.DONE});
            }else{
                const result = await res.json();
                this.setState({loading: false, message: result.message});
            }
        }catch(error){
            console.log(error);
            this.setState({loading: false, message: error});
        }
    }
    
    render(){
        const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
        let content;
        switch(this.state.step){
            case this.step.INIT:
                content = (<div>
                    <DialogContent>
                        <p>{this.props.t('email.init')}</p>
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton isDefault onClick={()=>this.onClose()}>{this.props.t('common.cancel')}</DialogButton>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.REQUEST})
                            }}>{this.props.t('common.no')}</DialogButton>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.VERIFY})
                            }}>{this.props.t('common.yes')}</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.REQUEST:
                content = (<div>
                    <DialogContent>
                        <p>{this.props.t('email.request')}</p>
                        <TextField label={this.props.t('email.new')}>
                            <Input disabled={this.state.loading}
                                value={this.state.email}
                                onChange={(e) => this.setState({email: e.target.value})}/>
                        </TextField>
                        <p>{this.state.message}</p>
                    </DialogContent>
                        {loading}
                    <DialogFooter>
                        <DialogButton isDefault disabled={this.state.loading}
                            onClick={this.changeEmail.bind(this)}>{this.props.t('common.submit')}</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.REQUESTED:
                content = (<div>
                    <DialogContent>
                        <p>{this.props.t('email.requested')}</p>
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.REQUEST})
                            }}>{this.props.t('common.prev')}</DialogButton>
                        <DialogButton isDefault onClick={() => { 
                                this.setState({step: this.step.VERIFY})
                            }}>{this.props.t('common.next')}</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.VERIFY:
                content = (<div>
                    <DialogContent>
                        <p>{this.props.t('email.verify')}</p>
                        <TextField label={this.props.t('common.ver_code')}>
                            <Input disabled={this.state.loading}
                                value={this.state.verificationCode}
                                onChange={(e) => this.setState({verificationCode: e.target.value})}/>
                        </TextField>
                        <p>{this.state.message}</p>
                    </DialogContent>
                        {loading}
                    <DialogFooter>
                        <DialogButton isDefault disabled={this.state.loading}
                            onClick={this.verifyEmail.bind(this)}>{this.props.t('common.submit')}</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
            case this.step.DONE:
                content = (<div>
                    <DialogContent>
                        <p>{this.props.t('email.done')}</p>
                    </DialogContent>
                    <DialogFooter>
                        <DialogButton isDefault onClick={()=>this.onClose()}>{this.porps.t('common.ok')}</DialogButton>
                    </DialogFooter>
                    </div>);
                break;
        }
        return(
            <Dialog open={this.state.isOpen} scrimClickAction="" escapeKeyAction=""
                onClose={()=>this.onClose()}>
            <DialogTitle>{this.props.t('email.title')}</DialogTitle>
                {content}
            </Dialog>
        )
    }
}

export default withTranslation(null, {withRef: null})(EmailVerifyDialog);