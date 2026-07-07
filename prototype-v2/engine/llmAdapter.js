const LLMAdapter = {

    async generar(prompt){

        console.log(

            "===== PROMPT ====="

        );

        console.log(prompt);

        console.log(

            "=================="

        );

        return "[Modelo simulado] " +

        AIEngine.generar(prompt);

    }

};
