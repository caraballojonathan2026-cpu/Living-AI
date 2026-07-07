const Settings = {

    datos:{

        nombreIA:"Alma",

        modelo:"Simulado",

        idioma:"es",

        tema:"oscuro",

        memoria:true

    },

    cargar(){

        const datos = localStorage.getItem(

            "living-ai-settings"

        );

        if(datos){

            this.datos = JSON.parse(datos);

        }

    },

    guardar(){

        localStorage.setItem(

            "living-ai-settings",

            JSON.stringify(this.datos)

        );

    },

    obtener(clave){

        return this.datos[clave];

    },

    cambiar(clave,valor){

        this.datos[clave]=valor;

        this.guardar();

    }

};
