function mostrarInicio(){

    app.innerHTML = `

        ${crearTopBar("Disponible")}

        <main class="screen">

            <div class="welcome">

                <h1>

                    Living AI

                </h1>

                <p>

                    Una misión:
                    preservar lo que importa.

                </p>

            </div>

            <button id="nuevoChat">

                + Nuevo chat

            </button>

            <section class="chat-list">

                <h3>

                    Chats

                </h3>

                <p class="empty">

                    Todavía no hay nada.

                    <br><br>

                    Rompe el cielo.

                </p>

            </section>

        </main>

    `;

    document
        .getElementById("nuevoChat")
        .addEventListener("click", mostrarChat);

}
