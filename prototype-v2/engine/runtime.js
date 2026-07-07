const Runtime = {

    version:"Prototype v2.1",

    estado:"Disponible",

    modelo:"Simulado",

    plataforma:"Web",

    iniciar(){

        Logger.log(

            "SYSTEM",

            "Living AI iniciado."

        );

    },

    obtenerEstado(){

        return this.estado;

    },

    cambiarEstado(estado){

        this.estado=estado;

        Logger.log(

            "STATE",

            estado

        );

    },

    informacion(){

        return{

            version:this.version,

            estado:this.estado,

            modelo:this.modelo,

            plataforma:this.plataforma

        };

    }

};
