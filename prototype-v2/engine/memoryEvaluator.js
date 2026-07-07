const MemoryEvaluator = {

    evaluar(texto){

        texto = texto.trim();

        if(texto.length < 5){

            return null;

        }

        let importancia = 10;

        let tipo = "temporal";

        const t = texto.toLowerCase();

        if(
            t.includes("me llamo") ||
            t.includes("mi nombre") ||
            t.includes("prefiero")
        ){

            importancia = 90;
            tipo = "perfil";

        }

        else if(
            t.includes("mi proyecto") ||
            t.includes("living ai") ||
            t.includes("alma")
        ){

            importancia = 85;
            tipo = "proyecto";

        }

        else if(
            t.includes("quiero") ||
            t.includes("objetivo") ||
            t.includes("meta")
        ){

            importancia = 75;
            tipo = "objetivo";

        }

        else if(texto.length > 50){

            importancia = 35;
            tipo = "contexto";

        }

        return {

            contenido:texto,

            tipo:tipo,

            importancia:importancia

        };

    }

};
