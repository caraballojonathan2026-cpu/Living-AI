const IntentAnalyzer = {

    analizar(texto){

        const t = texto.toLowerCase();

        if(

            t.includes("chromebook")

        ){

            return{

                tipo:IntentTypes.DEVICE,

                datos:{

                    nombre:"Chromebook",

                    categoria:"Chromebook"

                }

            };

        }

        if(

            t.includes("galaxy tab")

        ){

            return{

                tipo:IntentTypes.DEVICE,

                datos:{

                    nombre:"Galaxy Tab",

                    categoria:"Tablet"

                }

            };

        }

        if(

            t.includes("moto")

        ){

            return{

                tipo:IntentTypes.DEVICE,

                datos:{

                    nombre:"Moto",

                    categoria:"Teléfono"

                }

            };

        }

        return{

            tipo:IntentTypes.CONVERSATION,

            datos:null

        };

    }

};
