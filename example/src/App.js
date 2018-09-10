import React, { Component } from 'react'

import { Request } from 'metasdk-react'

export default class App extends Component {

  callbackExample(arg) {
    console.log('callbackExample')
  }

  render () {
    return (
      <div>
        <Request
          request={['name', 'email']}
          service='example'
          callback={this.callbackExample}
        />
      </div>
    )
  }
}
