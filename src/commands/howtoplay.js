const { MessageActionRow, MessageButton } = require('discord.js')
const { Command } = require('@sapphire/framework')

const { getTestServers, getEmojis } = require('@utils/constants')
const { createEmbed } = require('@utils/responses')

class HowToPlayCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      description: 'Helps to play the wordle game',
      chatInputCommand: {
        register: true,
        //guildIds: getTestServers(),
        idHints: ['940138284305248276'],
        behaviorWhenNotIdentical: 'OVERWRITE'
      }
    })
  }

  async chatInputRun(interaction) {
    const emojis = getEmojis()

    const embed = createEmbed()
      .setTitle('How to play')
      .setDescription(
`
Use command \`/play\` to get started

Guess the WORDLE in 6 tries.
Each guess must be a valid 5 letter wor.
After each guess, the color of the tiles will change to show how close your guess was to the word.

${emojis[0].value} - A blank tile
${emojis[1].value} - The letter is not in the random word
${emojis[2].value} - The letter is **in** the random word but **not** in the correct spot
${emojis[3].value} - The letter is **in** the random word and **in** the correct spot
`
      )
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()
      .setImage('attachment://examples.png')

    const actionRow = new MessageActionRow()
      .setComponents(
        new MessageButton()
          .setLabel('Support Server')
          .setURL('https://discord.gg/aAqzzYM9A4')
          .setStyle('LINK')
      )

    await interaction.reply({
      embeds: [ embed ],
      files: ['assets/examples.png'],
      components: [ actionRow ]
    })
  }
}

module.exports = HowToPlayCommand
