require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const sequelize = require('./db');
const UserModel = require('./models');
const { gameOptions, againOptions } = require('./options');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю цифру от 1 до 10, а ты должен её угадать! ☝`
  );

  chats[chatId] = {
    data: Math.ceil(Math.random() * 10),
    attempts: 2,
  };

  await bot.sendMessage(chatId, 'У тебя 3 попытки! 😼', gameOptions);
};

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log('Подключение к бд сломалось', e);
  }

  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Игра угадай цифру' },
  ]);

  bot.on('message', async (msg) => {
    const chatId = String(msg.chat.id);
    const text = msg.text;

    try {
      if (text === '/start') {
        await UserModel.findOrCreate({ where: { chatId } });
        await bot.sendSticker(
          chatId,
          'https://chpic.su/_data/stickers/b/biscuit_no_text/biscuit_no_text_001.webp'
        );
        return bot.sendMessage(chatId, 'Добро пожаловать в мой телеграм! 😸');
      }

      if (text === '/info') {
        const user = await UserModel.findOne({ where: { chatId } });
        if (!user) {
          return bot.sendMessage(chatId, `Сначала зарегистрируйся (/start))`);
        }
        return bot.sendMessage(
          chatId,
          `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}. В игре у тебя правильных ответов ${user.right}, неправильных ${user.wrong}`
        );
      }

      if (text === '/game') {
        const user = await UserModel.findOne({ where: { chatId } });
        if (!user) {
          return bot.sendMessage(chatId, `Сначала зарегистрируйся (/start))`);
        }
        return startGame(chatId);
      }

      await bot.sendSticker(
        chatId,
        'https://chpic.su/_data/stickers/b/biscuit_no_text/biscuit_no_text_015.webp'
      );
      return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');
    } catch (e) {
      return bot.sendMessage(chatId, 'Произошла какая то ошибочка! 😿');
    }
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = String(msg.message.chat.id);

    if (data === '/again') {
      return startGame(chatId);
    }

    if (!chats[chatId]) {
      return;
    }

    if (data == chats[chatId].data) {
      await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId].data} 👏😸`,
        againOptions
      );
      delete chats[chatId];
      const user = await UserModel.findOne({ where: { chatId } });
      user.right += 1;
      await user.save();
    } else if (chats[chatId].attempts) {
      await bot.sendMessage(
        chatId,
        `Ты не угадал. У тебя ${chats[chatId].attempts} ${
          chats[chatId].attempts === 1 ? 'попытка' : 'попытки'
        } 🙀`
      );
      chats[chatId].attempts--;
    } else {
      await bot.sendMessage(
        chatId,
        `К сожалению ты не угадал. Я загадал цифру ${chats[chatId].data} 😾`,
        againOptions
      );
      delete chats[chatId];
      const user = await UserModel.findOne({ where: { chatId } });
      user.wrong += 1;
      await user.save();
    }
  });
};

start();
