import React, { Component } from 'react';
import { Login, Request, SendTransaction } from 'metasdk-react';

export default class App extends Component {

  constructor() {
    super();
    this.request = ['name', 'email'];
  }

  callbackExample(arg) {
    console.log('callbackExample', arg)
    this.request.map((req) => {
      console.log('got', req, arg[req]);
    });
  }

  render () {
    return (
      <div>
        <Login
          service='example'
          callback={this.callbackExample}
        />
        <hr />

        <Request
          request={this.request}
          service='example'
          callback={this.callbackExample}
        />
        <hr />

        <SendTransaction
          to='0xff'
          value='0x01'
          data='0x02'
          service='example'
          callback={this.callbackExample}
        />
      </div>
    )
  }
}
