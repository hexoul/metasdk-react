import React, { Component } from 'react'

import Login from 'metasdk-react'

export default class App extends Component {
  render () {
    return (
      <div>
        <Login
          request={['name', 'email']}
        />
      </div>
    )
  }
}
