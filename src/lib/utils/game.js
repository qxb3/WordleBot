const { getEmojis } = require('./constants')

const randomWord = require('random-words')
const checkWord = require('check-word')('en')

const generateRandomWord = () => {
  const generate = () => {
    const word = randomWord({ maxLength: 5, exactly: 1, join: '' })
    if (word.length <= 4) {
      return generate()
    }

    return word
  }

  return generate()
}

const checkIfValidWord = (word) => {
  return checkWord.check(word)
}

const convertTable = (table) => {
  let string = ''

  table.forEach(row => {
    row.forEach(data => {
      const emoji = getEmojis().find(emoji => emoji.id === data)
      string += emoji.value
    })
    string += '\n'
  })

  return string
}

const updateTable = (table, index, data) => {
  table[index] = data
  return table
}

module.exports = {
  generateRandomWord,
  checkIfValidWord,
  convertTable,
  updateTable
}
