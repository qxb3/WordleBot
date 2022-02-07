const { Command } = require('@sapphire/framework')

class PingCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      description: 'Get the bot\'s latency',
      chatInputCommand: {
        register: true,
        idHints: ['940083596935458867'],
        behaviorWhenNotIdentical: 'OVERWRITE'
      }
    })
  }

  async chatInputRun(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true })
    const ping = sent.createdTimestamp - interaction.createdTimestamp
    sent.edit(`Pong! That took ${ping}ms. Latency: ${this.container.client.ws.ping}`)
  }
}

module.exports = PingCommand
