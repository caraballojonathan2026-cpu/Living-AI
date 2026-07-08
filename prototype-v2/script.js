const app = document.getElementById("app");

Settings.cargar();

Runtime.iniciar();

Memory.cargar();

MemoryManager.cargar();

DeviceManager.cargar();

ForgetManager.ejecutar();

const modelo =

ModelRegistry.buscar(

    "qwen3-3b"

);

ModelLoader.cargar(

    modelo.archivo

);

Navigation.home();
