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
If `callbackUrl` will be given as prop, a component shows QR code directly, not popup button.

```jsx
import React, { Component } from 'react';
import { Login, Request, SendTransaction } from 'metasdk-react';

class Example extends Component {
  callbackExample(arg) {}
  
  render () {
    return (
      <div>
        <Login
          data='testmsg'
          service='example'
          callback={this.callbackExample}
        />

        <Request
          request={['name', 'email']}
          service='example'
          callback={this.callbackExample}
        />

        <SendTransaction
          id='sendTransactionByRequest'
          request={this.trxRequest}
          usage='method'
          service='example'
          callback={this.callbackExample}
        />

        <SendTransaction
          id='sendTransactionWithCallbackURL'
          request={this.trxRequest}
          usage='method'
          service='example'
          callbackUrl='http://localhost/callback'
        />

        <SendTransaction
          id='sendTransactionByRaw'
          to='0x8101487270f5411cf213b8d348a2ab46df66245d'
          value='0x01'
          data='0x02'
          service='example'
          qrsize={256}
          qrvoffset={20}
          qrpadding='2em'
          qrposition='bottom right'
          qrtext='SendTransaction'
          callback={this.callbackExample}
        />
      </div>
    )
  }
}
```

QRCode styles can be set for all components like above example `SendTransaction`
- `qrsize` changes the size of QRCode
- `qrvoffset` is a vertical offset from origin
- `qrpadding` applies padding thickness of QRCode as style
- `qrposition` decides relative position from origin, declaration for positions are in `util.js`
- `qrtext` sets `Button` text to open QRCode popup

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
