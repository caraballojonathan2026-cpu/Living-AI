const Alma = {

    nombre: "Alma",

    estado: "Disponible",

    responder(texto){

        texto = texto.toLowerCase();

        if(texto.includes("hola")){

            return "¡Hola! Me alegra verte.";

        }

        if(texto.includes("adiós") || texto.includes("adios")){

            return "Hasta luego.";

        }

        if(texto.includes("gracias")){

            return "De nada.";

        }

        return "Todavía estoy aprendiendo.";

    }

};
