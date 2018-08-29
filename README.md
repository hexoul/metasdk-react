# metasdk-react

> SDK to communicate between React and App using QRCode

[![NPM](https://img.shields.io/npm/v/metasdk-react.svg)](https://www.npmjs.com/package/metasdk-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save metasdk-react
```

## Components

1. Login
2. SendTransaction

## Usage

```jsx
import React, { Component } from 'react'

import { Login, SendTransaction } from 'metasdk-react'

class Example extends Component {
  render () {
    return (
      <div>
        <Login />
        <SendTransaction />
      </div>
    )
  }
}
```

## Thanks to
[create-react-library](https://www.npmjs.com/package/create-react-library)

## License

MIT © [hexoul](https://github.com/hexoul)
