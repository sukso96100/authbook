import React, {Component} from 'react';
import '../themeing.scss';
import './DialogInputStyle.css';
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
} from '@material/react-dialog';
import {withTranslation} from 'react-i18next';

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

class DetailsDialog extends Component {
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
                <DialogTitle>{this.props.t('home.acc_details')}</DialogTitle>
                <DialogContent>
                    <p><b>{this.state.formData.seedName}</b></p>
                    <p><b>{this.props.t('common.url')} </b>{this.state.formData.url}</p>
                    <p><b>{this.props.t('common.username')} </b>{this.state.formData.accountUserName}</p>
                    <p><b>{this.props.t('common.info')} </b><br/>{this.state.formData.seedInfo}</p>
                </DialogContent>
                <DialogFooter>
                    <DialogButton onClick={this.closeForm.bind(this)}>{this.props.t('common.close')}</DialogButton>
                </DialogFooter>
            </Dialog>
        );
    }
}

export default withTranslation(null, {withRef: true})(DetailsDialog);