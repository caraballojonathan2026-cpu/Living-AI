const ConversationManager = {

    conversaciones: [],

    actual: null,

    crear(){

        const nueva = {

            id: Date.now(),

            nombre:"Conversación " +

            (this.conversaciones.length+1),

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

        this.conversaciones.unshift(nueva);

        this.actual = nueva;

        Memory.guardar();

        return nueva;

    },

    buscar(id){

        return this.conversaciones.find(

            c=>c.id===id

        );

    },

    abrir(id){

        this.actual=this.buscar(id);

        return this.actual;

    },

    eliminar(id){

        this.conversaciones=

        this.conversaciones.filter(

            c=>c.id!==id

        );

        if(

            this.actual &&

            this.actual.id===id

        ){

            this.actual=null;

        }

        Memory.guardar();

    },

    renombrar(id,nombre){

        const chat=this.buscar(id);

        if(!chat){

            return;

        }

        chat.nombre=nombre;

        Memory.guardar();

    },

    actualChat(){

        return this.actual;

    },

    todas(){

        return this.conversaciones;

    },

    agregarMensaje(autor,texto){

        if(!this.actual){

            return;

        }

        this.actual.mensajes.push({

            autor,

            texto

        });

        Memory.guardar();

    }

};
