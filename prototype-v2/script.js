const app = document.getElementById("app");

/* -------------------------
   Conversaciones
------------------------- */

let conversaciones = [];

let conversacionActual = null;

/* -------------------------
   Crear conversación
------------------------- */

function crearNuevaConversacion(){

    const nueva = {

        id: Date.now(),

        nombre:
        "Conversación " +
        (conversaciones.length + 1),

        mensajes:[

            {

                autor:"alma",

                texto:"Hola. Soy Alma."

            },

            {

                autor:"alma",

                texto:"¿Qué te gustaría hacer hoy?"

            }

        ]

    };

    conversaciones.unshift(nueva);

    conversacionActual = nueva;

    mostrarChat();

}

/* -------------------------
   Abrir conversación
------------------------- */

function abrirConversacion(id){

    conversacionActual = conversaciones.find(

        c => c.id === id

    );

    Navigation.chat();

}

Navigation.home();
