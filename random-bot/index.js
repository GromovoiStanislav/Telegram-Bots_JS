const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getCoinSide = () => (getRandomInt(0, 1) === 0 ? 'Орёл' : 'Решка');

// const coinInlineKeyboard = Markup.inlineKeyboard([
//     Markup.button.callback('Подбросить ещё раз', 'flip_a_coin'),
// ]);

const coinInlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Подбросить ещё раз',
          callback_data: 'flip_a_coin',
        },
      ],
    ],
  },
};
bot.hears('Подбросить монетку', (ctx) =>
  ctx.reply(getCoinSide(), coinInlineKeyboard)
);
bot.action('flip_a_coin', async (ctx) => {
  await ctx.editMessageText(
    `${getCoinSide()}\nОтредактировано: ${new Date().toISOString()}`,
    coinInlineKeyboard
  );
});

const getRandomNumber = () => getRandomInt(0, 100);
// const numberInlineKeyboard = Markup.inlineKeyboard([
//     Markup.button.callback('Сгенерировать новое', 'random_number'),
// ]);
const numberInlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Новое число',
          callback_data: 'random_number',
        },
      ],
    ],
  },
};
bot.hears('Случайное число', (ctx) =>
  ctx.reply(getRandomNumber().toString(), numberInlineKeyboard)
);
bot.action('random_number', async (ctx) => {
  await ctx.editMessageText(
    `${getRandomNumber()}\nОтредактировано: ${new Date().toISOString()}`,
    numberInlineKeyboard
  );
});

bot.use(async (ctx) => {
  // const startKeyboard = Markup.keyboard([
  //     ['Подбросить монетку', 'Случайное число'],
  // ]).resize()
  const startKeyboard = {
    reply_markup: {
      keyboard: [['Подбросить монетку', 'Случайное число']],
      resize_keyboard: true,
    },
  };
  await ctx.reply('Что нужно сделать?', startKeyboard);
});

bot.launch().then(() => console.log('Started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
