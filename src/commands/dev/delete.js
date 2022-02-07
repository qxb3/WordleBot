const { Collection } = require('discord.js')

const { Command } = require('@sapphire/framework')

const { getTestServers } = require('@utils/constants')
const { createEmbed } = require('@utils/responses')

class DeleteCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      description: 'Delete\'s a slash command',
      preconditions: ['DevOnly']
    })
  }

  async chatInputRun(interaction) {
    const commandName = interaction.options.getString('command')
    const option = interaction.options.getString('option')

    const { client } = this.container

    //Listing all of the commands
    if (!commandName && !option) {
      const globalCommands = await client.application.commands.fetch()
      let testServerCommands = new Collection()

      for (const id of getTestServers()) {
        const testCommands = await client.guilds.cache.get(id).commands.fetch()
        testServerCommands = testServerCommands.concat(testCommands)
      }

      const globalString = globalCommands.map((command) => `${command.name}: ${command.id}`).join('\n')
      const testServerString = testServerCommands.map((command) => `${command.name}: ${command.id}`).join('\n')

      const embed = createEmbed()
        .setTitle('Slash Commands')
        .setDescription(
          `Global commands:\n${globalCommands.size !== 0 ? globalString : 'None'}\n\n` +
          `Test Server Commands:\n${testServerCommands.size !== 0 ? testServerString : 'None'}`
        )

      return await interaction.reply({ embeds: [ embed ], ephemeral: true })
    }

    //Deleting the command
    if (commandName && option) {
      let commands = new Collection()
      if (option === 'global') {
        commands = await client.application.commands.fetch()
      } else {
        for (const id of getTestServers()) {
          commands = commands.concat(await client.guilds.cache.get(id).commands.fetch())
        }
      }

      const command = commands.get(commandName) || commands.find((cmd) => cmd.name === commandName)
      if (command) {
        await command.delete()
        await interaction.reply({ content: `Command: ${command.name} is deleted`, ephemeral: true })
      }
    }
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((builder) =>
          builder
            .setName('command')
            .setDescription('The command\'s name or id')
        )
        .addStringOption((builder) =>
          builder
            .setName('option')
            .setDescription('The delete options')
            .addChoices([
              ['Global', 'global'],
              ['Test Server', 'test']
            ])
        ),
      {
        guildIds: getTestServers(),
        idHints: ['940132852027228171'],
        behaviorWhenNotIdentical: 'OVERWRITE'
      }
    )
  }
}

module.exports = DeleteCommand
