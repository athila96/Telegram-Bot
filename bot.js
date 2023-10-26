const https = require('https');
const { sendMessage, sendMarkdownMessage, hideKeyboardAutomatically, sendLocation,sendLongMessage } = require('./actions');
const { stores, products } = require('./apiConnect');



// Función para procesar mensajes
async function  handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;
  const firstName = message.chat.first_name;
  const lastName = message.chat.last_name;

  let lowercaseText = text.toLowerCase()
  const wordArrangement = lowercaseText.split(" ");
  
  const firstWord = wordArrangement[0];
  const secondWord = wordArrangement[1];
  const thirdWord = wordArrangement[2];
  const fourthWord = wordArrangement[3];

  let responded = false;

  if(firstWord == 'buscar'){
    
    try {
      const response = await products(secondWord); // SecondWord debería ser el producto.
      const allProducts = response.data;
      let currentStore = " ";
      let text = [];
    
      allProducts.forEach((stores) => {
        const store = stores.Nombrebot;
    
        if (store !== currentStore) {
          currentStore = store;
          const productsDescription = allProducts.filter(product => product.Nombrebot === currentStore);
          /* const infoProductsDescription = productsDescription.map(infoProduct => infoProduct.descripcion); */

          const infoProductsDescription = productsDescription.map(infoProduct => {
            return {
                descripcion: infoProduct.descripcion,
                cantidad: infoProduct.cantidad,
                telefonos: infoProduct.Telefonos,
                fecha: infoProduct.Fecha
            };
        });
        
          /* const infoProductsPhone = productsDescription.map(storePhone => storePhone.Telefonos); */
          /* const infoProductsInventory = productsDescription.map(inventoryDate => inventoryDate.Fecha); */ 
          /* const infoProductsAmount = productsDescription.map(amount => amount.cantidad) */

          text.push(store, infoProductsDescription)
        }        
      });

      let formattedText = '';

      for (let i = 0; i < text.length; i += 2) {
          const storeName = text[i];
          const products = text[i + 1];

          formattedText += `\nTienda: ${storeName}\n`;
          formattedText += 'Telefonos: ' + products[0].telefonos + '\n';
          formattedText += 'Fecha: ' + products[0].fecha + '\n';
          formattedText += 'Productos:\n';

          for (const product of products) {
              formattedText += `- ${product.descripcion} (${product.cantidad})\n`;
          }
      }

      sendMessage(chatId, formattedText);
      /* console.log(formattedText); */
      
    } catch (error) {
      console.error(error);
    }
    
    responded = true;
  }

  const predefinedWords = ['start', 'hola', 'tiendas', 'epa', 'buenas', 'buenos', 'hey', 'buscar', 'municipio libertador', 'municipio baruta', 'municipio sucre', 'cumbres de curumo', 'el cafetal', 'la trinidad', 'paseo las mercedes', 'prados del este', 'san luis', 'santa ines', 'santa paula', 'terras plaza', 'tolon', 'horizonte', 'el hatillo', 'los naranjos', 'av mexico', 'el recreo', 'altamira', 'ccct', 'centro plaza', 'chacaito', 'chacao', 'lido', 'los palos grandes', 'san andres']

  for(const word of predefinedWords){
    if(lowercaseText.includes(word)){

      /* Bienvenida y respuesta a saludo */

      if(lowercaseText === 'epa' || lowercaseText === '/start' || lowercaseText === 'hola' || lowercaseText === 'buenos' || lowercaseText === 'buenas' || lowercaseText === 'hey'){
        sendMarkdownMessage(chatId, `Hola <b>${firstName ? ' ' + firstName: ''}</b> <b>${lastName ? ' ' + lastName : ''}</b> 😎, un gusto en saludarte. 
        
    <i>🤖 </i> tu asistente virtual, para interactuar conmigo de manera eficiente usa los siguientes mesajes:
        
    <b>Tiendas</b>  🏪
      - Le permite visualizar todas nuestras sedes.
    
    <b>Buscar</b> <i>nombre del producto</i> 🔍
      - Para informacion de algun producto solo debe escribir la palabra <b>Buscar</b> seguida del nombre del producto:
      
          Ejm: <b>Buscar Atamel</b>
            
    
    
Escribe en un mensaje lo que deseas obtener.`) ;
      responded = true;
      }


      /* Gestion de tiendas */
      
    if(lowercaseText ==='tiendas'){
      
      try{
        const infoStores = await stores();

        const dataStores = infoStores.data; // Extraigo el array data del objeto que me devuelve el api
        const keyboardOptions = dataStores.map((stores) => stores.Municipio) // Busco solo los municipios
        const uniqueMunicipios = [...new Set(keyboardOptions)]; // Selecciono solo un elemento si esta repetido no lo guarda.

        const keyboard = [];
        for(let i = 0; i < uniqueMunicipios.length; i +=3){
          const rowKeyboard = uniqueMunicipios.slice(i, i + 3);
          keyboard.push(rowKeyboard);
        }

        const options = {
          reply_markup: JSON.stringify({
            keyboard: keyboard,
            one_time_keyboard: true,
            resize_keyboard: true
          })
        }

        sendMarkdownMessage(chatId, 'Elige tu municipio:', options);
        /* console.log(uniqueMunicipios); */

        
      }catch(error){
        console.error(error);
      }
      responded = true;
    }

    if(lowercaseText === 'municipio baruta' || lowercaseText === 'municipio chacao' || lowercaseText === 'municipio libertador' || lowercaseText === 'municipio el hatillo' || lowercaseText === 'municipio sucre'){
      
      try{
        const response = await stores();

        const municipality = response.data.filter(store => store.Municipio === text); // Filtramos para buscar solo el municipio seleccionado
        const keyboardOptions = municipality.map(select => select.NombreBot); // Mappeamos el arreglo resultante del filter para extraer unicamente el NombreBot

        const keyboard = [];

        for (let i = 0; i < keyboardOptions.length; i += 3) {
            const rowKeyboard = keyboardOptions.slice(i, i + 3);
            keyboard.push(rowKeyboard);
        }
        
        const options = {
            reply_markup: JSON.stringify({
                keyboard,
                one_time_keyboard: true,
                resize_keyboard: true
            })
        };

        sendMarkdownMessage(chatId, 'Seleccione su tienda de preferencia: ', options)
      }catch(error){
        console.error(error)
      }

      responded = true;
    }

    if(lowercaseText === 'cumbres de curumo' || lowercaseText === 'santa paula' || lowercaseText === 'el cafetal' || lowercaseText === 'terras plaza' || lowercaseText === 'paseo las mercedes' || lowercaseText ===  'ccct' || lowercaseText === 'san luis' || lowercaseText === 'tolon' || lowercaseText === 'prados del este' || lowercaseText === 'la trinidad' || lowercaseText === 'santa ines' || lowercaseText === 'horizonte' || lowercaseText === 'el hatillo' || lowercaseText === 'los naranjos' || lowercaseText === 'altamira' || lowercaseText === 'centro plaza' || lowercaseText === 'chacaito' || lowercaseText === 'chacao' || lowercaseText === 'lido' || lowercaseText === 'los palos grandes' || lowercaseText === 'san andres' || lowercaseText === 'av mexico' || lowercaseText === 'el recreo'){

      try{
        const response = await stores();
        const storeSelect = response.data.filter(store => store.NombreBot === text);

        storeSelect.map((storeResponse) => {
          sendMarkdownMessage(chatId, `<b>Sede:</b> ${storeResponse.NombrePublicado}.
<b>Direccion:</b> ${storeResponse.Direccion}.
<b>Telefonos:</b> ${storeResponse.Telefonos}.
<b>Horarios:</b> ${storeResponse.Horario}.
          `)
          sendLocation(chatId, storeResponse.Latitud, storeResponse.Longitud)
        })

        hideKeyboardAutomatically(chatId, 500); // Oculta el teclado después de 5 segundos (5000 ms)


      }catch(error){
        console.error(error)
      }

      responded = true;
    }

    }
  }

  if(!responded){
    sendMarkdownMessage(chatId, `🤯 No comprendo tu solicitud. 

Recuerda que <i>🤖</i> tu asistente virtual, para interactuar conmigo de manera eficiente usa los siguientes mesajes:
        
<b>Tiendas</b>  🏪
  - Le permite visualizar todas nuestras sedes.

<b>Buscar</b> <i>nombre del producto</i> 🔍
  - Para informacion de algun producto solo debe escribir la palabra <b>Buscar</b> seguida del nombre del producto:
  
      Ejm: <b>Buscar Acetaminofen</b>
    
Buena suerte ✌️.
    `);
  }  
}






// Escucha actualizaciones de Telegram
let lastUpdateId = 0; // Mantén un registro del último ID de actualización procesado

function listenForUpdates() {
  const url = `https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${lastUpdateId + 1}`;

  https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const updates = JSON.parse(data).result;
      updates.forEach((update) => {
        if (update.message) {
          handleMessage(update.message);
          // Actualiza el último ID de actualización procesado
          lastUpdateId = update.update_id;
        }
      });

      // Continúa escuchando actualizaciones
      listenForUpdates();
    });
  });
}


// Inicia el bot
listenForUpdates()
