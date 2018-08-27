import React, {Component} from 'react';

class Login extends Component {

    static async getInitialProps({ query: { setInfo } }) {
        const initProps = {
          setInfo: setInfo,
        }
        return initProps || {}
    }
    
    constructor() {
        super();
        this.state = {
          session: this.makeSessionID(),
        };
    }
    
    makeSessionID() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        console.log('session', text);
        return text;
    }

    render() {
        return (
            <p>
                Login, 
                {this.state.session ? this.state.session : ''}
            </p>
        );
    }
}

export {Login};