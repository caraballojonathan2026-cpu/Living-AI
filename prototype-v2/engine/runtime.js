const Runtime = {

    version: "Prototype v2.1",

    estado: "Disponible",

    modelo: "Simulado",

    plataforma: "Web",

    inicializado: false,

    iniciar(){

        this.inicializado = true;

        console.log(

            "Living AI iniciado."

        );

    },

    obtenerEstado(){

        return this.estado;

    },

    cambiarEstado(estado){

        this.estado = estado;

    },

    obtenerModelo(){

        return this.modelo;

    },

    cambiarModelo(nombre){

        this.modelo = nombre;

    },

    informacion(){

        return {

            version: this.version,

            modelo: this.modelo,

            estado: this.estado,

            plataforma: this.plataforma,

            inicializado: this.inicializado

        };

    }

};
