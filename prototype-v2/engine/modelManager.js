const ModelManager = {

    modeloActual:{

        nombre:"Simulado",

        tipo:"mock"

    },

    obtener(){

        return this.modeloActual;

    },

    cambiar(modelo){

        this.modeloActual=modelo;

    },

    async generar(contexto,mensaje){

        return await LLMAdapter.generar(

            contexto,

            mensaje

        );

    }

};
