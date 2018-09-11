import React, { Component } from 'react';
import { Button, Popup } from 'semantic-ui-react';

import styles from './styles.css';

var QRCode = require('qrcode.react');

export default class SendTransaction extends Component {
  constructor() {
    super();
    this.state = {
      to: '',
      value: '',
      data: '',
      trxRequestUri: '',
    }
  }

  componentDidMount() {
    if(this.props.request != undefined) {
      this.baseRequestUri = "meta://transaction?to=" + this.props.request[0]
      + "&value=" + this.props.request[1]
      + "&data=" + this.props.request[2];

      this.setState({trxRequestUri: this.baseRequestUri, to: this.props.request[0], value: this.props.request[1], data: this.props.request[2]});
    }
    else if(this.props.to != undefined) {
      this.baseRequestUri = "meta://transaction?to=" + this.props.to 
      + "&value=" + this.props.value
      + "&data=" + this.props.data;

      this.setState({trxRequestUri: this.baseRequestUri, to: this.props.to, value: this.props.value, data: this.props.data});
    }

  }

  onOpenLogin() {
    this.interval = setInterval(() => {
      //this.checkResponse();
    }, 2000);
  }

  onCloseLogin() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <div className={styles.test}>
          Uri: {this.state.trxRequestUri != undefined && this.state.trxRequestUri} <br />
          to: {this.state.to != undefined && this.state.to} <br />
          value: {this.state.value != undefined && this.state.value} <br />
          data: {this.state.data != undefined && this.state.data} <br />
        </div>

        <div>
        <Popup trigger={<Button>SendTransaction</Button>}
          on='click'
          onOpen={() => this.onOpenLogin()}
          onClose={() => this.onCloseLogin()}
          verticalOffset={20}
          position='bottom right'
          style={{padding: '2em'}}>
            <QRCode value={this.state.trxRequestUri} size='128'/>
        </Popup>}
        </div>
      </div>
    )
  }
}