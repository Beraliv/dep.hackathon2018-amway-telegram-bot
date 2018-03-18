# dep.hackathon2018-amway-telegram-bot

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

**You** (on keyboard choose `t↓ (hot)`)
![Stage 2](https://github.com/Beraliv/dep.hackathon2018-amway-telegram-bot/blob/master/images/tg-bot-stage-2.png)

**dep.hackathon2018-amway-telegram-bot**
```
Alexey, I got it, in room 743 it's need to descrease temperature
```

## Answer to `/get`

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