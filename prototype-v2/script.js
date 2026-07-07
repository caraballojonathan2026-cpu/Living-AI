const app = document.getElementById("app");

Settings.cargar();

Runtime.iniciar();

ModelLoader.cargar("models/qwen3b.gguf");

Memory.cargar();

Navigation.home();
