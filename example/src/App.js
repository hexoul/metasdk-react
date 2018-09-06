import React, { Component } from 'react'

import Login from 'metasdk-react'

export default class App extends Component {

  callbackExample(arg) {
    console.log('callbackExample')
  }

  render () {
    return (
      <div>
        <Login
          request={['name', 'email']}
          service='example'
          callback={this.callbackExample}
        />
      </div>
    )
  }
}
