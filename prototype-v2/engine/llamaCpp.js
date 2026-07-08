const LlamaCpp = {

    modelo:null,

    async cargar(ruta){

        console.log(

            "Cargando modelo:",

            ruta

        );

        this.modelo = ruta;

        return true;

    },

    async generar(prompt){

        console.log(

            "Inferencia..."

        );

        return "[llama.cpp] Respuesta simulada";

    },

    descargar(){

        this.modelo = null;

    },

    estaCargado(){

        return this.modelo !== null;

    }

};
