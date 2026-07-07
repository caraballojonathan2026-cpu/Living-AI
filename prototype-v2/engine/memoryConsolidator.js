const MemoryConsolidator = {

    consolidar(memoria){

        const existente = MemoryManager.memorias.find(

            m =>

                m.tipo === memoria.tipo &&

                m.importancia >= 80

        );

        if(!existente){

            return false;

        }

        existente.contenido = memoria.contenido;

        existente.fecha = new Date().toISOString();

        MemoryManager.guardar();

        return true;

    }

};
