const app = document.getElementById("app");

Settings.cargar();

Runtime.iniciar();

Memory.cargar();

MemoryManager.cargar();

ModelLoader.cargar("models/qwen3b.gguf");

Navigation.home();
