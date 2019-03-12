'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://www.lyh.red"',
  fileHost: '"http://10.61.16.187:7009"',
  socketURL: '"http://10.61.16.181:3000"'
})
