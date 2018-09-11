import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';

import MakeSessionID from '../util';

var QRCode = require('qrcode.react');
var https = require('https');

export default class Login extends Component {
  static propTypes = {
    data: PropTypes.string,
    service: PropTypes.string,
    callback: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      session: MakeSessionID(),
      requestUri: '',
    };
  }

  componentDidMount() {
    // URI for service
    this.baseRequestUri = "meta://authentication?usage=login&service=" + this.props.service;
    // URI for callback
    this.baseRequestUri += "&callback=https%3A%2F%2F2g5198x91e.execute-api.ap-northeast-2.amazonaws.com/test?key=" + this.state.session;
    
    this.setState({requestUri: this.baseRequestUri});
  }

  onOpenLogin() {
    this.interval = setInterval(() => {
      this.checkResponse();
    }, 2000);
  }

  onCloseLogin() {
    clearInterval(this.interval);
  }

  checkResponse() {
    https.request({
      host: '2g5198x91e.execute-api.ap-northeast-2.amazonaws.com',
      path: '/test?key=' + this.state.session,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (data !== '') {
          clearInterval(this.interval);
          var json = JSON.parse(data);
          this.props.callback({
            data: json['data'],
            signature: json['signature'],
            metaId: json['meta_id'],
          });
        }
      });
    }).on('error', (err) => {
      console.log('error', err);
    }).end();
  }

  render() {
    return (
      <div>
        {this.state.requestUri != undefined && this.state.requestUri != '' &&
        <Popup trigger={<Button>Login</Button>}
          on='click'
          onOpen={() => this.onOpenLogin()}
          onClose={() => this.onCloseLogin()}
          verticalOffset={20}
          position='bottom right'
          style={{padding: '2em'}}>
            <QRCode value={this.state.requestUri} size='128'/>
        </Popup>}
      </div>
    )
  }
}
