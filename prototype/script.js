const app = document.getElementById("app");

function mostrarInicio(){

app.innerHTML = `

<div class="topbar">

<img class="avatar" src="assets/images/avatar.png">

<div>

<div class="title">
Alma
</div>

<div class="status">
Una misión: preservar lo que importa.
</div>

</div>

</div>

<div class="chat-container">

<h2>Bienvenido</h2>

<p>
Soy Alma.
</p>

<p>
Todavía estoy en desarrollo.
</p>

<button id="nuevoChat">

Nuevo chat

</button>

</div>

`;

document
.getElementById("nuevoChat")
.onclick = mostrarChat;

}

function mostrarChat(){

app.innerHTML = `

<div class="topbar">

<img class="avatar" src="assets/images/avatar.png">

<div>

<div class="title">
Alma
</div>

<div class="status">
Pensando...
</div>

</div>

</div>

<div class="chat-container">

<div class="message alma">

Hola.

</div>

<div class="typing">

•••

</div>

<button id="volver">

Volver

</button>

</div>

`;

document
.getElementById("volver")
.onclick = mostrarInicio;

}

mostrarInicio();
