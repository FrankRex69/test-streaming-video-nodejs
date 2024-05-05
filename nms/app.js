const NodeMediaServer = require('node-media-server');
const fs = require("fs");
 
const config = {
  rtmp: {
    port: 1941,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8015,
    allow_origin: '*'
  },
  // https: {
  //   port: 8471,    
  //   key: '/etc/letsencrypt/live/www.chop.click/privkey.pem',
  //   cert: '/etc/letsencrypt/live/www.chop.click/cert.pem'
  //   }
};
 
var nms = new NodeMediaServer(config)
nms.run();