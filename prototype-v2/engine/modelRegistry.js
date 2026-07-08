const ModelRegistry = {

    modelos:[

        {

            id:"qwen3-3b",

            nombre:"Qwen 3 3B",

            archivo:"models/Qwen3-3B-Q4_K_M.gguf",

            tamaño:"2 GB",

            idioma:"Multilingüe"

        }

    ],

    obtenerTodos(){

        return this.modelos;

    },

    buscar(id){

        return this.modelos.find(

            modelo=>modelo.id===id

        );

    }

};
