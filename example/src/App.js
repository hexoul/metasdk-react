import React, { Component } from 'react';
import { Login, Request, SendTransaction } from 'metasdk-react';
import Web3 from 'web3';

const compiledBNB = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawEther","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"unfreeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"freezeOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"freeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Freeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Unfreeze","type":"event"}];

export default class App extends Component {
  
  constructor() {
    super();
    this.request = ['name', 'email'];
    this.trxRequest = ['to', 'value', 'data'];
  }

  componentWillMount() {
    if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
      let web3 = new Web3(window.web3.currentProvider);
      let BNB = new web3.eth.Contract(compiledBNB,'0x763529b9ECE8694442FC7CAA2bEb305D6452B56d');

      this.trxRequest = BNB.methods.transfer('0xd396ce692b3c735d9ebd4ed0407c9df17efcee91',web3.utils.toWei('0', 'ether')).send.request({from: "", value: web3.utils.toWei('0', 'ether'), gasPrice: '1'});
      console.log('trxRequest', this.trxRequest);
    }
  }

  callbackExample(arg) {
    console.log('callbackExample', arg);
  }

  requestCallbackExample(arg) {
    console.log('requestCallbackExample', arg);
    this.request.map((req) => {
      console.log('got', req, arg[req]);
      return req;
    });
  }

  render () {
    return (
      <div>
        <Login
          data='testmsg'
          service='example'
          callback={this.callbackExample}
        />
        <hr />

        <Request
          request={this.request}
          service='example'
          callback={this.requestCallbackExample}
        />
        <hr />

        <SendTransaction 
          request={this.trxRequest}
          usage='method'
          service='example'
          qrsize={128}
          qrvoffset={20}
          qrpadding='2em'
          qrposition='bottom right'
          qrtext='SendTransaction'
          callback={this.callbackExample}
        />
        <hr />

        <SendTransaction
          to='0x8101487270f5411cf213b8d348a2ab46df66245d'
          value='value2'
          data='data2'
          usage='method'
          service='example'
          qrsize={256}
          qrvoffset={20}
          qrpadding='3em'
          qrposition='bottom right'
          qrtext='SendTransaction'
          callback={this.callbackExample}
         />
      </div>
    )
  }
}
