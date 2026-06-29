function obtenerRespuesta(texto){

    texto = texto.toLowerCase();

    if(texto.includes("hola")){
        return "Hola. Soy Alma.";
    }

    if(texto.includes("adiós") || texto.includes("adios")){
        return "Hasta luego.";
    }

    return "Todavía estoy aprendiendo a conversar.";

}
