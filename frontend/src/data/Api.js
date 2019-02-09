const Api = {
    url:'http://localhost:3000',
    setUrl(url){
        this.url = url;
    },
    login(username, password){
        let loginHeaders = new Headers();
        loginHeaders.append('Content-Type', 'application/json');
        return fetch(`${this.url}/auth/login`, {
            method: 'POST',
            headers: loginHeaders,
            mode: 'no-cors',
            body: JSON.stringify({
                username: username.toString(),
                password: password.toString()
            })
        });
    }
};

export default Api;