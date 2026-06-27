const app = document.getElementById("app");

function mostrarInicio(){

app.innerHTML = `

<div class="topbar">

<div class="avatar"></div>

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
Todavía estoy en desarrollo,
pero cada día aprendo un poco más.
</p>

<button id="nuevoChat">

Nuevo chat

</button>

</div>

`;

}

mostrarInicio();
