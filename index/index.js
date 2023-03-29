const { Telegraf } = require('telegraf');
const axios = require('axios');
const fs = require('fs');

const bot = new Telegraf('5914997513:AAEqn-IoXIQ5tpxKIHfU6a6AAVoWcF0ppQw');

// Handler para el comando /start
bot.start((ctx) => ctx.reply('¡Hola! Envíame el video que deseas descargar.'));

// Handler para el comando /help
bot.help((ctx) => ctx.reply('Envía un video para descargarlo.'));

// Handler para mensajes de video
bot.on('video', async (ctx) => {
  const video = ctx.message.video;

  try {
    // Descargar el video usando axios
    const response = await axios({
      method: 'GET',
      url: `https://api.telegram.org/file/bot${bot.token}/${video.file_id}`,
      responseType: 'stream',
    });

    // Guardar el video en el sistema de archivos
    const videoPath = `./${video.file_unique_id}.mp4`;
    response.data.pipe(fs.createWriteStream(videoPath));

    // Responder al usuario con un mensaje de éxito y el archivo de video
    ctx.replyWithVideo({ source: videoPath }, { caption: '¡Video descargado con éxito!' });
  } catch (error) {
    console.log(error);
    ctx.reply('Ocurrió un error al descargar el video. Por favor, inténtalo de nuevo más tarde.');
  }
});

bot.launch();
