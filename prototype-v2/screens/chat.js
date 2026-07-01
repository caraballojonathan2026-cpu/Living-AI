let mensajes = [];

let estadoAlma = "Disponible";

function mostrarChat(){

    pantallaActual = "chat";

    mensajes = [
        {
            autor: "alma",
            texto: "Hola. Soy Alma."
        },
        {
            autor: "alma",
            texto: "¿Qué te gustaría hacer hoy?"
        }
    ];

    renderChat();

}

function renderChat(){

    let htmlMensajes = "";

    for(const mensaje of mensajes){

        htmlMensajes += `

            <div class="mensaje ${mensaje.autor}">
                ${mensaje.texto}
            </div>

        `;

    }

    app.innerHTML = `

        ${crearTopBar(estadoAlma)}

        <main class="chat">

            <div class="mensajes">

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

        </main>

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
        autor: "user",
        texto: texto
    });

    caja.value = "";

    estadoAlma = "Pensando...";

    renderChat();

    setTimeout(() => {

        mensajes.push({

            autor: "alma",

            texto: obtenerRespuesta(texto)

        });

        estadoAlma = "Disponible";

        renderChat();

    },600);

}
