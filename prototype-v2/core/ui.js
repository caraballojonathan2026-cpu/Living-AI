function crearTopBar(estado){

    return `

        <header class="topbar">

            <div class="topbar-left">

                <button
                    id="backButton"
                    class="back-button"
                    style="display:none">

                    ←

                </button>

                <div class="avatar">

                    ○

                </div>

            </div>

            <div class="topbar-info">

                <div class="title">

                    Alma

                </div>

                <div class="status">

                    ${estado}

                </div>

            </div>

        </header>

    `;

}

function mostrarBotonAtras(callback){

    const boton = document.getElementById("backButton");

    if(!boton){

        return;

    }

    boton.style.display = "flex";

    boton.onclick = callback;

}

function ocultarBotonAtras(){

    const boton = document.getElementById("backButton");

    if(!boton){

        return;

    }

    boton.style.display = "none";

    boton.onclick = null;

}
