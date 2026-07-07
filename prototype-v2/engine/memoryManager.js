 aprender(texto){

    const memoria =

    MemoryEvaluator.evaluar(texto);

    if(!memoria){

        return;

    }

    if(memoria.importancia < 50){

        return;

    }

    if(

        MemoryConsolidator.consolidar(memoria)

    ){

        return;

    }

    this.agregar(

        memoria.contenido,

        memoria.tipo,

        memoria.importancia

    );

}
