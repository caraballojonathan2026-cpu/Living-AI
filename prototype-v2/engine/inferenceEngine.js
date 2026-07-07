const InferenceEngine = {

    async generar(prompt){

        if(

            ModelLoader.estaListo()

        ){

            return await LLMAdapter.generar(

                prompt

            );

        }

        return AIEngine.generar(

            prompt

        );

    }

};
