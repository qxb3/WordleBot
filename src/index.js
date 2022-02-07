const { SapphireClient } = require('@sapphire/framework')

const mongoose = require('mongoose')

require('module-alias/register')
require('dotenv').config()

const client = new SapphireClient({
  intents: [
    'GUILDS',
    'GUILD_MESSAGES'
  ]
})

const connectMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      keepAlive: true
    })
    client.logger.info('Mongodb is successfuly connected.')
  } catch(err) {
    client.logger.error(err)
  }
}

connectMongoose()


client.login(process.env.TOKEN)
