const LLMAdapter = {

    async generar(contexto, mensaje){

        // Por ahora usamos el motor simulado

        return AIEngine.generar(

            contexto,

            mensaje

        );

    }

};
