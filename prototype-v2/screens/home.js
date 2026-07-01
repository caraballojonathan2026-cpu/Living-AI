function mostrarInicio(){

    pantallaActual = "home";

    app.innerHTML = `

        ${crearTopBar("Disponible")}

        <main class="home">

            <h1>Living AI</h1>

            <p>

                Una misión:
                preservar lo que importa.

            </p>

            <button id="nuevoChat">

                + Nuevo chat

            </button>

            <section class="chat-list">

                <h3>Chats</h3>

                <p>

                    Todavía no hay conversaciones.

                </p>

            </section>

        </main>

    `;

    document
        .getElementById("nuevoChat")
        .addEventListener("click", mostrarChat);

}
