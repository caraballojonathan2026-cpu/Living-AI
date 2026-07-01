let mensajes = [

    {

        autor:"alma",

        texto:"Hola. Soy Alma."

    },

    {

        autor:"alma",

        texto:"¿Qué te gustaría hacer hoy?"

    }

];

let estadoAlma = "Disponible";

function mostrarChat(){

    renderizarChat();

}

function renderizarChat(){

    let htmlMensajes = "";

    for(const mensaje of mensajes){

        htmlMensajes += `

            <div class="message ${mensaje.autor}">

                ${mensaje.texto}

            </div>

        `;

    }

    app.innerHTML = `

        ${crearTopBar(estadoAlma)}

        <div class="chat-container">

            ${htmlMensajes}

            <div class="typing">

                •••

            </div>

        </div>

        <div class="input-area">

            <input

                id="mensaje"

                type="text"

                placeholder="Escribe un mensaje..."

            >

            <button id="enviar">

                Enviar

            </button>

        </div>

    `;

    document
        .getElementById("enviar")
        .addEventListener("click", enviarMensaje);

}

function enviarMensaje(){

    const caja = document.getElementById("mensaje");

    const texto = caja.value.trim();

    if(texto === ""){

        return;

    }

    mensajes.push({

        autor:"user",

        texto:texto

    });

    estadoAlma = "Pensando...";

    renderizarChat();

    caja.value = "";

    setTimeout(()=>{

        mensajes.push({

            autor:"alma",

            texto:obtenerRespuesta(texto)

        });

        estadoAlma = "Disponible";

        renderizarChat();

    },700);

}
