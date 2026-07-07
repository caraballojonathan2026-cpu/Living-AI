const ModelManager = {

    async generar(prompt,mensaje){

        if(!ModelLoader.estaListo()){

            return AIEngine.generar(

                prompt,

                mensaje

            );

        }

        return await LLMAdapter.generar(

            prompt,

            mensaje

        );

    }

};
