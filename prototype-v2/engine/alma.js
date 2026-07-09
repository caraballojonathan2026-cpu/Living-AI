const Alma = {

async procesar(mensaje){

    Runtime.cambiarEstado("Pensando...");

    const intento =

    IntentAnalyzer.analizar(mensaje);

    switch(intento.tipo){

        case IntentTypes.DEVICE:

            DeviceManager.agregar(

                intento.datos.nombre,

                intento.datos.categoria,

                mensaje

            );

            break;

    }

    MemoryManager.aprender(

        mensaje

    );

    const respuesta =

    await this.responder(mensaje);

    Runtime.cambiarEstado("Disponible");

    return respuesta;

}  
