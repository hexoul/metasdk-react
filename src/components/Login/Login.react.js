import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import PropTypes from 'prop-types'
import { Button, Popup } from 'semantic-ui-react'

import * as util from '../util'
import ipfs from '../ipfs'

import { qrcode, modes, ecLevel } from 'qrcode.es'
var qrCodeOptions = {
  size: 256,
  // ecLevel: ecLevel.QUARTILE,
  ecLevel: ecLevel.LOW,
  minVersion: 8,
  background: '#fff',
  mode: modes.DRAW_WITH_IMAGE_BOX,
  radius: 0.0,
  image: 'https://raw.githubusercontent.com/METADIUM/metadium-token-contract/master/misc/Metadium_Logo_Vertical_PNG.png',
  mSize: 0.15,
}

var QRCode = require('qrcode.react')
var https = require('https')

export default class Login extends Component {
  static propTypes = {
    data: PropTypes.string,
    service: PropTypes.string,
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

  constructor (props) {
    super(props)
    this.state = {
      session: util.makeSessionID(),
      trxRequestUri: '',
      qrCode: false
    }
  }

  componentWillMount () {
    util.setQRstyle(this.qrstyle, this.props, 'Login')
    qrCodeOptions.size = this.qrstyle['qrsize']
  }

  async loadQrCode(uri) {
    // Element must be an instance of HTMLCanvasElement or HTMLDivElement
    let element = document.getElementById(this.state.session)
    if (!element) return
    // Initializing the QrCode
    const qrCode = new qrcode(element)
    // Function that generates the QrCode
    qrCode.generate(uri, qrCodeOptions).then(() => this.setState({ qrCode: true }))
  }

  componentDidMount () {
    // URI for service
    this.baseRequestUri = 'meta://authentication?usage=login&service=' + this.props.service

    // URI for callback
    if (this.props.callbackUrl) this.baseRequestUri += '&callback=' + encodeURIComponent(this.props.callbackUrl)
    else this.baseRequestUri += '&callback=https%3A%2F%2F' + util.CacheServer.host + '/' + util.CacheServer.stage + '?key=' + this.state.session

    var cb = (uri) => this.setState({ trxRequestUri: uri }, () => { if (!this.props.qrpopup) this.loadQrCode(uri) })
    ipfs.add([Buffer.from(this.baseRequestUri)], (err, ipfsHash) => {
      if (!err) {
        console.log('IPFS hash:', ipfsHash[0].hash)
        cb(ipfsHash[0].hash)
      } else cb(this.baseRequestUri)
    })
  }

  onOpenLogin () {
    if (!this.qrstyle.qrpopup) return

    window.setTimeout(() => this.loadQrCode(this.state.trxRequestUri), 500)

    this.interval = setInterval(() => {
      this.checkResponse()
    }, 2000)
  }

  onCloseLogin () {
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
            var json = JSON.parse(data)
            if (this.props.callback) {
              this.props.callback({
                data: json['data'],
                signature: json['signature'],
                metaId: json['meta_id']
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
            onOpen={() => this.onOpenLogin()}
            onClose={() => this.onCloseLogin()}
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
