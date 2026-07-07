const Alma = {

    nombre: "Alma",

    estado: "Disponible",

    responder(texto){

        const contexto =

        ContextBuilder.construir();

        return ModelManager.generar(

            contexto,

            texto

        );

    }

};
