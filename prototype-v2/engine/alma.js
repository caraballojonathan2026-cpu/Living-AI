const Alma = {

    async responder(texto){

        const prompt =

        PromptBuilder.construir(texto);

        return await InferenceEngine.generar(

            prompt

        );

    },

    nombre(){

        return Settings.obtener(

            "nombreIA"

        );

    }

};
