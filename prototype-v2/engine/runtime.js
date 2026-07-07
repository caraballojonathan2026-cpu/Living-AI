const Runtime = {

    version: "Prototype v2.1",

    estado: "Disponible",

    modelo: "Simulado",

    plataforma: "Web",

    iniciar(){

        console.log("Living AI iniciado.");

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

    informacion(){

        return {

            version:this.version,

            estado:this.estado,

            modelo:this.modelo,

            plataforma:this.plataforma

        };

    }

};
