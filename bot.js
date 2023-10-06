const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('6441758875:AAHGe6hnJx9S_oAZTKLcm56oXykot3uc9g4')
bot.start((ctx)=>{
    ctx.reply(`Hola ${ctx.message.chat.first_name} ${ctx.message.chat.last_name}, bienvenido a tu asistente virtual. Que deseas buscar hoy?`);
})

bot.hears(/hola/i, (ctx)=>{
    ctx.reply(`Hola ${ctx.message.chat.first_name} ${ctx.message.chat.last_name}, un gusto en saludarte. Soy tu asistente virtual. Que deseas buscar hoy?`);
})


bot.hears(/acetaminofen/i, (ctx)=>{
    const text = ctx.message.text.toLowerCase();
    ctx.reply(`Su solicitud a sido:  ${text}`)
})


bot.hears(/tiendas/i, (ctx) => {
    const keyboard = Markup.inlineKeyboard([
      Markup.button.callback('Tienda 1', 'opcion_tienda_1'),
      Markup.button.callback('Tienda 2', 'opcion_tienda_2'),
      // Agrega más botones personalizados según sea necesario
    ]);
  
    ctx.reply('Selecciona una tienda:', keyboard);
  });
  
  // Manejar las acciones de los botones personalizados
  bot.action('opcion_tienda_1', (ctx) => {
    ctx.reply('Has seleccionado la Tienda 1. ¡Bienvenido!');
  });
  
  bot.action('opcion_tienda_2', (ctx) => {
    ctx.reply('Has seleccionado la Tienda 2. ¡Biemvenido!');
  });

bot.hears(/buscar atamel/i, (ctx)=>{
    ctx.reply(`Su busqueda es: ${ctx.message.text}`)
})


bot.launch()