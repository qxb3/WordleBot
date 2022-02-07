const { Precondition } = require('@sapphire/framework')

const { getDevIds } = require('@utils/constants')

class DevOnlyPrecondition extends Precondition {
  chatInputRun(interaction) {
    return getDevIds().includes(interaction.user.id) ?
      this.ok() :
      this.error({ message: 'Only the bot developer can run this command!' })
  }
}

module.exports = DevOnlyPrecondition
