const DeviceDetector = {

    detectar(texto){

        const t = texto.toLowerCase();

        if(
            t.includes("chromebook")
        ){

            DeviceManager.agregar(

                "Chromebook",

                "Chromebook",

                texto

            );

        }

        if(
            t.includes("galaxy tab")
        ){

            DeviceManager.agregar(

                "Galaxy Tab",

                "Tablet",

                texto

            );

        }

        if(
            t.includes("moto")
        ){

            DeviceManager.agregar(

                "Moto",

                "Teléfono",

                texto

            );

        }

    }

};
