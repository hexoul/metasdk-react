import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';

import * as util from '../util';

var QRCode = require('qrcode.react');

export default class SendTransaction extends Component {
  
  static propTypes = {
    request: PropTypes.any,
    to: PropTypes.string,
    value: PropTypes.string,
    data: PropTypes.string,
    usage: PropTypes.string,
    service: PropTypes.string,
    callback: PropTypes.func,
    qrsize: PropTypes.number,
    qrvoffset: PropTypes.number,
    qrpadding: PropTypes.string,
    qrposition: PropTypes.string,
    qrtext: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      session: util.MakeSessionID(),
      trxRequestUri: '',
    };
    this.qrstyle = {};
  }

  componentWillMount() {
    util.SetQRstyle(this.qrstyle, this.props, 'SendTransaction');
  }

  componentDidMount() {
    // URI for transaction
    this.baseRequestUri = "meta://transaction?to=";
    // URI for request
    if(this.props.request != undefined && this.props.request != '') {
      this.baseRequestUri += this.props.request.params[0].to + "&value=" + this.props.request.params[0].value + "&data=" + this.props.request.params[0].data;
    }
    // URI for to, value and data
    else if(this.props.to != undefined && this.props.to != '') {
      this.baseRequestUri += this.props.to + "&value=" + this.props.value + "&data=" + this.props.data;
    }
    // URI for usage
    this.baseRequestUri += "&usage=" + this.props.usage;
    // URI for service
    this.baseRequestUri += "&service=" + this.props.service;
    // URI for callback
    this.baseRequestUri += "&callback=https%3A%2F%2F2g5198x91e.execute-api.ap-northeast-2.amazonaws.com/test?key=" + this.state.session;

    this.setState({trxRequestUri: this.baseRequestUri});
  }

  onOpenSendTransaction() {
    this.interval = setInterval(() => {
      this.checkResponse();
    }, 2000);
  }

  onCloseSendTransaction() {
    clearInterval(this.interval);
  }

  checkResponse() {
    // TxID check
  }

  render() {
    return (
      <div>
        {this.state.trxRequestUri != undefined && this.state.trxRequestUri != '' &&
          <Popup
            trigger={
              <Button>{this.qrstyle['qrtext']}</Button>
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