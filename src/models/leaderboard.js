const { Schema, models, model } = require('mongoose')
const { requiredString, requiredInteger } = require('@utils/mongoose')

const schema = new Schema({
  _id: requiredString,
  guildId: requiredString,
  userId: requiredString,
  points: requiredInteger
})

const name = 'leadearboard'
module.exports = models[name] || model(name, schema)
