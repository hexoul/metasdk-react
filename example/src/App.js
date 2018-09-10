import React, { Component } from 'react'

import { Login, Request, SendTransaction } from 'metasdk-react'

export default class App extends Component {

  callbackExample(arg) {
    console.log('callbackExample')
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
          request={['name', 'email']}
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
