const MemoryManager = {

    memorias: [],

    cargar(){

        const datos = localStorage.getItem(

            "living-ai-memories"

        );

        if(datos){

            this.memorias = JSON.parse(datos);

        }

    },

    guardar(){

        localStorage.setItem(

            "living-ai-memories",

            JSON.stringify(this.memorias)

        );

    },

    agregar(contenido,tipo,importancia){

        this.memorias.push({

            id:Date.now(),

            contenido,

            tipo,

            importancia,

            fecha:new Date().toISOString()

        });

        this.guardar();

    },

    obtener(){

        return this.memorias;

    },

    buscar(minImportancia=0){

        return this.memorias.filter(

            memoria=>memoria.importancia>=minImportancia

        );

    },

    eliminar(id){

        this.memorias =

        this.memorias.filter(

            memoria=>memoria.id!==id

        );

        this.guardar();

    }

};
