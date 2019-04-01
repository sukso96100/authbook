export const setUserinfo = (displayName, username, email, 
                            encryptionKeySet, isEmailVerified) => {
    const userinfo = {
        displayName: displayName, username: username,
        email: email, encryptionKeySet: encryptionKeySet,
        isEmailVerified: isEmailVerified
    };
    
    return {
        type: 'SET_USERINFO',
        userinfo
    };
};

export const enterEncryptionKey = (key) => {
    return {
        type: 'ENTER_ENCRYPTION_KEY',
        key
    };
};

export const refreshAccounts = (accounts) => {
    return {
        type: 'REFRESH_ACCOUNTS',
        accounts
    };
};

export const updateAccountItem = (index, account) => {
    return {
        type: 'UPDATE_ACCOUNT_ITEM',
        index, account
    };
};

export const removeAccountItem = (index) => {
    return {
        type: 'REMOVE_ACCOUNT_ITEM',
        index
    };
};

export const resetStates = () => {
    return { type: 'RESET_STATES' };
};