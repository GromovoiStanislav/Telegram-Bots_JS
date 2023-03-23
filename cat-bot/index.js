const { Telegraf } = require('telegraf');
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN);

const chatId = process.env.CHAT_ID;
const intervalMs = 5000;
const getCatUrl = () => `https://cataas.com/cat?t=${new Date().getTime()}`;

const sendCat = () => {
	bot.telegram.sendPhoto(chatId, getCatUrl()).then(() => setTimeout(sendCat, intervalMs));
	//можно заменить sendPhoto на sendMessage(chatId, "привет!") или любой другой метод из API.
	
	//Можно так же отправить фотографию, которая лежит локально.Например, если бы в проекте лежал файл cat.jpeg,
	// его можно было бы отправить, указав путь к нему: bot.telegram.sendPhoto(chatId, { source: 'cat.jpeg' }).
}

sendCat();

