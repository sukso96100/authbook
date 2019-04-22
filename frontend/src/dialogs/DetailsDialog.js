import React, { Component } from 'react';
import '../themeing.scss';
import './DialogInputStyle.css';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog';

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
};

export default class DetailsDialog extends Component{
    constructor(props) {
        super(props);
        this.state = initState;
    }
    
    openForm(initData){
        this.setState({
            formData: initData, 
            isOpen: true});
    }
    
    closeForm(){
        this.setState(initState);
    }
    
    render(){
        return(
            <Dialog open={this.state.isOpen} onClose={this.closeForm.bind(this)}>
            <DialogTitle>Account Details</DialogTitle>
            <DialogContent>
                <h2>{this.state.formData.seedName}</h2>
                <p>{this.state.formData.url}</p>
                <hr/>
                <h3>{this.state.formData.accountUserName}</h3>
                <p>{this.state.formData.seedInfo}</p>
            </DialogContent>
            <DialogFooter>
                <DialogButton onClick={this.closeForm.bind(this)}>Close</DialogButton>
            </DialogFooter>
      </Dialog>
        )
    }
}
