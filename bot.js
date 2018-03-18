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
    ['Open window', 'Close window'],
    ['Turn on light', 'Turn off light'],
  ]
  const contractions = {
    'Open window': 'openWindow',
    'Close window': 'closeWindow',
    'Turn on light': 'lowLight',
    'Turn off light': 'highLight'
  };
  const contractionTexts = {
    'Open window': {
      do: 'Window is opened',
      undo: 'Window isn\'t opened'
    },
    'Close window': {
      do: 'Window is closed',
      undo: 'Window isn\'t closed'
    },
    'Turn on light': {
      do: 'Light is on',
      undo: 'Light isn\'t on'
    },
    'Turn off light': {
      do: 'Light is off',
      undo: 'Light isn\'t off'
    }
  };
  const roomIds = []

  const addRoomIfAbsent = (rooms, roomId) => {
    if (!rooms.includes(roomId)) {
      rooms.push(roomId)
    }
  }

  bot.onText(/start/, (msg) => {
    const name = msg.from.first_name
    const id = msg.chat.id
    addRoomIfAbsent(roomIds, id)

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
    addRoomIfAbsent(roomIds, id)

    try {
      const { data: [{ tmp, co2, light }] } = await axios.get('http://10.66.170.54:8030/data/latest/743');
      if (!tmp || !co2 || !light) {
        throw new Error('Data is not fully initialized error');
      }

      const str = `In room ${roomId}\n`
        + `Temperature: ${tmp}°C\n`
        + `CO2 content: ${co2}ppm\n`
        + `Luminosity: ${light}lm`;

      bot.sendMessage(id, str);
    } catch (error) {
      console.log('Latest data is not available', error)
      bot.sendMessage(id, 'Latest data is not available');
    }
  });

  bot.onText(answerFrom(rooms), (msg) => {
    const name = msg.from.first_name
    const id = msg.chat.id
    addRoomIfAbsent(roomIds, id)

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

  bot.onText(answerFrom(actions), async (msg) => {
    const name = msg.from.first_name
    const id = msg.chat.id
    addRoomIfAbsent(roomIds, id)

    // which action
    state[id].action = msg.text

    console.log(`Action is sent: ${contractions[msg.text]}`)

    // send event for triggering to server
    try {
      const response = await axios.post('http://10.66.170.54:8030/action/743', {
        action: contractions[msg.text]
      });
      bot.sendMessage(id, contractionTexts[msg.text].do);
    } catch (error) {
      console.log(contractionTexts[msg.text].do, error)
      bot.sendMessage(id, contractionTexts[msg.text].undo);
    }
  })

  app.post('/extreme', (req, res) => {
    const {
      conditions: {
        id,
        minComfortValue,
        maxComfortValue,
        measure
      },
      value
    } = req.body.data;

    const result = minComfortValue > value
      ? `too low`
      : `too high`;

    if (roomIds.length) {
      roomIds.forEach(roomId => {
        const str = `${id}\n`
          + `${value} is ${result}\n`
          + 'Use **\/start** to choose action';

        bot.sendMessage(roomId, str)
      })
      
      res.status(200).send('Extreme values are sent to all rooms');
    }

    res.status(200).send('Extreme values aren\'t sent (no recipients found)');
  })
}

module.exports = {
  token,
  getBot
};
