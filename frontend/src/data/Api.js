const Api = {
    url:'https://authbook.herokuapp.com',
    
    setUrl(url){
        this.url = url;
    },
    
    signup(username, displayName, email, password, passwordCheck){
        return fetch(`${this.url}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                username: username.toString(),
                email: email.toString(),
                displayName: displayName.toString(),
                password: password.toString(),
                passwordCheck: passwordCheck.toString()
            })
        });
    },
    
    login(username, password){
        return fetch(`${this.url}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                username: username.toString(),
                password: password.toString()
            })
        });
    },
    
    logout(){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/auth/logout`, {
            method: 'GET',
            headers: {
                'SESSION': session
              }
        });
    },
    
    changePassword(currentPassword, newPassword, newPasswordCheck){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/auth/change_password`, {
            method: 'PUT',
            headers: {
                'SESSION': session,
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                currentPassword: currentPassword.toString(),
                newPassword: newPassword.toString(),
                newPasswordCheck: newPasswordCheck.toString()
            })
        });
    },
    
    fetchUserInfo(){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/auth/userinfo`, {
            method: 'GET',
            headers: {
                'SESSION': session
              }
        });
    },
    
    reqPasswordRecovery(email){
        return fetch(`${this.url}/auth/request_recover`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                email: email.toString()
            })
        });
    },
    
    recoverPassword(username, verificationCode, newPassword, newPasswordCheck){
        return fetch(`${this.url}/auth/recover`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                username: username.toString(),
                verificationCode: verificationCode.toString(),
                newPassword: newPassword.toString(),
                newPasswordCheck: newPasswordCheck.toString()
            })
        });
    },
    
    changeEncryptionKey(currentKey, newKey, newKeyCheck){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/seeds/change_seedkey`, {
            method: 'PUT',
            headers: {
                'SESSION': session,
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                currentPassword: currentKey.toString(),
                newPassword: newKey.toString(),
                newPasswordCheck: newKeyCheck.toString()
            })
        });
    },
    
    changeEmail(newEmail){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/auth/change_email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'SESSION': session
              },
            body: JSON.stringify({
                email: newEmail.toString()
            })
        });
    },
    
    verifyEmail(verificationCode){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/auth/verify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'SESSION': session
              },
            body: JSON.stringify({
                verificationCode: verificationCode.toString()
            })
        });
    },
    
    getAccounts(){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/seeds/all`, {
            method: 'GET',
            headers: {
                'SESSION': session
            }
        });
    },
    
    addAccount(name, url, username, info, seed, key){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/seeds/add`, {
            method: 'POST',
            headers: {
                'SESSION': session,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                seedName: name,
                url: url,
                accountUserName: username,
                seedInfo: info,
                seedValue: seed,
                seedKey: key
            })
        });
    },
    
    updateAccount(id, name, url, username, info, seed, key){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/seeds/edit`, {
            method: 'PUT',
            headers: {
                'SESSION': session,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                seedName: name,
                url: url,
                accountUserName: username,
                seedInfo: info,
                seedValue: seed,
                seedKey: key
            })
        });
    },
    
    deleteAccount(id){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/seeds/delete`, {
            method: 'DELETE',
            headers: {
                'SESSION': session,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
            })
        });
    },
    
    setEncryptionKey(key, keyCheck){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/seeds/set_seedkey`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'SESSION': session
            },
            body: JSON.stringify({
                seedKey: key,
                seedKeyCheck: keyCheck,
            })
        });
    }
};

export default Api;
