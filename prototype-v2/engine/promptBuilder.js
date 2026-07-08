const PromptBuilder = {

    construir(mensaje){

        const intento =

IntentAnalyzer.analizar(mensaje);
        
const reflexion =

ReflectionEngine.analizar(

    mensaje

);
        
const contexto =

ContextBuilder.construir(

    intento

);
const personalidad =

Personality.instrucciones();
        
        const runtime =

        Runtime.informacion();

        const memorias =

        MemoryManager.buscar(80);

        let bloqueMemorias = "";

        for(const memoria of memorias){

            bloqueMemorias +=

            "- " +

            memoria.contenido +

            "\n";

        }

        return `

${personalidad}

Versión:

${runtime.version}

Modelo:

${runtime.modelo}

Estado:

${runtime.estado}

Memorias importantes:

${bloqueMemorias}

Conversación:

${contexto}

Usuario:

${mensaje}

${Settings.obtener("nombreIA")}:

`;
};
