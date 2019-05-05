import React, {Component} from 'react';
import {Router, Route, NavLink} from 'react-router-dom';
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

const initState = {
  currentPassword: '',
  newPassword: '',
  newPasswordCheck: '',
  loading: false,
  message: '',
  isOpen: false,
  success: false,
};

export default class ChangePasswordDialog extends Component {
  constructor(props) {
    super(props);
    this.state = initState;
  }

  openForm() {
    this.setState({
      isOpen: true,
    });
  }

  onClose() {
    this.setState(initState);
  }

  render() {
    const loading = this.state.loading ? (<LinearProgress indeterminate={true}/>) : (<div></div>);
    const content = this.state.success ? (
            <div>
              <DialogContent>
                <p>Password has been changed successfully.</p>
              </DialogContent>
              <DialogFooter>
                <DialogButton onClick={async ()=>this.onClose()}>Ok</DialogButton>
              </DialogFooter>
            </div>

        ) : (
            <div>
              <DialogContent>
                <TextField label='Current Password'>
                  <Input disabled={this.state.loading} type="password"
                    value={this.state.currentPassword}
                    onChange={(e) => this.setState({currentPassword: e.target.value})}/>
                </TextField>
                <TextField label='New Password'>
                  <Input disabled={this.state.loading} type="password"
                    value={this.state.newPassword}
                    onChange={(e) => this.setState({newPassword: e.target.value})}/>
                </TextField>
                <TextField label='New Password Check'>
                  <Input disabled={this.state.loading} type="password"
                    value={this.state.newPasswordCheck}
                    onChange={(e) => this.setState({newPasswordCheck: e.target.value})}/>
                </TextField>
                <p>{this.state.message}</p>
              </DialogContent>
              {loading}
              <DialogFooter>
                <DialogButton onClick={async ()=>this.onClose()}>Cancel</DialogButton>
                <DialogButton isDefault onClick={async ()=>{
                  this.setState({loading: true});
                  const res = await Api.changePassword(
                      this.state.currentPassword,
                      this.state.newPassword,
                      this.state.newPasswordCheck);
                  if (res.ok) {
                    this.setState({loading: false, success: true});
                  } else {
                    const result = await res.json();
                    this.setState({loading: false, message: result.message});
                  }
                }}>Submit</DialogButton>
              </DialogFooter>
            </div>
        );
    return (
      <Dialog open={this.state.isOpen} onClose={this.onClose.bind(this)}
        scrimClickAction="" escapeKeyAction="">
        <DialogTitle>Change Password</DialogTitle>
        {content}
      </Dialog>
    );
  }
}
