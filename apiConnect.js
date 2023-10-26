const crypto = require('crypto'); /* Crypto ayuda a crear el hash */
const querystring = require('querystring');


const calculateHash = () => {

    
    const currentDateAndTime = new Date();  /* Obtengo la fecha y hora actual */
    const timestamp = currentDateAndTime.getTime(); /* Obtengo los milisegundos */
    const keyUnion = timestamp + preSharedKey;
    const keyHash1 = crypto.createHash('sha256').update(keyUnion).digest('hex') /* Obtengo la clave con el hash */

    return {keyHash1, timestamp} ;
    
}

/* Conexion a la informacion basica de las tiendas */

const  stores = async ()=>{

    const url = "";
    const key = calculateHash();
    const authHash = querystring.stringify({auth: key.keyHash1})
    const seed = querystring.stringify({ seed: key.timestamp });

    try{
        const response = await fetch(url,{
            method: "POST",
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: seed + '&' + authHash
        });
        if(response.ok){
            const dataStore = await response.json();
            return dataStore;
            /* return console.log(dataStore); */
            
        }
        console.error("La solicitud fallo en el codigo: ", response.status)
    }catch(error){
        console.log(error);
    }
} 

const products = async(product) =>{
    const url = "";
    const key = calculateHash();
    const authHash = querystring.stringify({auth: key.keyHash1})
    const seed = querystring.stringify({ seed: key.timestamp });
    const searchString = "search_string="+product; 
    
    try{
        const response = await fetch(url,{
            method: "POST",
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: seed + '&' + authHash + '&' + searchString
        });
        if(response.ok){
            const dataProducts = await response.json();
            return dataProducts;
            /* return console.log(dataProducts); */
            
        }
        console.error("La solicitud fallo en el codigo: ", response.status)
    }catch(error){
        console.log(error);
    }
}

/* stores(); */

/* products('dorito'); */

module.exports = {stores, products};