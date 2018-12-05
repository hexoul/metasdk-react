import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';

import * as util from '../util';
import ipfs from '../ipfs';

var QRCode = require('qrcode.react');
var https = require('https');

export default class SendTransaction extends Component {

  static propTypes = {
    request: PropTypes.any,
    to: PropTypes.string,
    value: PropTypes.string,
    data: PropTypes.string,
    usage: PropTypes.string,
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
    this.state = {
      session: util.MakeSessionID(),
      trxRequestUri: '',
    };
  }

  componentWillMount() {
    util.SetQRstyle(this.qrstyle, this.props, 'SendTransaction');
  }

  componentDidMount() {
    // URI for transaction
    this.baseRequestUri = "meta://transaction?t=";
    // URI for request
    if(this.props.request != undefined && this.props.request != '') {
      this.baseRequestUri += this.props.request.params[0].to + "&v=" + this.props.request.params[0].value + "&d=" + this.props.request.params[0].data;
    }
    // URI for to, value and data
    else if(this.props.to != undefined && this.props.to != '') {
      this.baseRequestUri += this.props.to + "&v=" + util.ConvertVal2Hexd(this.props.value) + "&d=" + util.ConvertData2Hexd(this.props.data);
    }
    // URI for usage
    this.baseRequestUri += "&u=" + this.props.usage;
    
    // URI for callback
    if (this.props.callbackUrl) this.baseRequestUri += "&c=" + encodeURIComponent(this.props.callbackUrl);
    else this.baseRequestUri += "&c=https%3A%2F%2F2g5198x91e.execute-api.ap-northeast-2.amazonaws.com/test?key=" + this.state.session;

    var cb = (uri) => this.setState({trxRequestUri: uri});
    ipfs.add([Buffer.from(this.baseRequestUri)], (err, ipfsHash) => {
      if (! err) { console.log('SendTransaction IPFS hash:', ipfsHash[0].hash); cb(ipfsHash[0].hash); }
      else cb(this.baseRequestUri);
    });
  }

  onOpenSendTransaction() {
    if (this.props.callbackUrl) return;

    this.interval = setInterval(() => {
      this.checkResponse();
    }, 2000);
  }

  onCloseSendTransaction() {
    if (this.props.callbackUrl) return;

    clearInterval(this.interval);
  }

  checkResponse() {
    // TxID check
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
              txid: json['txid'],
              address: json['address'],
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
        {! this.state.trxRequestUri &&
          <center>
            Making QRcode through IPFS...
            <ReactLoading type='spin' color='#1DA57A' height='50px' width='50px' />
          </center>
        }
        {this.state.trxRequestUri && this.props.callbackUrl &&
          <QRCode value={this.state.trxRequestUri} size={this.qrstyle['qrsize']} />
        }
        {this.state.trxRequestUri && ! this.props.callbackUrl &&
          <Popup
            trigger={
              <Button id={this.props.id}>
                {this.qrstyle['qrtext']}
              </Button>
            }
            on='click'
            onOpen={() => this.onOpenSendTransaction()}
            onClose={() => this.onCloseSendTransaction()}
            verticalOffset={this.qrstyle['qrvoffset']}
            position={this.qrstyle['qrposition']}
            style={{
              padding: this.qrstyle['qrpadding'],
              backgroundColor: 'white'}}>
              <QRCode value={this.state.trxRequestUri} size={this.qrstyle['qrsize']} />
          </Popup>
        }
      </div>
    )
  }
}