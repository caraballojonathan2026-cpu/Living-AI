function mostrarChat() {

    app.innerHTML = `

        ${crearTopBar("Pensando...")}

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
                type="text"
                placeholder="Escribe un mensaje..."
            >

            <button>
                Enviar
            </button>

        </div>

    `;

}
