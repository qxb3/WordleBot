const { Command } = require('@sapphire/framework')

const { getTestServers, BrandingColors } = require('@utils/constants')
const { createEmbed } = require('@utils/responses')
const { generateRandomWord, checkIfValidWord, convertTable, updateTable } = require('@utils/game')

class StartCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      description: 'Play a game of wordle',
      chatInputCommand: {
        register: true,
        //guildIds: getTestServers(),
        idHints: ['940134238055960586'],
        behaviorWhenNotIdentical: 'OVERWRITE'
      }
    })
  }

  async chatInputRun(interaction) {
    const randomWord = generateRandomWord().split('')

    let counter = -1
    let table = [
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ]
    ]
    let tries = 0
    let win = false

    console.log(randomWord.join(''))

    const user = interaction.user
    const clientUser = this.container.client.user

    const gameEmbed = createEmbed()
      .setAuthor({ name: `${user.username} - ${clientUser.username}`, iconURL:user.displayAvatarURL({ dynamic: true }) })
      .setDescription(convertTable(table))
      .setFooter({ text: clientUser.username, iconURL: this.container.client.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()

    const gameMessage = await interaction.reply({ embeds: [ gameEmbed ], fetchReply: true })
    const filter = (message) => message.author.id === interaction.user.id
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 1000 * 60 * 5
    })

    collector.on('collect', async (message) => {
      const content = message.content.toLowerCase()

      if (content.length < 5 || content.length > 5) {
        return await interaction.followUp({ content: 'The word cannot be less than or higher than 5', ephemeral: true })
      }

      const currentTable = table[++counter]

      for (let i = 0; i < randomWord.length; i++) {
        const letter = randomWord[i]
        const splittedContent = content.split('')

        if (letter === splittedContent[i]) {
          currentTable[i] = 3
          continue
        } else if (letter !== splittedContent[i] && randomWord.includes(splittedContent[i])) {
          currentTable[i] = 2
          continue
        } else if (!randomWord.includes(splittedContent[i])) {
          currentTable[i] = 1
          continue
        }
      }

      tries++

      table = updateTable(table, counter, currentTable)
      gameEmbed.setDescription(convertTable(table))

      await gameMessage.edit({ embeds: [ gameEmbed ] })

      if (!checkIfValidWord(content)) {
        return await interaction.followUp({ content: `\`${content}\` is not a valid word`, ephemeral: true })
      }

      if (content === randomWord.join('')) {
        win = true
        collector.stop()
      }

      if (counter >= 4) {
        collector.stop()
      }
    })


    collector.on('end', async (messages) => {
      gameEmbed.author.name += ' (Ended)'
      gameEmbed.setColor(BrandingColors.Error)

      if (messages.size === 0) {
        return await interaction.followUp({ content: 'You didn\'t respond!', ephemeral: true })
      }

      const resultEmbed = createEmbed()
        .setAuthor({ name: `${user.username} Result`, iconURL:user.displayAvatarURL({ dynamic: true }) })
        .setDescription(
          `${win === true ? 'You guessed it!\n' : 'You didn\'t guessed it :(\n'}` +
          `Tries: ${tries}\n` +
          `Word: ${randomWord.join('')}\n\n` +
          convertTable(table)
        )
        .setFooter({ text: clientUser.username, iconURL: this.container.client.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()
        .setColor(win === true ? BrandingColors.Success : BrandingColors.Error)

      await interaction.followUp({ embeds: [ resultEmbed ] })
    })
  }
}

module.exports = StartCommand
