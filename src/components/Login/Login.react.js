import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';

import * as util from '../util';
import ipfs from '../ipfs';

var QRCode = require('qrcode.react');
var https = require('https');

export default class Login extends Component {
  
  static propTypes = {
    data: PropTypes.string,
    service: PropTypes.string,
    callback: PropTypes.func,
    callbackUrl: PropTypes.string,
    qrsize: PropTypes.number,
    qrvoffset: PropTypes.number,
    qrpadding: PropTypes.string,
    qrposition: PropTypes.string,
    qrtext: PropTypes.string,
  };

  qrstyle = {};

  constructor() {
    super();
    this.state = {
      session: util.MakeSessionID(),
      requestUri: '',
    };
  }

  componentWillMount() {
    util.SetQRstyle(this.qrstyle, this.props, 'Login');
  }

  componentDidMount() {
    // URI for service
    this.baseRequestUri = "meta://authentication?usage=login&service=" + this.props.service;
    // URI for callback
    if (this.props.callbackUrl) this.baseRequestUri += "&callback=" + encodeURIComponent(this.props.callbackUrl);
    else this.baseRequestUri += "&callback=https%3A%2F%2F2g5198x91e.execute-api.ap-northeast-2.amazonaws.com/test?key=" + this.state.session;
    
    var cb = (uri) => this.setState({trxRequestUri: uri});
    ipfs.add([Buffer.from(this.baseRequestUri)], (err, ipfsHash) => {
      if (! err) { console.log('IPFS hash:', ipfsHash[0].hash); cb(ipfsHash[0].hash); }
      else cb(this.baseRequestUri);
    });
  }

  onOpenLogin() {
    if (this.props.callbackUrl) return;

    this.interval = setInterval(() => {
      this.checkResponse();
    }, 2000);
  }

  onCloseLogin() {
    if (this.props.callbackUrl) return;

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
          if (this.props.callback) {
            this.props.callback({
              data: json['data'],
              signature: json['signature'],
              metaId: json['meta_id'],
            });
          }
        }
      });
    }).on('error', (err) => {
      console.log('error', err);
    }).end();
  }

  render() {
    return (
      <div>
        {this.state.trxRequestUri && this.props.callbackUrl &&
          <QRCode value={this.state.requestUri} size={this.qrstyle['qrsize']} />
        }
        {this.state.requestUri &&
          <Popup
            trigger={
              <Button id={this.props.id}>
                {this.qrstyle['qrtext']}
              </Button>
            }
            on='click'
            onOpen={() => this.onOpenLogin()}
            onClose={() => this.onCloseLogin()}
            verticalOffset={this.qrstyle['qrvoffset']}
            position={this.qrstyle['qrposition']}
            style={{
              padding: this.qrstyle['qrpadding'],
              backgroundColor: 'white'}}>
              <QRCode value={this.state.requestUri} size={this.qrstyle['qrsize']} />
          </Popup>
        }
      </div>
    )
  }
}
