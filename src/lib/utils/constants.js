const { Constants } = require('discord.js')

const BrandingColors = {
  Primary: Constants.Colors.BLUE,
  Secondary: Constants.Colors.PURPLE,
  Error: Constants.Colors.RED,
  Success: Constants.Colors.GREEN
}

const getTestServers = () => {
  return [
    '917358098241445909',
    '940275573916315689'
  ]
}

const getDevIds = () => {
  return [
    '591150858830479381'
  ]
}

const getEmojis = () => {
  return [
    { id: 0, value: ':white_large_square:' },
    { id: 1, value: ':black_large_square:' },
    { id: 2, value: ':yellow_square:' },
    { id: 3, value: ':green_square:' }
  ]
}

module.exports = {
  BrandingColors,
  getTestServers,
  getDevIds,
  getEmojis
}
