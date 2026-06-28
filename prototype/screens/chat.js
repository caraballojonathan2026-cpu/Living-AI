let mensajes = [
    {
        autor: "alma",
        texto: "Hola. Soy Alma."
    },
    {
        autor: "alma",
        texto: "¿Qué te gustaría hacer hoy?"
    }
];
function mostrarChat() {
let htmlMensajes = "";

for(const mensaje of mensajes){

    htmlMensajes += `
        <div class="message ${mensaje.autor}">
            ${mensaje.texto}
        </div>
    `;

}
    app.innerHTML = `

        ${crearTopBar("Pensando...")}


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

    const chat = document.querySelector(".chat-container");

    chat.innerHTML += `
        <div class="message user">
            ${texto}
        </div>
    `;

    caja.value = "";

}
