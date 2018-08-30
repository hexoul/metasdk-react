import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'

const NodeRSA = require('node-rsa');

export default class Login extends Component {
  static propTypes = {
    request: PropTypes.array,
    service: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      session: this.makeSessionID(),
      requestUri: '',
    };
  }

  makeSessionID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
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
    this.baseRequestUri = "meta://information?service=";
    this.baseRequestUri += this.props.service;
    // URI for request
    this.props.request.map((req) => {
      this.baseRequestUri += "&request=" + req;
    });
    // URI for callback
    this.baseRequestUri += "&callback=http%3A%2F%2F13.125.251.87%3A3000/metainfo?session=";
    
    this.setState({requestUri: this.baseRequestUri + this.state.session + "&public_key=" + pubkey});
  }

  render() {
    return (
      <div className={styles.test}>
        Session: {this.state.session != undefined && this.state.session} <br />
        Uri: {this.state.requestUri != undefined && this.state.requestUri}
      </div>
    )
  }
}
