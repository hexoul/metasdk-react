const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
const ipfs = ipfsClient({ host: '15.164.64.229', port: 5001, protocol: 'http' })

export default ipfs
