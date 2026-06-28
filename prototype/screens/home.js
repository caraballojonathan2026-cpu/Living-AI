function mostrarInicio() {

    app.innerHTML = `

        <div class="topbar">

            <div class="avatar"></div>

            <div>

                <div class="title">
                    Alma
                </div>

                <div class="status">
                    Una misión: preservar lo que importa.
                </div>

            </div>

        </div>

        <div class="screen">

            <h1>Living AI</h1>

            <p>
                Bienvenido.
            </p>

            <button onclick="mostrarChat()">
                Abrir chat
            </button>

        </div>

    `;

}
