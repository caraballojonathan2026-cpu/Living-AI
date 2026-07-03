function mostrarInicio(){

    const conversaciones = ConversationManager.todas();

    let lista = "";

    if(conversaciones.length === 0){

        lista = `

            <p class="empty">

                Todavía no hay conversaciones.

            </p>

        `;

    }else{

        conversaciones.forEach(chat=>{

            lista += `

                <button
                    class="chat-item"
                    onclick="abrirChat(${chat.id})">

                    💬 ${chat.nombre}

                </button>

            `;

        });

    }

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

            <button id="nuevoChat">

                + Nuevo chat

            </button>

            <div class="chat-list">

                <h3>Chats</h3>

                ${lista}

            </div>

        </div>

    `;

    document
        .getElementById("nuevoChat")
        .addEventListener("click", ()=>{

            ConversationManager.crear();

            Navigation.chat();

        });

}

function abrirChat(id){

    ConversationManager.abrir(id);

    Navigation.chat();

}
