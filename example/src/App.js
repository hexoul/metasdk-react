import React, { Component } from 'react'

import { Login, Request, SendTransaction } from 'metasdk-react'

export default class App extends Component {

  callbackExample(arg) {
    console.log('callbackExample')
  }

  render () {
    return (
      <div>
        <Login />
        <hr />
        <Request
          request={['name', 'email']}
          service='example'
          callback={this.callbackExample}
        />
        <hr />
        <SendTransaction />
      </div>
    )
  }
}
