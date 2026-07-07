const ModelLoader = {

    modelo: null,

    cargando: false,

    listo: false,

    ruta: null,

    async cargar(ruta){

        this.cargando = true;

        this.listo = false;

        this.ruta = ruta;

        Runtime.cambiarEstado("Cargando modelo...");

        // Aquí llamaremos a llama.cpp
        // en la versión Android.

        await new Promise(resolve=>{

            setTimeout(resolve,1000);

        });

        this.modelo = {

            nombre:"Qwen 3B",

            ruta:ruta

        };

        this.cargando = false;

        this.listo = true;

        Runtime.cambiarEstado("Disponible");

        return true;

    },

    descargar(){

        this.modelo = null;

        this.cargando = false;

        this.listo = false;

        this.ruta = null;

    },

    estaListo(){

        return this.listo;

    },

    obtener(){

        return this.modelo;

    }

};
