const KnowledgeManager = {

    documentos: [],

    agregar(nombre,tipo,ruta){

        this.documentos.push({

            id:Date.now(),

            nombre,

            tipo,

            ruta

        });

    },

    obtener(){

        return this.documentos;

    },

    buscar(nombre){

        return this.documentos.find(

            documento=>

            documento.nombre===nombre

        );

    },

    eliminar(id){

        this.documentos =

        this.documentos.filter(

            documento=>

            documento.id!==id

        );

    }

};
