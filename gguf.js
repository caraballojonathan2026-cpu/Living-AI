/* ============ ALMA · GGUF en el navegador (wllama) ============
   Ejecuta un modelo .gguf directamente en el navegador con WebAssembly
   y WebGPU (si está disponible). Sin Ollama, sin servidor.
   Se carga de forma diferida: solo se descarga el motor cuando se usa. */
"use strict";

const WLLAMA_VERSION = "3.2.3";
const WLLAMA_ESM = `https://cdn.jsdelivr.net/npm/@wllama/wllama@${WLLAMA_VERSION}/esm/index.js`;
const WLLAMA_WASM = `https://cdn.jsdelivr.net/npm/@wllama/wllama@${WLLAMA_VERSION}/src/wasm/wllama.wasm`;

let wllama = null;
let currentModel = null; // { name, kind: 'preset'|'file' }

async function getInstance() {
  if (!wllama) {
    const { Wllama, LoggerWithoutDebug } = await import(WLLAMA_ESM);
    wllama = new Wllama({ default: WLLAMA_WASM }, { logger: LoggerWithoutDebug });
  }
  return wllama;
}

export function webGpuSupported() {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

/** Carga un .gguf desde una URL (se guarda en caché del navegador). */
export async function loadFromUrl(url, name, onProgress) {
  const w = await getInstance();
  await w.loadModelFromUrl(url, {
    n_ctx: 2048,
    progressCallback: ({ loaded, total }) => onProgress && onProgress(loaded, total),
  });
  currentModel = { name, kind: "preset" };
}

/** Carga un .gguf elegido desde el dispositivo (solo dura esta sesión). */
export async function loadFromFile(file, onProgress) {
  const w = await getInstance();
  onProgress && onProgress(0, 0);
  await w.loadModel([file], { n_ctx: 2048 });
  onProgress && onProgress(1, 1);
  currentModel = { name: file.name, kind: "file" };
}

export function isLoaded() {
  return !!wllama && wllama.isModelLoaded();
}

export function modelName() {
  return currentModel ? currentModel.name : null;
}

/** Chat con streaming. onToken(piece, full). shouldStop() para detener. */
export async function chat(messages, { temperature = 0.7, maxTokens = 512, onToken, shouldStop } = {}) {
  const w = await getInstance();
  const stream = await w.createChatCompletion({
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: true,
  });
  let full = "";
  for await (const chunk of stream) {
    if (shouldStop && shouldStop()) break;
    const piece = chunk.choices?.[0]?.delta?.content || "";
    if (piece) {
      full += piece;
      if (onToken) onToken(piece, full);
    }
  }
  return full;
}
