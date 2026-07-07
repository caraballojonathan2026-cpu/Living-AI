const Alma={

    nombre:"Alma",

    estado:"Disponible",

    async responder(texto){

        const contexto=

        ContextBuilder.construir();

        return await ModelManager.generar(

            contexto,

            texto

        );

    }

};
