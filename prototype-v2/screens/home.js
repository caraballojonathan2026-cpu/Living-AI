function mostrarInicio(){

    let listaChats = "";

    if(conversaciones.length === 0){

        listaChats = `

            <p class="empty">

                Todavía no hay nada.

                <br><br>

                Rompe el cielo.

            </p>

        `;

    }

    else{

        conversaciones.forEach(chat=>{

            listaChats += `

                <button

                    class="chat-item"

                    onclick="abrirConversacion(${chat.id})"

                >

                    💬 ${chat.nombre}

                </button>

            `;

        });

    }

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

                ${listaChats}

            </section>

        </main>

    `;

    document

        .getElementById("nuevoChat")

        .addEventListener(

            "click",

            crearNuevaConversacion

        );

}
