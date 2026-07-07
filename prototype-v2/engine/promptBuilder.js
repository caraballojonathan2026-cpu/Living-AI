const PromptBuilder = {

    construir(mensaje){

        const contexto = ContextBuilder.construir();

        const runtime = Runtime.informacion();

        return `

Eres Alma.

Una misión: preservar lo que importa.

Versión:

${runtime.version}

Modelo:

${runtime.modelo}

Estado:

${runtime.estado}

Conversación:

${contexto}

Usuario:

${mensaje}

Alma:

`;

    }

};
