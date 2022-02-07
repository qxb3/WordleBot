const { MessageEmbed } = require('discord.js')
const { BrandingColors } = require('./constants')

const createEmbed = (color = BrandingColors.Primary) => {
  return new MessageEmbed().setColor(color)
}

module.exports = {
  createEmbed
}
