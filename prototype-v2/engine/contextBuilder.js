const ContextBuilder = {

    construir(intento){

        let contexto = "";

        switch(intento.tipo){

            case IntentTypes.DEVICE:

                contexto +=

                "Dispositivos:\n\n";

                for(const dispositivo of DeviceManager.obtener()){

                    contexto +=

                    "- " +

                    dispositivo.nombre +

                    " (" +

                    dispositivo.tipo +

                    ")\n";

                    contexto +=

                    dispositivo.notas +

                    "\n\n";

                }

                break;

        }

        contexto +=

        "\nMemorias:\n\n";

        for(

            const memoria

            of MemoryManager.buscar(80)

        ){

            contexto +=

            "- " +

            memoria.contenido +

            "\n";

        }

        return contexto;

    }

};
