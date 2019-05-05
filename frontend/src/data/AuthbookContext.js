import React, {Component} from 'react';

export const ContextDefaults = {
  userinfo: {
    displayName: '',
    username: '',
    email: '',
    encryptionKeySet: false,
    isEmailVerified: false,
  },

  accounts: [],
  encryptionKey: '',

  resetStates: () => {},
  setUserinfo: () => {},
  setEncryptionKey: () => {},
  setAccounts: () => {},
  addAccount: () => {},
  updateAccount: () => {},
  deleteAccount: () => {},

};

export const AuthbookContext = React.createContext(ContextDefaults);

export class AuthbookContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...ContextDefaults,
      resetStates: this.resetStates.bind(this),
      setUserinfo: this.setUserinfo.bind(this),
      setEncryptionKey: this.setEncryptionKey.bind(this),
      setAccounts: this.setAccounts.bind(this),
      addAccount: this.addAccount.bind(this),
      updateAccount: this.updateAccount.bind(this),
      deleteAccount: this.deleteAccount.bind(this),
    };
  }

  resetStates() {
    this.setState({
      ...ContextDefaults,
      resetStates: this.resetStates.bind(this),
      setUserinfo: this.setUserinfo.bind(this),
      setEncryptionKey: this.setEncryptionKey.bind(this),
      setAccounts: this.setAccounts.bind(this),
      addAccount: this.addAccount.bind(this),
      updateAccount: this.updateAccount.bind(this),
      deleteAccount: this.deleteAccount.bind(this),
    });
  }

  setUserinfo(data) {
    this.setState({userinfo: data});
  }

  setEncryptionKey(data) {
    this.setState({encryptionKey: data});
  }

  setAccounts(data) {
    this.setState({accounts: data});
  }

  addAccount(data) {
    this.setState({
      accounts: [...this.state.accounts, data],
    });
  }

  updateAccount(index, data) {
    const tmp = this.state.accounts;
    tmp[index] = {
      ...tmp[index],
      seedName: data.seedName,
      url: data.url,
      accountUserName: data.accountUserName,
      seedInfo: data.seedInfo,
    };
    if (data.otpKey) tmp[index].otpKey = data.otpKey;
    this.setState({accounts: tmp});
  }

  deleteAccount(index) {
    const tmpArr = this.state.accounts;
    tmpArr.splice(index, 1);
    this.setState({accounts: tmpArr});
  }

  render() {
    return (
      <AuthbookContext.Provider value={this.state}>
        {this.props.children}
      </AuthbookContext.Provider>
    );
  }
}
