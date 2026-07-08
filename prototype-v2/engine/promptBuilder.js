const PromptBuilder = {

    construir(mensaje){

        const intento =

IntentAnalyzer.analizar(mensaje);
        
const reflexion =

ReflectionEngine.analizar(

    mensaje

);
        
        const pensamientos =

ThoughtBuilder.construir(

    reflexion

);
        
const contexto =

ContextBuilder.construir(

    reflexion

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
let bloquePensamientos = "";

for(const pensamiento of pensamientos){

    bloquePensamientos +=

    "- " +

    pensamiento +

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

Pensamientos internos:

${bloquePensamientos}

Memorias importantes:

${bloqueMemorias}

Conversación:

${contexto}

Usuario:

${mensaje}

${Settings.obtener("nombreIA")}:

`;
};
