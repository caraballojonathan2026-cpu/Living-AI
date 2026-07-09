const Alma = {

    async procesar(mensaje){

        Runtime.cambiarEstado("Pensando...");

        const respuesta =

        await CoreEngine.procesar(

            mensaje

        );

        Runtime.cambiarEstado("Disponible");

        return respuesta;

    }

};
