function obtenerRespuesta(texto){

    texto = texto.toLowerCase();

    if(texto.includes("hola")){
        return "¡Hola! Me alegra verte.";
    }

    if(texto.includes("gracias")){
        return "De nada.";
    }

    if(texto.includes("adiós") || texto.includes("adios")){
        return "Hasta luego.";
    }

    return "Todavía estoy aprendiendo.";

}
