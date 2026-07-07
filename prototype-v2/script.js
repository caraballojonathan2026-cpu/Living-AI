const app = document.getElementById("app");

Settings.cargar();

Runtime.iniciar();

Memory.cargar();

MemoryManager.cargar();

DeviceManager.cargar();

ForgetManager.ejecutar();

ModelLoader.cargar("models/qwen3b.gguf");

Navigation.home();
