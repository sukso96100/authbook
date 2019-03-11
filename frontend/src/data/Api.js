const Api = {
    url:'http://localhost:3000',
    
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
                username: username,
                email: email,
                displayName: displayName,
                password: password,
                passwordCheck: passwordCheck
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
            method: 'POST',
            headers: {
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