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

        const respuesta =

        await InferenceEngine.responder(

            mensaje

        );

        return respuesta;

    }

};
