const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api')

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

const flatMap = arr => arr.reduce(
  (acc, arr) => [...acc, ...arr],
  []
)

const token = process.env.TOKEN

const getBot = (app) => {
  const bot = new TelegramBot(token, { polling: true })

  console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

  const answerFrom = keyboard => RegExp(`^(${flatMap(keyboard).map(choice => escapeRegExp(choice)).join('|')})$`)

  const state = {}
  const rooms = [['743']]
  const actions = [
    ['t↑ (cold)', 't↓ (hot)'],
    ['CO2↑ (fresh)', 'CO2↓ (airless)'],
    ['L↑ (dark)', 'L↓ (light)'],
  ]
  const flattenActions = flatMap(actions)
  const contractions = flattenActions.reduce((acc, choice) => {
    const contraction = flattenActions.indexOf(choice) % 2 === 0
      ? 'increase'
      : 'descrease'
    const subject = choice.slice(0, 1) === 't'
      ? 'temperature'
      : choice.slice(0, 1) === 'L'
        ? 'luminosity'
        : 'carbon dioxide content'

    acc[choice] = [contraction, subject].join(' ')
    return acc
  }, {})

  bot.onText(/start/, (msg) => {
    const name = msg.from.first_name
    const id = msg.chat.id

    bot.sendMessage(id, `Hi, ${name}! Which room are you in?`, {
      reply_markup: {
        keyboard: rooms,
        one_time_keyboard: true
      }
    })
  })

  bot.onText(/get/, async (msg) => {
    const roomId = 743;
    const id = msg.chat.id
    let currentData
    await axios.get('http://10.66.168.97:8030/data/latest/743')
      .then(response => {
        currentData = response.data
      })
      .catch(error => console.log('some error', error))
    
    bot.sendMessage(id, `
      In room ${roomId}
      temperature (t): ${currentData.tmp}°C
      carbon dioxide content (CO2): ${currentData.co2}ppm
      luminosity (L): ${currentData.light}lm
    `);
  });

  bot.onText(answerFrom(rooms), (msg) => {
    const name = msg.from.first_name
    const id = msg.chat.id

    // which room
    state[id] = {
      room: msg.text
    }

    bot.sendMessage(id, `${name}, what do you want to do?`, {
      reply_markup: {
        keyboard: actions,
        one_time_keyboard: true
      }
    })
  })

  bot.onText(answerFrom(actions), (msg) => {
    const name = msg.from.first_name
    const id = msg.chat.id

    // which action
    state[id].action = msg.text

    bot.sendMessage(id, `${name}, I got it, in room ${state[id].room} it's need to ${contractions[msg.text]}`)
  })
}

module.exports = {
  token,
  getBot 
};
