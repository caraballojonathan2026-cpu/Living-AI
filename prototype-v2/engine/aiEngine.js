const AIEngine={

    generar(contexto,mensaje){

        mensaje=mensaje.toLowerCase();

        if(mensaje.includes("hola")){

            return "¡Hola! Me alegra verte.";

        }

        if(mensaje.includes("gracias")){

            return "De nada.";

        }

        if(

            mensaje.includes("adiós")||

            mensaje.includes("adios")

        ){

            return "Hasta luego.";

        }

        return "Todavía estoy aprendiendo.";

    }

};
