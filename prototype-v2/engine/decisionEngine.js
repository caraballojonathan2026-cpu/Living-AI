const DecisionEngine = {

    decidir(reflexion){

        return {

            guardarMemoria:

            reflexion.necesitaMemoria,

            actualizarDispositivo:

            reflexion.necesitaMemoria,

            consultarBiblioteca:

            reflexion.necesitaBiblioteca,

            hacerPregunta:

            reflexion.necesitaPregunta

        };

    }

};
