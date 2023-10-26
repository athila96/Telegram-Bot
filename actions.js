const https = require('https');
const TOKEN = '';


const maxLength = 4096; // Límite de caracteres para un mensaje en Telegram
const maxTotalLength = 20480;
// Función para enviar mensajes simples 
function sendMessage(chatId, text) {
    const textFragments = splitTextIntoFragments(text, maxLength, maxTotalLength);

    textFragments.forEach((fragment, index) => {
        // Aplicar Markdown para las palabras clave en negritas
        fragment = fragment.replace(/Tienda:/g, '*Tienda:*')
                         .replace(/Telefono:/g, '*Telefonos:*')
                         .replace(/Fecha:/g, '*Fecha:*')
                         .replace(/Productos:/g, '*Productos:*');
        
        const formattedText = encodeURIComponent(fragment);
        const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${formattedText}&parse_mode=Markdown`;

        setTimeout(() => {
            https.get(url, (response) => {
                console.log('Mensaje enviado con éxito');
            });
        }, index * 1000); // Espera un segundo entre cada fragmento (ajusta según tus necesidades)
    });
}



// Divide el texo en arreglos de 4096 caracteres, tambien valida que no se manden mas de 20480
function splitTextIntoFragments(text, maxLength, maxTotalLength) {
    const fragments = [];
    let startIndex = 0;
    let totalLength = text.length;

    while (startIndex < totalLength) {
        // Calcula la longitud máxima para este fragmento
        const fragmentLength = Math.min(maxLength, totalLength - startIndex);
        
        // Verifica si supera el máximo total
        if (startIndex + fragmentLength > maxTotalLength) {
            // Agrega un mensaje de advertencia y sal
            fragments.push('*😯 Se encontraron demasiados resultados, sea más específico en su búsqueda 🤖*');
            break;
        } else {
            fragments.push(text.slice(startIndex, startIndex + fragmentLength));
            startIndex += fragmentLength;
        }
    }

    return fragments;
}

// Envia y permite utilizar las etiquetas html <b></b> y <i></i> para formatear el texto
function sendMarkdownMessage(chatId, text, options) {
    const formattedText = `${text}`;

    let url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(formattedText)}&parse_mode=HTML`

    if (options) {
      url += `&reply_markup=${encodeURIComponent(options.reply_markup)}`;
  }

    https.get(url, (response) => {
        return response;
        /* console.log('Este es la respuesta: ', response); */
    });
}


// Esta funcion despues de pasar el tiempo indicado se ejecuta enviando el mensaje 'Gracias por preferirnos' lo cual le da una instruccion al teclado para ocultarse.
function hideKeyboardAutomatically(chatId, delay) {
  setTimeout(() => {
      const hideKeyboardOptions = {
          reply_markup: JSON.stringify({
              remove_keyboard: true
          })
      };
      sendMarkdownMessage( chatId, 'Gracias por preferirnos 😉.', hideKeyboardOptions);
  }, delay);
}

// Permite enviar un mapa con la ubicacion exacta usando la api de telegram
function sendLocation(chatId, latitude, longitude){
  const url = `https://api.telegram.org/bot${TOKEN}/sendLocation`;

  const locationData = {
    chat_id: chatId,
    latitude: latitude,
    longitude: longitude 
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const req = https.request(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Respuesta de la ubicacion enviada');
    });
});

req.write(JSON.stringify(locationData));
req.end();
}





  module.exports = {sendMessage, sendMarkdownMessage, hideKeyboardAutomatically, sendLocation};