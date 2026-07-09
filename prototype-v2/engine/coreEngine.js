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

        this.procesarIntencion(

            mensaje

        );

        this.actualizarMemoria(

            mensaje

        );

        const respuesta =

        await InferenceEngine.responder(

            mensaje

        );

        return respuesta;

    },

    procesarIntencion(mensaje){

        const intento =

        IntentAnalyzer.analizar(

            mensaje

        );

        switch(intento.tipo){

            case IntentTypes.DEVICE:

                DeviceManager.agregar(

                    intento.datos.nombre,

                    intento.datos.categoria,

                    mensaje

                );

                break;

        }

    },

    actualizarMemoria(mensaje){

        MemoryManager.aprender(

            mensaje

        );

    }

};
