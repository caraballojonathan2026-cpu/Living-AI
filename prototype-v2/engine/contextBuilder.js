const ContextBuilder={

    construir(){

        const chat=ConversationManager.actualChat();

        if(!chat){

            return "";

        }

        return chat.mensajes
            .slice(-10)
            .map(m=>{

                return `${m.autor}: ${m.texto}`;

            })
            .join("\n");

    }

};
