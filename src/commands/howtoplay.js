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

  chatInputRun(interaction) {
    const embed = createEmbed()
      .setTitle('How to play')
      .setDescription(
`
Use command \`/play\` to get started

Guess the WORDLE in 6 tries.
Each guess must be a valid 5 letter word. Hit the enter button to submit.
After each guess, the color of the tiles will change to show how close your guess was to the word.
`
      )
      .setImage('attachment://examples.png')

    interaction.reply({
      embeds: [ embed ],
      files: ['assets/examples.png']
    })
  }
}

module.exports = HowToPlayCommand
