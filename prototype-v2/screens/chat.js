function mostrarChat(){

    renderizarChat();

}

function renderizarChat(){

    const chat = ConversationManager.actualChat();

    if(!chat){

        Navigation.home();

        return;

    }

    let htmlMensajes = "";

    for(const mensaje of chat.mensajes){

        htmlMensajes += `

            <div class="message ${mensaje.autor}">

                ${mensaje.texto}

            </div>

        `;

    }

    app.innerHTML = `

        ${crearTopBar(Runtime.obtenerEstado())}

        <div class="chat-container">

            ${htmlMensajes}

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

    mostrarBotonAtras(Navigation.home);

    document
        .getElementById("enviar")
        .addEventListener("click", enviarMensaje);

}

async function enviarMensaje(){

    const caja=document.getElementById("mensaje");

    const texto=caja.value.trim();

    if(texto===""){

        return;

    }

    ConversationManager.agregarMensaje(

        "user",

        texto

    );

    MemoryManager.aprender(texto);
 
    Runtime.cambiarEstado("Pensando...");

renderizarChat();

caja.value="";

const respuesta =

await Alma.responder(texto);

Runtime.cambiarEstado("Respondiendo...");

renderizarChat();

ConversationManager.agregarMensaje(

    "alma",

    respuesta

);

Runtime.cambiarEstado("Disponible");

renderizarChat();

}
