const Logger = {

    historial: [],

    log(tipo, mensaje){

        const evento = {

            fecha: new Date(),

            tipo,

            mensaje

        };

        this.historial.push(evento);

        console.log(

            `[${tipo}]`,

            mensaje

        );

    },

    obtener(){

        return this.historial;

    },

    limpiar(){

        this.historial=[];

    }

};
