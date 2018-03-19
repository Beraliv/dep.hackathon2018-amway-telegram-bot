# dep.hackathon2018-amway-telegram-bot

Telegram Bot server:

- Node
- Node Telegram Bot API
- Express
- Axios

[Link to the telegram bot](http://t.me/dep_hackathon2018_amway_bot)

## Flow

Cycle of a bot is following:

- Write `/start` to start working with a bot
  - Which room are you in?
  - What do you want to do?
- Write `/get` to get the latest information from Arduino devices

## Conversation with `/start`

**You**
```
/start
```

**dep.hackathon2018-amway-telegram-bot**
```
Hi, Alexey! Which room are you in?
```

**You** (on keyboard choose a room `743`)

![Stage 1](https://github.com/Beraliv/dep.hackathon2018-amway-telegram-bot/blob/master/images/tg-bot-stage-1.png)

**dep.hackathon2018-amway-telegram-bot**
```
Alexey, what do you want to do?
```

**You** (on keyboard choose `Open window`)

![Stage 2](https://github.com/Beraliv/dep.hackathon2018-amway-telegram-bot/blob/master/images/tg-bot-stage-2.png)

## Conversation with `/get`

**You**
```
/get
```

**dep.hackathon2018-amway-telegram-bot**
```
In room 743
  temperature (t): 23°C
  carbon dioxide content (CO2): 620ppm
  luminosity (L): 330lm
```

## Found extreme value

If extreme value is found (i.e. too high temperature), extreme value is sent

![Extreme message](https://github.com/Beraliv/dep.hackathon2018-amway-telegram-bot/blob/master/images/tg-bot-extreme.png)

## Help

![Help](https://github.com/Beraliv/dep.hackathon2018-amway-telegram-bot/blob/master/images/tg-bot-help.png)

## Other parts of the project

- [API server](https://github.com/IgorKonovalov/dep.hackaton2018_api_server)
	- Node
	- Express
	- Mongo DB
	- Socket IO
- [Dashboard](https://github.com/OksanaFirtych/dep.hackatop2018_dashboard)
	- React
	- Recharts
	- Socket IO
- [Controller API server](https://github.com/alexeyMohnatkin/dep.hackaton2018_controller)
	- Arduino
	- Node
	- Express
	- Johnny Five
	
## Code owners

Developers:

- [Alexey Berezin](https://github.com/Beraliv)
- [Alexey Mohnatkin](https://github.com/alexeyMohnatkin)
- [Igor Konovalov](https://github.com/IgorKonovalov)
- [Oksana Firtych](https://github.com/OksanaFirtych)

Quality Assurance:

- Iuliia Rukavishnikova
