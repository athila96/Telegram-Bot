const { Telegraf } = require('telegraf');


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
bot.launch()