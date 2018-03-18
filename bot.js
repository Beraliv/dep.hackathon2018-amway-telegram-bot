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
    ['t↑ (холодно)', 't↓ (жарко)'],
    ['CO2↑ (свежо)', 'CO2↓ (душно)'],
    ['L↑ (темно)', 'L↓ (светло)'],
  ]
  const flattenActions = flatMap(actions)
  const contractions = flattenActions.reduce((acc, choice) => {
    const contraction = flattenActions.indexOf(choice) % 2 === 0
      ? 'повысить'
      : 'понизить'
    const subject = choice.slice(0, 1) === 't'
      ? 'температуру'
      : choice.slice(0, 1) === 'L'
        ? 'яркость света'
        : 'содержание углекислого газа'

    acc[choice] = [contraction, subject].join(' ')
    return acc
  }, {})

  bot.onText(/start/, (msg) => {
    const name = msg.from.first_name
    const id = msg.chat.id

    bot.sendMessage(id, `Привет, ${name}! В какой комнате ты находишься?`, {
      reply_markup: {
        keyboard: rooms,
        one_time_keyboard: true
      }
    })
  })

  bot.onText(/give/, async (msg) => {
    const roomId = 743;
    const id = msg.chat.id
    let currentData
    await axios.get('http://10.66.168.97:8030/data/latest/743')
      .then(response => {
        currentData = response.data
      })
      .catch(error => console.log('some error', error))
    
    bot.sendMessage(id, `Прямо сейчас в комнате "${roomId}": температура ${currentData.tmp}, содержание CO2 ${currentData.co2}, и яркость света ${currentData.light}`);
  });

  bot.onText(answerFrom(rooms), (msg) => {
    const name = msg.from.first_name
    const id = msg.chat.id

    // which room
    state[id] = {
      room: msg.text
    }

    bot.sendMessage(id, `${name}, что ты хочешь сделать?`, {
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

    bot.sendMessage(id, `${name}, я понял, в ${state[id].room} комнате нужно ${contractions[msg.text]}`)
  })
}

module.exports = {
  token,
  getBot 
};
