const Api = {
    url:'http://localhost:3000',
    
    setUrl(url){
        this.url = url;
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
    
    setEncryptionKey(key){
        const session = localStorage.getItem('session');
        return fetch(`${this.url}/seeds/set_seedkey`, {
            method: 'POST',
            headers: {
                'SESSION': session
            }
        });
    }
};

export default Api;