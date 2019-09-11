const { Wechaty } = require('./../wechaty/dist/src')
const { PuppetPadplus } = require('wechaty-puppet-padplus')
const conf = require('./../config')
console.log(conf.token)
const puppet = new PuppetPadplus({
  token: conf.token // <-- place your token
})

bot = new Wechaty({
  puppet,
})

module.exports = bot