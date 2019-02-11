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
    }
};

export default Api;