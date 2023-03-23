const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN);


bot.command('help', (ctx) => {
	ctx.reply(`
    Бот может здороваться на разных языках.
    Список поддерживаемых приветствий:
    - привет - русский
    - hello - английский
	- bonjour - французский
    - hola - испанский
    `);
});

bot.hears('привет', (ctx) => ctx.reply('привет'));
bot.hears('hello', (ctx) => ctx.reply('hello'));
bot.hears('hola', (ctx) => ctx.reply('hola'));
bot.hears('bonjour', (ctx) => ctx.reply('bonjour'));

//bot.on('text', (ctx) => ctx.reply(`Приветствие "${ctx.update.message.text}" не поддерживается.`))
bot.on(message("text"), (ctx) => ctx.reply(`Приветствие "${ctx.update.message.text}" не поддерживается.`))

bot.launch().then(() => console.log('Started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));