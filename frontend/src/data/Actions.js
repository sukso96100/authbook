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
    