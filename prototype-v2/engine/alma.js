const Alma = {

    async procesar(mensaje){

        Runtime.cambiarEstado("Pensando...");

        const respuesta =

        await this.responder(mensaje);

        Runtime.cambiarEstado("Disponible");

        return respuesta;

    },

    async responder(mensaje){

        return await

        InferenceEngine.responder(

            mensaje

        );

    }

};
