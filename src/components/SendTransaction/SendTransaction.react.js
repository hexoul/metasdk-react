import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import PropTypes from 'prop-types'
import { Button, Popup } from 'semantic-ui-react'

import * as util from '../util'
import ipfs from '../ipfs'

var https = require('https')

export default class SendTransaction extends Component {
  static propTypes = {
    request: PropTypes.any,
    to: PropTypes.string,
    value: PropTypes.string,
    data: PropTypes.string,
    usage: PropTypes.string,
    callback: PropTypes.func,
    callbackUrl: PropTypes.string,
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
    this.state = {
      session: util.makeSessionID(),
      trxRequestUri: '',
      qrCode: false
    }
  }

  componentWillMount () {
    util.setQRstyle(this.qrstyle, this.props, 'SendTransaction')
  }

  componentDidMount () {
    // URI for transaction
    this.baseRequestUri = 'meta://transaction?t='

    if (this.props.request !== undefined && this.props.request !== '') {
      // URI for request
      this.baseRequestUri += this.props.request.params[0].to + '&v=' + this.props.request.params[0].value + '&d=' + this.props.request.params[0].data
    } else if (this.props.to !== undefined && this.props.to !== '') {
      // URI for to, value and data
      this.baseRequestUri += this.props.to + '&v=' + util.convertVal2Hexd(this.props.value) + '&d=' + util.convertData2Hexd(this.props.data)
    }
    // URI for usage
    this.baseRequestUri += '&u=' + this.props.usage

    // URI for callback
    if (this.props.callbackUrl) this.baseRequestUri += '&callback=' + encodeURIComponent(this.props.callbackUrl)
    else this.baseRequestUri += '&callback=https%3A%2F%2F' + util.CacheServer.host + '/' + util.CacheServer.stage + '?key=' + this.state.session

    var cb = (uri) => this.setState({ trxRequestUri: uri }, () => {
      if (!this.props.qrpopup) util.loadQrCode(this.state.session, uri, this.qrstyle['qrsize'], () => this.setState({ qrCode: true }))
    })
    ipfs.add([Buffer.from(this.baseRequestUri)], (err, ipfsHash) => {
      if (!err) {
        console.log('SendTransaction IPFS hash:', ipfsHash[0].hash)
        cb(ipfsHash[0].hash)
      } else cb(this.baseRequestUri)
    })
  }

  onOpenSendTransaction () {
    if (!this.qrstyle.qrpopup) return

    window.setTimeout(() => util.loadQrCode(this.state.session, this.state.trxRequestUri, this.qrstyle['qrsize'], () => this.setState({ qrCode: true })), 500)

    this.interval = setInterval(() => {
      this.checkResponse()
    }, 2000)
  }

  onCloseSendTransaction () {
    if (!this.qrstyle.qrpopup) return

    clearInterval(this.interval)
  }

  checkResponse () {
    // TxID check
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
            var json = JSON.parse(data)
            if (this.props.callback) {
              this.props.callback({
                txid: json['txid'],
                address: json['address']
              })
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
            onOpen={() => this.onOpenSendTransaction()}
            onClose={() => this.onCloseSendTransaction()}
            verticalOffset={this.qrstyle['qrvoffset']}
            position={this.qrstyle['qrposition']}
            style={{
              width: this.qrstyle['qrsize'],
              height: this.qrstyle['qrsize'],
              padding: this.qrstyle['qrpadding'],
              backgroundColor: 'white' }}
          >
            <div id={this.state.session} />
          </Popup>
          :
          <div id={this.state.session} />
        }
      </div>
    )
  }
}
