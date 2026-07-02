function mostrarInicio(){

    let listaHTML = "";

    if(conversaciones.length === 0){

        listaHTML = `

            <p class="empty">

                Todavía no hay nada.

                <br><br>

                Rompe el cielo.

            </p>

        `;

    }

    else{

        conversaciones.forEach((chat,index)=>{

            listaHTML += `

                <button
                    class="chat-item"
                    data-id="${index}">

                    ${chat.nombre}

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

                ${listaHTML}

            </section>

        </main>

    `;

    document
        .getElementById("nuevoChat")
        .addEventListener("click",()=>{

            conversaciones.push({

                nombre:
                "Conversación " +
                (conversaciones.length+1)

            });

            mostrarInicio();

        });

}
