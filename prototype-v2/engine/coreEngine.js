const CoreEngine = {

    async procesar(mensaje){

        const reflexion =

        ReflectionEngine.analizar(

            mensaje

        );

        const decisiones =

        DecisionEngine.decidir(

            reflexion

        );

        const pensamientos =

        ThoughtBuilder.construir(

            reflexion

        );
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
        
        const respuesta =

        await InferenceEngine.responder(

            mensaje

        );

        return respuesta;

    }

};
