const Alma = {

    nombre:"Alma",

    estado:"Disponible",

    async responder(texto){

        const prompt =

        PromptBuilder.construir(texto);

        return await ModelManager.generar(

            prompt,

            texto

        );

    }

};
