const bot = require('./baseBot')

const test = async function () {
  await bot.on('scan', (qrcode, status) => {
    console.log(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`)
  })
    .on('login', async user => {
      // const contact1 = await bot.Contact.find({ name: '斩月' })
      // const contact2 = await bot.Contact.find({ name: '人在江湖漂' })
      const contacts = await bot.Contact.findAll()
      // const personalContacts = contacts.filter(contact => contact.type() === bot.Contact.Type.Personal)
      // if (personalContacts.length < 3) {
      //   console.log(`insufficiate members to test room create, the minimum contacts is four.`)
      // } else {
      //   const [contact1, contact2] = personalContacts
      //   console.log(contact1.name(), contact2.name())
      //   const room = await bot.Room.create([contact1, contact2], 'test')
      //   await room.say('hello')  
      // }
    })
    .start()

}

test()

