const Navigation = {

    home(){

        mostrarInicio();

    },

    chat(){

        mostrarChat();

    },

    profile(){

        mostrarPerfil();

    },

    go(screen){

        switch(screen){

            case "home":
                this.home();
                break;

            case "chat":
                this.chat();
                break;

            case "profile":
                this.profile();
                break;

            default:
                console.warn(
                    "Pantalla desconocida:",
                    screen
                );

        }

    }

};
