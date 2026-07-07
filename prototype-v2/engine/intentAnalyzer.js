const IntentAnalyzer = {

    analizar(texto){

        const t = texto.toLowerCase();

        if(

            t.includes("chromebook") ||

            t.includes("galaxy tab") ||

            t.includes("moto")

        ){

            return{

                tipo:"device"

            };

        }

        return{

            tipo:"conversation"

        };

    }

};
