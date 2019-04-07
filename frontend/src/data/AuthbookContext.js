import React from 'react';

export const ContextDefaults = {
    userinfo: {
        displayName: "",
        username: "",
        email: "", 
        encryptionKeySet: false,
        isEmailVerified: false,
    },
    
    accounts: [],
    encryptionKey: "",
    
    setUserinfo: () => {},
    setEncryptionKey: () => {},
    setAccounts: () => {},
    addAccount: () => {},
    updateAccount: () => {},
    deleteAccount: () => {}
    
};

export const AuthbookContext = React.createContext(ContextDefaults);