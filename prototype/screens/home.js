function mostrarInicio() {

   app.innerHTML = `

    ${crearTopBar("Disponible")}

    <div class="screen">

        <div class="welcome">

            <h1>Living AI</h1>

            <p>
                Una misión:
                preservar lo que importa.
            </p>

        </div>

        <button onclick="mostrarChat()">
            + Nuevo chat
        </button>

        <div class="chat-list">

            <h3>Chats</h3>

            <p class="empty">
                Todavía no hay conversaciones.
            </p>

        </div>

    </div>

`;

}
