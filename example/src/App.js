import React, { Component } from 'react';
import { Login, Request, SendTransaction } from 'metasdk-react';
import Web3 from 'web3';

const compiledBNB = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawEther","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"unfreeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"freezeOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"freeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Freeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Unfreeze","type":"event"}];

export default class App extends Component {

  constructor() {
    super();
    // Topic - 10: name, 20: phone number, 30: e-mail
    this.request = ['10', '20', '30'];
  }

  componentWillMount() {
    if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
      this.web3 = new Web3(window.web3.currentProvider);
      let BNB = new this.web3.eth.Contract(compiledBNB, '0xdd755ca63bd19299b83ae0bb9fd5bcd765fe908c');
      this.trxRequest = BNB.methods.transfer('0x31a46cd5FF7d0DC32b93149dB1A695b68Fc1aa00', this.web3.utils.toWei('0', 'ether'))
                                      .send.request({from: "", value: this.web3.utils.toWei('0', 'ether'), gasPrice: '1'});
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

  onClickTest() {
    var componentID = 'loginID';
    document.getElementById(componentID).click();
  }

  render () {
    return (
      <div>
        <button onClick={this.onClickTest}>onClickTest</button>
        
        <Login
          id ='loginID'
          data='testmsg'
          service='example'
          callback={this.callbackExample}
        />
        <hr />

        <Request
          id='requestID'
          request={this.request}
          usage='example'
          // AA or SP encryption_key(secp256k1 public key)
          // adminMetaId=''
          callback={this.requestCallbackExample}
          qrsize={256}
        />
        <hr />

        <SendTransaction
          id='sendTransactionId1'
          request={this.trxRequest}
          usage='method'
          service='example'
          callback={this.callbackExample}
        />
        <hr />

        <SendTransaction
          id='sendTransactionWithCallbackURL'
          request={this.trxRequest}
          usage='method'
          callbackUrl='http://localhost/callback'
        />
        <hr />

        <SendTransaction
          id='sendTransactionId2'
          to='0x8101487270f5411cf213b8d348a2ab46df66245d'
          value={this.web3.utils.toWei('0.01', 'ether')}
          data='data2'
          usage='method'
          qrsize={256}
          qrvoffset={20}
          qrpadding='2em'
          qrposition='bottom right'
          qrtext='SendTransaction'
          callback={this.callbackExample}
        />
      </div>
    )
  }
}
