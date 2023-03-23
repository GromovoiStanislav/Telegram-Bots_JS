const { Telegraf } = require('telegraf');
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN);



const middleware1 = (ctx, next) => {
	console.log('middleware1');
	next();
};
const middleware2 = async (ctx, next) => {
	console.log('middleware2');
	await ctx.reply(JSON.stringify(ctx.update, null, 2));
	//next()
};
const middleware3 = async (ctx, next) => {
	console.log('middleware3');
	//await ctx.telegram.sendMessage(chat_id, `Hello`) //можно отправить сообщение в произвольный чат.
};

bot.use(middleware1);
bot.use(middleware2);
bot.use(middleware3);



bot.launch().then(() => console.log('Started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));