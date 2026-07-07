const Alma={

    nombre:"Alma",

    estado:"Disponible",

    responder(texto){

        const contexto=

        ContextBuilder.construir();

        return AIEngine.generar(

            contexto,

            texto

        );

    }

};
