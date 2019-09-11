const { Wechaty, Contact } = require('wechaty')
const { PuppetPadplus } = require('wechaty-puppet-padplus')
const conf = require('./../config')

const puppet = new PuppetPadplus({
  token: conf.token // <-- place your token
})

bot = new Wechaty({
  puppet,
})

bot.on('scan', (qrcode, status) => {
  console.log(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
}).on('message', message => {
  const aFriend = '人在江湖漂'
  if (message.from().name() === aFriend && !message.room()) {
    console.log(message)
    const wechatId = message.from().id
    console.log(`${aFriend} is sending me a message, his wechat id is: **${wechatId}**,trying to search him in my contact list`)
    bot.Contact.findAll({name: aFriend}).then(friend => {
      if (friend.length > 0) {
        console.log(`his wechat id in my contact list is: **${friend[0]['id']}**`)
      } else {
        console.log(`something goes wrong.....`)
      }
    })
  }
})
.start()
