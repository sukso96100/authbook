import React, {Component} from 'react';
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
        seedName: '',
        url: '',
        accountUserName: '',
        seed: '',
        key: '',
        seedInfo: '',
    },
    isOpen: false,
};

export default class DetailsDialog extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }

    openForm(initData) {
        this.setState({
            formData: initData,
            isOpen: true});
    }

    closeForm() {
        this.setState(initState);
    }

    render() {
        return (
            <Dialog open={this.state.isOpen} onClose={this.closeForm.bind(this)}>
                <DialogTitle>Account Details</DialogTitle>
                <DialogContent>
                    <p><b>{this.state.formData.seedName}</b></p>
                    <p><b>URL </b>{this.state.formData.url}</p>
                    <p><b>Username </b>{this.state.formData.accountUserName}</p>
                    <p><b>Information </b><br/>{this.state.formData.seedInfo}</p>
                </DialogContent>
                <DialogFooter>
                    <DialogButton onClick={this.closeForm.bind(this)}>Close</DialogButton>
                </DialogFooter>
            </Dialog>
        );
    }
}
