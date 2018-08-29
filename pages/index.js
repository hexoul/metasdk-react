import React, { Component } from 'react';
import { Login } from '../src/index.js';

class TestIndex extends Component {
  
  constructor() {
    super();
  }

  render() {
    return(
      <div>
        <p>Test page</p>
        <Login
          text='123'
        />
      </div>
    )
  }
}

export default TestIndex;
