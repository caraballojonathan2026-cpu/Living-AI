const DeviceManager = {

    dispositivos: [],

    cargar(){

        const datos = localStorage.getItem(

            "living-ai-devices"

        );

        if(datos){

            this.dispositivos = JSON.parse(datos);

        }

    },

    guardar(){

        localStorage.setItem(

            "living-ai-devices",

            JSON.stringify(this.dispositivos)

        );

    },

    agregar(nombre,tipo,notas){

        const existente = this.buscar(nombre);

        if(existente){

            return existente;

        }

        const dispositivo = {

            id:Date.now(),

            nombre,

            tipo,

            notas,

            fecha:new Date().toISOString()

        };

        this.dispositivos.push(

            dispositivo

        );

        this.guardar();

        return dispositivo;

    },

    buscar(nombre){

        return this.dispositivos.find(

            d=>

            d.nombre.toLowerCase()===

            nombre.toLowerCase()

        );

    },

    obtener(){

        return this.dispositivos;

    },

    actualizar(nombre,notas){

        const dispositivo=

        this.buscar(nombre);

        if(!dispositivo){

            return;

        }

        dispositivo.notas=notas;

        this.guardar();

    },

    eliminar(nombre){

        this.dispositivos=

        this.dispositivos.filter(

            d=>

            d.nombre.toLowerCase()!==

            nombre.toLowerCase()

        );

        this.guardar();

    }

};
