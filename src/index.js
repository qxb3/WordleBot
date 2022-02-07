const { SapphireClient } = require('@sapphire/framework')

require('module-alias/register')
require('dotenv').config()

const client = new SapphireClient({
  intents: [
    'GUILDS',
    'GUILD_MESSAGES'
  ],
  defaultPrefix: '!'
})

client.login(process.env.TOKEN)
