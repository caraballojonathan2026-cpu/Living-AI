const InferenceEngine = {

    async generar(prompt){

        if(

            LlamaCpp.estaCargado()

        ){

            return await LlamaCpp.generar(

                prompt

            );

        }

        return AIEngine.generar(

            prompt

        );

    }

};
