function mostrarChat() {

    app.innerHTML = `

        ${crearTopBar("Pensando...")}

function enviarMensaje(){

    alert("¡Funciona!");

}
        <div class="chat-container">

            <div class="message alma">
                Hola. Soy Alma.
            </div>

            <div class="message user">
                Hola.
            </div>

            <div class="message alma">
                ¿Qué te gustaría hacer hoy?
            </div>

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
