const { MessageActionRow, MessageButton } = require('discord.js')

const { Command } = require('@sapphire/framework')

const { getTestServers, BrandingColors } = require('@utils/constants')
const { createEmbed } = require('@utils/responses')
const { generateRandomWord, checkIfValidWord, convertTable, updateTable } = require('@utils/game')

class PlayCommand extends Command {
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

    let tries = 0
    let win = false
    let canceled = false

    let counter = -1
    let table = [
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ]
    ]

    const user = interaction.user
    const clientUser = this.container.client.user

    const gameEmbed = createEmbed()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setDescription(convertTable(table))
      .setFooter({ text: clientUser.username, iconURL: clientUser.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()

    const actionRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setLabel('Cancel')
          .setStyle('DANGER')
          .setCustomId('cancel')
      )

    let gameMessage = await interaction.reply({
      embeds: [ gameEmbed ],
      components: [ actionRow ],
      fetchReply: true
    })

    const messageFilter = (message) => message.author.id === interaction.user.id
    const messageCollector = interaction.channel.createMessageCollector({
      filter: messageFilter,
      time: 1000 * 60 * 2
    })

    const buttonFilter = (buttonInteraction) => buttonInteraction.user.id === interaction.user.id
    const buttonCollector = gameMessage.createMessageComponentCollector({
      filter: buttonFilter,
      time: 1000 * 60 * 2
    })

    messageCollector.on('collect', async (message) => {
      const content = message.content.toLowerCase()

      if (content.length < 5 || content.length > 5) {
        return await interaction.followUp({ content: 'The word cannot be less than or higher than 5', ephemeral: true })
      }

      if (!checkIfValidWord(content)) {
        return await message.reply({
          content: `\`${content}\` is not a valid word`
        })
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

      gameMessage = await message.reply({
        embeds: [ gameEmbed ],
        components: [ actionRow ]
      })

      if (content === randomWord.join('')) {
        win = true
        messageCollector.stop()
      }

      if (counter >= 5) {
        messageCollector.stop()
      }
    })

    messageCollector.on('end', async (messages) => {
      gameEmbed.author.name += canceled ? ' (Canceled)' : ' (Ended)'
      gameEmbed.setColor(BrandingColors.Error)

      await gameMessage.edit({
        embeds: [ gameEmbed ]
      })

      if (messages.size === 0 && !canceled) {
        return await interaction.channel.send({
          content: `<@${user.id}> You didn\'t respond!`
        })
      }

      if (!canceled) {
        const resultEmbed = createEmbed()
          .setAuthor({ name: `${user.username} Result`, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setDescription(
            `${win ? 'You guessed it!\n' : 'You didn\'t guessed it\n'}` +
            `Tries: ${tries}\n` +
            `Word: ${randomWord.join('')}\n\n` +
            convertTable(table)
          )
          .setFooter({ text: clientUser.username, iconURL: clientUser.displayAvatarURL({ dynamic: true }) })
          .setTimestamp()
          .setColor(win ? BrandingColors.Success : BrandingColors.Error)

        await interaction.channel.send({ embeds: [ resultEmbed ] })
      }
    })

    buttonCollector.on('collect', async () => {
      actionRow.components[0].setDisabled(true)
      canceled = true

      await gameMessage.edit({
        embeds: [ gameEmbed ],
        components: [ actionRow ]
      })

      messageCollector.stop()
    })
  }
}

module.exports = PlayCommand
