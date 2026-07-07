const Alma={

    async responder(texto){

        const prompt=

        PromptBuilder.construir(texto);

        return await ModelManager.generar(

            prompt,

            texto

        );

    },

    nombre(){

        return Settings.obtener(

            "nombreIA"

        );

    }

};
