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
})
.on('message', message => {
  if (message.text() === 'runme') {
    const miniProgramPayload = new MiniProgram ({
      username           : 'gh_beaec24a0c9d', 
      appid              : '',             
      title              : 'DNA LobbyHobby',
      pagepath           : 'pages/vip-index/vip-index.html',
      description        : 'DNA LobbyHobby',
      thumbnailurl       : '30580201000451304f0201000204a897175902033d11fd0204b1e2e26502045d6df318042a777875706c6f61645f777869645f72686c6675676d373276667431323231335f313536373438363734340204010400030201000400',               //optional
    })
    bot.say(miniProgramPayload)
  }
})
.start()
