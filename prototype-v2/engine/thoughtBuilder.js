const ThoughtBuilder = {

    construir(reflexion){

        const pensamientos = [];

        if(reflexion.necesitaMemoria){

            pensamientos.push(

                "Consultar memoria relevante."

            );

        }

        if(reflexion.necesitaBiblioteca){

            pensamientos.push(

                "Consultar biblioteca."

            );

        }

        if(reflexion.necesitaPregunta){

            pensamientos.push(

                "Pedir aclaración al usuario."

            );

        }

        return pensamientos;

    }

};
