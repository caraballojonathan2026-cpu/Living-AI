let mensajes = [
    {
        autor: "alma",
        texto: "Hola. Soy Alma."
    },
    {
        autor: "user",
        texto: "Hola."
    },
    {
        autor: "alma",
        texto: "¿Qué te gustaría hacer hoy?"
    }
];

let estadoAlma = "Disponible";

function mostrarChat() {
const htmlMensajes = renderMensajes();
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

<button onclick="enviarMensaje()">
    Enviar
</button>

        </div>

    `;

}
function enviarMensaje(){

    const caja = document.getElementById("mensaje");
    const texto = caja.value.trim();

    if(texto === ""){
        return;
    }

   agregarMensaje("user", texto);

    const respuesta = obtenerRespuesta(texto);

caja.value = "";

estadoAlma = "Pensando...";

mostrarChat();

setTimeout(() => {

    const respuesta = obtenerRespuesta(texto);

   agregarMensaje("alma", respuesta);

estadoAlma = "Disponible";

mostrarChat();

}, 600);
    }
function renderMensajes(){

    let html = "";

    for(const mensaje of mensajes){

        html += `
            <div class="message ${mensaje.autor}">
                ${mensaje.texto}
            </div>
        `;

    }

    return html;

}
function agregarMensaje(autor, texto){

    mensajes.push({
        autor: autor,
        texto: texto
    });

}
