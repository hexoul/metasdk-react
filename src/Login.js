import React, {Component} from 'react';

function makeSessionID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

const Login = () => {
    return (
        <p>Login</p>
    )
};

export default Login;

/*
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

    render() {
        return (
            <p>
                Login, {this.state.session ? this.state.session : ''}
            </p>
        );
    }
}
*/