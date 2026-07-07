const app = document.getElementById("app");

Runtime.iniciar();

ModelLoader.cargar("models/qwen3b.gguf");

Memory.cargar();

Navigation.home();
