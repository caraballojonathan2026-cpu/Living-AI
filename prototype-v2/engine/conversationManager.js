const ConversationManager = {

    conversaciones: [],

    actual: null,

    crear(){

        const nueva = {

            id: Date.now(),

            nombre: "Conversación " + (this.conversaciones.length + 1),

            mensajes: [

                {
                    autor: "alma",
                    texto: "Hola. Soy Alma."
                },

                {
                    autor: "alma",
                    texto: "¿Qué te gustaría hacer hoy?"
                }

            ]

        };

        this.conversaciones.unshift(nueva);

        this.actual = nueva;

        return nueva;

    },

    abrir(id){

        this.actual = this.conversaciones.find(

            c => c.id === id

        );

        return this.actual;

    },

    actualChat(){

        return this.actual;

    },

    todas(){

        return this.conversaciones;

    },

    agregarMensaje(autor, texto){

        if(!this.actual){

            return;

        }

        this.actual.mensajes.push({

            autor,

            texto

        });

    }

};
