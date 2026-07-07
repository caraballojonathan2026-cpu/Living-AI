const ForgetManager = {

    LIMITE_TEMPORAL: 20,

    LIMITE_RESUMEN: 50,

    ejecutar(){

        const nuevasMemorias = [];

        for(const memoria of MemoryManager.memorias){

            if(memoria.importancia <= this.LIMITE_TEMPORAL){

                continue;

            }

            if(

                memoria.importancia <= this.LIMITE_RESUMEN

            ){

                memoria.contenido =

                this.resumir(memoria.contenido);

            }

            nuevasMemorias.push(memoria);

        }

        MemoryManager.memorias = nuevasMemorias;

        MemoryManager.guardar();

    },

    resumir(texto){

        if(texto.length <= 60){

            return texto;

        }

        return texto.substring(0,57) + "...";

    }

};
