const Alma = {

    async procesar(mensaje){

        Runtime.cambiarEstado(

            "Pensando..."

        );

        const respuesta =

        await CoreEngine.procesar(

            mensaje

        );

        Runtime.cambiarEstado(

            "Disponible"

        );

        return respuesta;

    },

    async responder(mensaje){

        return await

        InferenceEngine.responder(

            mensaje

        );

    }

};
