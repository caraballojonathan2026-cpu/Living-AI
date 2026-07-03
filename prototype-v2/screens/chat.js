function mostrarChat(){

    renderizarChat();

}

function renderizarChat(){

    let htmlMensajes = "";

    for(const mensaje of conversacionActual.mensajes){

        htmlMensajes += `

            <div class="message ${mensaje.autor}">

                ${mensaje.texto}

            </div>

        `;

    }

    app.innerHTML = `

        ${crearTopBar("Disponible")}

        <div class="chat-container">

            ${htmlMensajes}

            <div class="typing">

                •••

            </div>

        </div>

        <div class="input-area">

            <button id="volver">

                ←

            </button>

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
        .getElementById("volver")
        .addEventListener("click", mostrarInicio);

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

    conversacionActual.mensajes.push({

        autor:"user",

        texto:texto

    });

    renderizarChat();

    setTimeout(()=>{

        conversacionActual.mensajes.push({

            autor:"alma",

            texto:Alma.responder(texto)

        });

        renderizarChat();

    },700);

}
