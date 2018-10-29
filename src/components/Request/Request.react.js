import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';

import * as util from '../util';
import styles from './styles.css';

const NodeRSA = require('node-rsa');
var QRCode = require('qrcode.react');
var https = require('https');
var constants = require('constants');
var crypto = require('crypto');

export default class Request extends Component {
  
  static propTypes = {
    request: PropTypes.array,
    service: PropTypes.string,
    callback: PropTypes.func,
    callbackUrl: PropTypes.string,
    qrsize: PropTypes.number,
    qrvoffset: PropTypes.number,
    qrpadding: PropTypes.string,
    qrposition: PropTypes.string,
    qrtext: PropTypes.string,
  }

  qrstyle = {};

  constructor() {
    super();
    this.reqinfo = {};
    this.state = {
      session: util.MakeSessionID(),
      requestUri: '',
    };
  }

  componentWillMount() {
    util.SetQRstyle(this.qrstyle, this.props, 'Request');
  }

  componentDidMount() {
    const key = new NodeRSA({b: 2048});
    this.pubkey = key.exportKey('public');
    this.privkey = key.exportKey('private');

    var pubkey = this.pubkey
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s+|\n\r|\n|\r$/gm, '');
    pubkey = encodeURIComponent(pubkey);
    
    // URI for service
    this.baseRequestUri = "meta://information?service=" + this.props.service;
    // URI for request
    this.props.request.map((req) => {this.baseRequestUri += "&request=" + req;});
    // URI for callback
    if (this.props.callbackUrl) this.baseRequestUri += "&callback=" + encodeURIComponent(this.props.callbackUrl);
    else this.baseRequestUri += "&callback=https%3A%2F%2F2g5198x91e.execute-api.ap-northeast-2.amazonaws.com/test?key=" + this.state.session;
    // URI for pubkey
    this.baseRequestUri += "&public_key=" + pubkey;

    this.setState({ requestUri: this.baseRequestUri });
  }

  onOpenRequest() {
    if (this.props.callbackUrl) return;

    this.interval = setInterval(() => {
      this.checkResponse();
    }, 2000);
  }

  onCloseRequest() {
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
          var secret = crypto.privateDecrypt({key: this.privkey, padding: constants.RSA_PKCS1_PADDING}, Buffer.from(json['secret'], 'base64'));
          this.props.request.map((req) => {
            if (json['data'][req] == undefined || json['data'][req] == '') return;

            let nDecipher = crypto.createDecipheriv('aes-256-ecb', secret, '');
            let data = nDecipher.update(Buffer.from(json['data'][req]['value'], 'base64'), 'base64', 'utf-8');
            data += nDecipher.final('utf-8');
            this.reqinfo[req] = data;
          });
          if (this.props.callback) {
            this.props.callback(this.reqinfo);
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
        {this.props.callbackUrl &&
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
            onOpen={() => this.onOpenRequest()}
            onClose={() => this.onCloseRequest()}
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
