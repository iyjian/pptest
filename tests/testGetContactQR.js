const { Wechaty, MiniProgram } = require('wechaty')
const { PuppetMacpro } = require('wechaty-puppet-macpro')
const conf = require('./../config')

const puppet = new PuppetMacpro({
  token: conf.token // <-- place your token
})

bot = new Wechaty({
  puppet,
})

bot.on('scan', (qrcode, status) => {
  console.log(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
}).on('login', contactSelf => {
  contactSelf.qrcode().then(console.log)
})
.start()
