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
        <SendTransaction 
          request={['to', 'value1','data1']}
        />
        <SendTransaction
          to='0x8101487270f5411cf213b8d348a2ab46df66245d'
          value='value2'
          data='data2'
         />
      </div>
    )
  }
}
