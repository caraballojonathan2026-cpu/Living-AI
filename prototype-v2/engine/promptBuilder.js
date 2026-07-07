const PromptBuilder = {

    construir(mensaje){

        const intento =

IntentAnalyzer.analizar(mensaje);

const contexto =

ContextBuilder.construir(

    intento

);

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

Eres ${Settings.obtener("nombreIA")}.

Una misión:

preservar lo que importa.

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

    }

};
