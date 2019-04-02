const initState = {
    userinfo: {
        displayName: "", username: "",
        email: "", encryptionKeySet: false,
        isEmailVerified: false
    },
    accounts: [],
    encryptionKey: ""
};

export default function authbookApp(state = initState, action) {
    switch (action.type) {
        case 'SET_USERINFO':
            return Object.assign({}, state, {
                userinfo: action.userinfo
            });
            
        case 'REFRESH_ACCOUNTS':
            return Object.assign({}, state, {
                accounts: action.accounts
            });
        
        case 'REMOVE_ACCOUNT_ITEM':
            return {
                ...state,
                accounts: state.accounts.splice(action.index, 1)
            };
        case 'UPDATE_ACCOUNT_ITEM':
            let tmp = state.accounts;
            tmp[action.index] = {
                ...tmp[action.index],
                seedName: action.account.seedName,
                url: action.account.url,
                accountUserName: action.account.accountUserName,
                seedInfo: action.account.seedInfo
            };
            if(action.account.otpKey) tmp[action.index].otpKey = action.account.otpKey;
            return {
                ...state,
                accounts: tmp
            };
        
        case 'ENTER_ENCRYPTION_KEY':
            return {
                ...state,
                encryptionKey: action.key
            };
        case 'RESET_STATES':
            return Object.assign({}, state, initState);
    
      default:
          return state;
  }
}