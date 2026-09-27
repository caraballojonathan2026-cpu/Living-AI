# Alma — cliente web

Cliente web estático para **Alma**, la IA personal de Jonathan. Sin paso de compilación: funciona tal cual en GitHub Pages.

## Archivos

- `index.html` — estructura de la app
- `styles.css` — tema oscuro futurista, glassmorphism, responsive mobile-first
- `app.js` — lógica: chat con streaming, conversaciones, conocimiento, memoria y ajustes

## Cómo probarlo en local

```bash
cd ~/workspace/living-ai-web
python3 -m http.server 8000
```

Abrir http://localhost:8000 en el navegador.

## Cómo corre Alma (2 modos)

1. **📱 En este navegador (recomendado en móvil)**: la píldora de conexión abre el panel donde puedes descargar un modelo `.gguf` (Qwen2.5 0.5B ~500 MB o 1.5B ~1 GB) o elegir un `.gguf` desde tu dispositivo. Corre 100% local con WebAssembly/WebGPU vía [wllama](https://github.com/ngxson/wllama), sin Ollama ni PC. El modelo descargado queda en caché del navegador.
2. **Servidores Ollama**: agrega tu PC u otros servidores por IP en el mismo panel.

## Conectar Ollama (modo servidor)

La app es solo el frontend: necesita Ollama corriendo en la misma máquina.

```bash
# 1. Instalar Ollama desde https://ollama.com
# 2. Descargar un modelo
ollama pull llama3.2:3b
# 3. Iniciarlo permitiendo peticiones del navegador (obligatorio)
OLLAMA_ORIGINS=* ollama serve
```

Luego en la app: **Ajustes → Probar conexión**. El endpoint por defecto es `http://localhost:11434`.

## Qué incluye

- Chat con respuestas en streaming, render markdown (negritas, listas, código, citas), timestamps y botón copiar.
- Conversaciones múltiples con crear / renombrar / eliminar (localStorage).
- **Conocimiento**: notas que se inyectan como contexto en el system prompt (equivalente web de `biblioteca/`).
- **Memoria**: recuerdos persistentes sobre el usuario, editables.
- **Ajustes**: endpoint de Ollama, modelo, temperatura, system prompt editable y prueba de conexión.
- Estado "desconectado" elegante con instrucciones paso a paso si Ollama no responde.
- Todo persiste en `localStorage`; nada sale del navegador salvo las peticiones al Ollama local.

## Publicar en GitHub Pages

Subir los 3 archivos a un repo y activar Pages (Settings → Pages → Deploy from branch). No requiere build.
