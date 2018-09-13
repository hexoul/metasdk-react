import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';

import MakeSessionID from '../util';

var QRCode = require('qrcode.react');

export default class SendTransaction extends Component {
  
  static propTypes = {
    request: PropTypes.any,
    to: PropTypes.string,
    value: PropTypes.string,
    data: PropTypes.string,
    usage: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      session: MakeSessionID(),
      trxRequestUri: '',
    }
  }

  componentDidMount() {
    this.baseTrxRequestUri = "meta://transaction?to=";
    if(this.props.request != undefined && this.props.request != '') {
      console.log('this.props.request', this.props.request);
      this.baseTrxRequestUri += this.props.request.params[0].to + "&value=" + this.props.request.params[0].value + "&data=" + this.props.request.params[0].data;
    }
    else if(this.props.to != undefined && this.props.to != '') {
      this.baseTrxRequestUri += this.props.to + "&value=" + this.props.value + "&data=" + this.props.data;
    }

    this.baseTrxRequestUri += ("&usage=" + this.props.usage + "&service=" + this.props.service
    + "&callback=https%3A%2F%2F2g5198x91e.execute-api.ap-northeast-2.amazonaws.com/test?key=" + this.state.session);
    
    console.log('baseTrxRequestUri: ',this.baseTrxRequestUri);
    this.setState({trxRequestUri: this.baseTrxRequestUri});
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
        <Popup trigger={<Button>SendTransaction</Button>}
          on='click'
          onOpen={() => this.onOpenSendTransaction()}
          onClose={() => this.onCloseSendTransaction()}
          verticalOffset={20}
          position='bottom right'
          style={{padding: '2em'}}>
            <QRCode value={this.state.trxRequestUri} size='128'/>
        </Popup>}
      </div>
    )
  }
}