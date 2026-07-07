const ModelManager = {

    modeloActual: "Simulado",

    obtener(){

        return this.modeloActual;

    },

    cambiar(nombre){

        this.modeloActual = nombre;

    },

    generar(contexto, mensaje){

        return AIEngine.generar(

            contexto,

            mensaje

        );

    }

};
