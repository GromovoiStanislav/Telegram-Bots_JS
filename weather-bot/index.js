const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config()
const axios = require('axios');


const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name}!
Я умею определять температуру. Скинь мне свою геолокацию`));
bot.on(message('text'), (ctx) => {
	ctx.reply('👍')
});

bot.on("message", async (ctx) => {
	if (ctx.message.location) {
		//location: { latitude: 42.827677, longitude: 74.620761 }
		const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=${process.env.API_KEY}`
		const res = await axios.get(url)
		ctx.reply(`${res.data.name}: ${res.data.main.temp}C - ${res.data.weather[0].description}`)
		return
	}
	ctx.reply('👍')
});


bot.launch().then(() => console.log('Started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));