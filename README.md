# metasdk-react

> SDK to communicate between React and App using QRCode

[![NPM](https://img.shields.io/npm/v/metasdk-react.svg)](https://www.npmjs.com/package/metasdk-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save metasdk-react
```

## Components

1. Login
2. Request
2. SendTransaction

## Usage

NOTE: Enabling CORS is necessary

```jsx
import React, { Component } from 'react';
import { Login, Request, SendTransaction } from 'metasdk-react';

class Example extends Component {
  callbackExample(arg) {}
  
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
```

## Test
```
cd metasdk-react
npm start
[Ctrl+C]
cd example
npm start
```

## Thanks to
[create-react-library](https://www.npmjs.com/package/create-react-library)

## License

MIT © [hexoul](https://github.com/hexoul)
