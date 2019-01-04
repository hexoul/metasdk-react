import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import PropTypes from 'prop-types'
import { Button, Popup } from 'semantic-ui-react'

import * as util from '../util'
import ipfs from '../ipfs'

var crypto = require('crypto')
const NodeRSA = require('node-rsa')
var https = require('https')

export default class Request extends Component {
  static propTypes = {
    request: PropTypes.array,
    usage: PropTypes.string,
    callback: PropTypes.func,
    callbackUrl: PropTypes.string,
    // metaID: PropTypes.string,
    qrpopup: PropTypes.bool,
    qrsize: PropTypes.number,
    qrvoffset: PropTypes.number,
    qrpadding: PropTypes.string,
    qrposition: PropTypes.string,
    qrtext: PropTypes.string
  }

  qrstyle = {}

  constructor () {
    super()
    this.reqinfo = {}
    this.state = {
      session: util.makeSessionID(),
      trxRequestUri: '',
      qrCode: false
    }
  }

  componentWillMount () {
    util.setQRstyle(this.qrstyle, this.props, 'Request')
  }

  componentDidMount () {
    const key = new NodeRSA({ b: 2048 })
    this.pubkey = key.exportKey('public')
    this.privkey = key.exportKey('private')

    var pubkey = this.pubkey
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s+|\n\r|\n|\r$/gm, '')
    pubkey = encodeURIComponent(pubkey)

    // URI for usage
    this.baseRequestUri = 'meta://information?u=' + this.props.usage

    // URI for request
    this.baseRequestUri += '&r=' + this.props.request.join(',')

    // URI for callback
    if (this.props.callbackUrl) this.baseRequestUri += '&callback=' + encodeURIComponent(this.props.callbackUrl)
    else this.baseRequestUri += '&callback=https%3A%2F%2F' + util.CacheServer.host + '/' + util.CacheServer.stage + '?key=' + this.state.session

    // URI for Meta ID
    // this.baseRequestUri += '&m=' + this.props.metaID;

    // URI for pubkey
    this.baseRequestUri += '&p=' + pubkey

    var cb = (uri) => this.setState({ trxRequestUri: uri }, () => {
      if (!this.props.qrpopup) util.loadQrCode(this.state.session, uri, this.qrstyle['qrsize'], () => this.setState({ qrCode: true }))
    })
    ipfs.add([Buffer.from(this.baseRequestUri)], (err, ipfsHash) => {
      if (!err) {
        console.log('Request IPFS hash:', ipfsHash[0].hash)
        cb(ipfsHash[0].hash)
      } else cb(this.baseRequestUri)
    })
  }

  onOpenRequest () {
    if (!this.qrstyle.qrpopup) return

    window.setTimeout(() => util.loadQrCode(this.state.session, this.state.trxRequestUri, this.qrstyle['qrsize'], () => this.setState({ qrCode: true })), 500)

    this.interval = setInterval(() => {
      this.checkResponse()
    }, 2000)
  }

  onCloseRequest () {
    if (!this.qrstyle.qrpopup) return

    clearInterval(this.interval)
  }

  checkResponse () {
    https
      .request({
        host: util.CacheServer.host,
        path: '/' + util.CacheServer.stage + '?key=' + this.state.session
      }, (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          if (data !== '') {
            clearInterval(this.interval)
            var responseBytes = Buffer.from(data, 'base64')

            // Get AES key and encrypted data
            var encryptedAesKey = responseBytes.slice(0, 256)
            var encryptedData = responseBytes.slice(256, responseBytes.byteLength)

            // Decrypt AES key with RSA
            var secret = crypto.privateDecrypt({ key: this.privkey, padding: crypto.constants.RSA_PKCS1_PADDING }, encryptedAesKey)

            // Decrypt data with AES
            var aes = crypto.createDecipheriv('aes-256-ecb', secret, '')
            var result = aes.update(encryptedData)
            result += aes.final()

            var json = JSON.parse(result)
            this.props.request.map((req) => {
              if (json['data'][req] === undefined || json['data'][req] === '') return

              let data = Buffer.from(json['data'][req], 'base64').toString('utf8')
              this.reqinfo[req] = data
            })
            if (this.props.callback) {
              this.props.callback(this.reqinfo)
            }
          }
        })
      })
      .on('error', (err) => {
        console.log('error', err)
      })
      .end()
  }

  render () {
    return (
      <div>
        {!this.state.trxRequestUri &&
          <center>
            Making QRcode through IPFS...
            <ReactLoading type='spin' color='#1DA57A' height='50px' width='50px' />
          </center>
        }
        {this.props.qrpopup ?
          this.state.trxRequestUri &&
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
              width: this.qrstyle['qrsize'],
              height: this.qrstyle['qrsize'],
              padding: this.qrstyle['qrpadding'],
              backgroundColor: 'white' }}>
            <div id={this.state.session} />
          </Popup>
          :
          <div id={this.state.session} />
        }
      </div>
    )
  }
}
