import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import * as dotenv from 'dotenv';
dotenv.config();
import got from 'got';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(`Привет ${ctx.message.from.first_name}!
Я умею определять температуру. Скинь мне свою геолокацию`)
);
bot.on(message('text'), (ctx) => {
  ctx.reply('👍');
});

bot.on('message', async (ctx) => {
  if (ctx.message.location) {
    //location: { latitude: 42.827677, longitude: 74.620761 }
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=${process.env.API_KEY}`;
    const data = await got(url).json();
    ctx.reply(
      `${data.name}: ${data.main.temp}C - ${data.weather[0].description}`
    );
    return;
  }
  ctx.reply('👍');
});

bot.launch().then(() => console.log('Started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
