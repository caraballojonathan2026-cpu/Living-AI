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

    async generar(prompt,mensaje){

        console.log(prompt);

        return await LLMAdapter.generar(

            prompt,

            mensaje

        );

    }

};
