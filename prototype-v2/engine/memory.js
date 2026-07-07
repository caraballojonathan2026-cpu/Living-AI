const Memory = {

    CLAVE: "living-ai-memory",

    guardar(){

        const datos = {

            conversaciones: ConversationManager.todas()

        };

        localStorage.setItem(

            this.CLAVE,

            JSON.stringify(datos)

        );

    },

    cargar(){

        const datos = localStorage.getItem(this.CLAVE);

        if(!datos){

            return;

        }

        const memoria = JSON.parse(datos);

        ConversationManager.conversaciones =

            memoria.conversaciones || [];

        ConversationManager.actual = null;

    },

    limpiar(){

        localStorage.removeItem(this.CLAVE);

    }

};
