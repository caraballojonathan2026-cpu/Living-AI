/* ============ ALMA · web client ============ */
"use strict";

/* ---------- utils ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = (p) => p + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmtTime = (ts) => new Date(ts).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (ts) => new Date(ts).toLocaleDateString("es", { day: "numeric", month: "short" });

let toastTimer;
function toast(msg, isError = false) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.toggle("error", isError);
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- store ---------- */
const LS_KEY = "alma.web.v1";
const DEFAULT_SYSTEM = `Eres Alma, la inteligencia artificial personal de Jonathan. Eres cálida, directa y con un toque juguetón. Respondes en español latinoamericano.

Tu misión: ayudarle a pensar mejor, organizar su conocimiento y recordar lo importante. Sé concisa pero útil; si no sabes algo, dilo con honestidad.`;

function defaultState() {
  return {
    conversations: [],
    activeId: null,
    knowledge: [],
    memory: [],
    settings: {
      servers: [
        { id: "srv_local", name: "Este dispositivo", url: "http://localhost:11434" },
        { id: "srv_browser", name: "En este navegador", url: "", browser: true },
      ],
      activeServerId: "srv_local",
      browserModel: null, // { kind:'preset'|'file', id, name } último modelo local usado
      model: "llama3.2:3b",
      temperature: 0.7,
      systemPrompt: DEFAULT_SYSTEM,
    },
  };
}
let S;
try {
  S = Object.assign(defaultState(), JSON.parse(localStorage.getItem(LS_KEY) || "{}"));
  S.settings = Object.assign(defaultState().settings, S.settings || {});
  // migración: endpoint único -> lista de servidores
  if (!Array.isArray(S.settings.servers) || !S.settings.servers.length) {
    const url = (S.settings.endpoint || "http://localhost:11434").trim().replace(/\/+$/, "") || "http://localhost:11434";
    S.settings.servers = [{ id: "srv_local", name: "Este dispositivo", url }];
    S.settings.activeServerId = "srv_local";
  }
  if (!S.settings.servers.some((s) => s.id === S.settings.activeServerId)) {
    S.settings.activeServerId = S.settings.servers[0].id;
  }
  // entrada del modo navegador (GGUF local) para instalaciones anteriores
  if (!S.settings.servers.some((s) => s.id === "srv_browser")) {
    S.settings.servers.push({ id: "srv_browser", name: "En este navegador", url: "", browser: true });
  }
  delete S.settings.endpoint;
} catch { S = defaultState(); }
const save = () => { try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch {} };

const activeConv = () => S.conversations.find((c) => c.id === S.activeId) || null;
const activeServer = () => S.settings.servers.find((s) => s.id === S.settings.activeServerId) || S.settings.servers[0];
const serverUrl = () => (activeServer().url || "").replace(/\/+$/, "");
const isBrowserBackend = () => activeServer().browser === true;

/* ---------- markdown (básico y seguro) ---------- */
function md(src) {
  const codeBlocks = [];
  let h = esc(src);
  // bloques de código
  h = h.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    codeBlocks.push(`<pre><code>${code.replace(/^\n+|\n+$/g, "")}</code></pre>`);
    return `\u0000${codeBlocks.length - 1}\u0000`;
  });
  const lines = h.split("\n");
  const out = [];
  let inList = null; // 'ul' | 'ol'
  const closeList = () => { if (inList) { out.push(`</${inList}>`); inList = null; } };
  const inline = (t) =>
    t
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|\W)\*([^*\n]+)\*(?=\W|$)/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  for (const raw of lines) {
    const line = raw;
    if (/^\u0000\d+\u0000$/.test(line.trim())) { closeList(); out.push(line.trim()); continue; }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)/))) { closeList(); out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`); continue; }
    if (/^\s*---\s*$/.test(line)) { closeList(); out.push("<hr>"); continue; }
    if ((m = line.match(/^\s*&gt;\s?(.*)/)) || (m = line.match(/^\s*>\s?(.*)/))) { closeList(); out.push(`<blockquote>${inline(m[1])}</blockquote>`); continue; }
    if ((m = line.match(/^\s*[-*]\s+(.*)/))) {
      if (inList !== "ul") { closeList(); out.push("<ul>"); inList = "ul"; }
      out.push(`<li>${inline(m[1])}</li>`); continue;
    }
    if ((m = line.match(/^\s*\d+[.)]\s+(.*)/))) {
      if (inList !== "ol") { closeList(); out.push("<ol>"); inList = "ol"; }
      out.push(`<li>${inline(m[1])}</li>`); continue;
    }
    if (/^\s*$/.test(line)) { closeList(); continue; }
    closeList();
    out.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return out.join("\n").replace(/\u0000(\d+)\u0000/g, (_, i) => codeBlocks[+i] || "");
}

/* ---------- contexto para el system prompt ---------- */
function buildSystemPrompt() {
  let sp = S.settings.systemPrompt.trim();
  if (S.knowledge.length) {
    sp += "\n\n## Conocimiento del usuario\n" + S.knowledge
      .map((k) => `### ${k.title}\n${k.content}`).join("\n\n");
  }
  if (S.memory.length) {
    sp += "\n\n## Memoria (recuerda siempre)\n" + S.memory.map((m) => `- ${m.text}`).join("\n");
  }
  return sp;
}

/* ---------- render: conversaciones ---------- */
function renderChatList() {
  const ul = $("#chatList");
  ul.innerHTML = "";
  $("#chatsEmpty").hidden = S.conversations.length > 0;
  [...S.conversations].reverse().forEach((c) => {
    const li = document.createElement("li");
    li.className = "chat-item" + (c.id === S.activeId ? " active" : "");
    li.innerHTML = `<span class="title">${esc(c.title)}</span>
      <span class="mini">
        <button class="mini-btn" data-act="rename" title="Renombrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg></button>
        <button class="mini-btn danger" data-act="del" title="Eliminar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
      </span>`;
    li.addEventListener("click", (e) => {
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "rename") return startRename(c, li);
      if (act === "del") return askDeleteConversation(c);
      setActiveConversation(c.id);
      closeDrawer();
    });
    ul.appendChild(li);
  });
}

function startRename(conv, li) {
  const span = li.querySelector(".title");
  const input = document.createElement("input");
  input.className = "title-input";
  input.value = conv.title;
  input.maxLength = 60;
  span.replaceWith(input);
  input.focus(); input.select();
  const done = (ok) => {
    if (ok && input.value.trim()) { conv.title = input.value.trim(); save(); }
    renderChatList();
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") done(true);
    if (e.key === "Escape") done(false);
    e.stopPropagation();
  });
  input.addEventListener("blur", () => done(true));
  input.addEventListener("click", (e) => e.stopPropagation());
}

let confirmCb = null;
function askConfirm(title, text, cb) {
  $("#confirmTitle").textContent = title;
  $("#confirmText").textContent = text;
  confirmCb = cb;
  openModal("#confirmModal");
}
$("#btnConfirmYes").addEventListener("click", () => {
  closeModal("#confirmModal");
  confirmCb && confirmCb();
});

function askDeleteConversation(c) {
  askConfirm("¿Eliminar conversación?", `Se borrará "${c.title}" y todos sus mensajes.`, () => {
    S.conversations = S.conversations.filter((x) => x.id !== c.id);
    if (S.activeId === c.id) S.activeId = S.conversations[0]?.id ?? null;
    save(); renderChatList(); renderChat();
    toast("Conversación eliminada");
  });
}

function newConversation() {
  const c = { id: uid("c"), title: "Nueva conversación", createdAt: Date.now(), messages: [] };
  S.conversations.push(c);
  S.activeId = c.id;
  save(); renderChatList(); renderChat();
  return c;
}
function setActiveConversation(id) {
  S.activeId = id; save(); renderChatList(); renderChat();
}

/* ---------- render: conocimiento ---------- */
function renderNotes() {
  const ul = $("#noteList");
  ul.innerHTML = "";
  [...S.knowledge].reverse().forEach((k) => {
    const li = document.createElement("li");
    li.className = "note-card";
    li.innerHTML = `<h4>${esc(k.title)}</h4><p>${esc(k.content.slice(0, 140))}${k.content.length > 140 ? "…" : ""}</p>`;
    li.addEventListener("click", () => openNoteModal(k.id));
    ul.appendChild(li);
  });
  if (!S.knowledge.length) ul.innerHTML = `<p class="empty-hint">Sin notas todavía.<br>Agrega apuntes, datos o contexto.</p>`;
}

/* ---------- render: memoria ---------- */
function renderMemory() {
  const ul = $("#memoryList");
  ul.innerHTML = "";
  [...S.memory].reverse().forEach((m) => {
    const li = document.createElement("li");
    li.className = "memory-card";
    li.innerHTML = `<p>${esc(m.text)}</p><span class="date">${fmtDate(m.updatedAt)}</span>`;
    li.addEventListener("click", () => openMemoryModal(m.id));
    ul.appendChild(li);
  });
  if (!S.memory.length) ul.innerHTML = `<p class="empty-hint">Alma aún no recuerda nada de ti.<br>Agrega el primer recuerdo.</p>`;
}

/* ---------- render: chat ---------- */
function renderChat() {
  const chat = $("#chat");
  chat.innerHTML = "";
  const conv = activeConv();
  const hasMessages = conv && conv.messages.length > 0;
  $("#welcome").style.display = hasMessages ? "none" : "flex";
  if (!hasMessages) { $("#chatScroll").scrollTop = 0; return; }
  conv.messages.forEach((m) => chat.appendChild(messageEl(m)));
  $("#chatScroll").scrollTop = $("#chatScroll").scrollHeight;
}

function messageEl(m) {
  const div = document.createElement("div");
  div.className = "msg " + (m.role === "user" ? "user" : "alma");
  const avatar = m.role === "user"
    ? `<div class="avatar">J</div>`
    : `<div class="avatar" style="padding:0;background:none;border:none"><div class="orb orb-xs" style="animation:none"><span class="orb-core"></span></div></div>`;
  div.innerHTML = `${avatar}
    <div class="bubble-wrap">
      <div class="bubble">${m.role === "user" ? esc(m.content).replace(/\n/g, "<br>") : md(m.content)}</div>
      <div class="meta"><span>${fmtTime(m.ts)}</span>
        ${m.role === "assistant" ? `<button class="copy-btn" title="Copiar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copiar</button>` : ""}
      </div>
    </div>`;
  const copyBtn = div.querySelector(".copy-btn");
  if (copyBtn) copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(m.content); toast("Copiado"); }
    catch { toast("No se pudo copiar", true); }
  });
  return div;
}

/* ---------- modales ---------- */
function openModal(sel) { $(sel).hidden = false; }
function closeModal(sel) { $(sel).hidden = true; }
$$("[data-close]").forEach((b) => b.addEventListener("click", () => b.closest(".modal-backdrop").hidden = true));
$$(".modal-backdrop").forEach((bd) => bd.addEventListener("click", (e) => { if (e.target === bd) bd.hidden = true; }));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { $$(".modal-backdrop").forEach((bd) => (bd.hidden = true)); closeDrawer(); }
});

/* ---------- tabs + drawer ---------- */
$$(".tab").forEach((t) => t.addEventListener("click", () => {
  $$(".tab").forEach((x) => x.classList.remove("active"));
  $$(".panel").forEach((x) => x.classList.remove("active"));
  t.classList.add("active");
  $("#panel-" + t.dataset.tab).classList.add("active");
}));
const sidebar = $("#sidebar"), scrim = $("#scrim");
function openDrawer() { sidebar.classList.add("open"); scrim.classList.add("show"); }
function closeDrawer() { sidebar.classList.remove("open"); scrim.classList.remove("show"); }
$("#btnMenu").addEventListener("click", openDrawer);
scrim.addEventListener("click", closeDrawer);

/* ---------- ajustes ---------- */
function loadSettingsIntoForm() {
  const sel = $("#setServer");
  sel.innerHTML = "";
  S.settings.servers.forEach((s) => {
    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = s.browser ? `${s.name} · GGUF local` : `${s.name} · ${s.url}`;
    sel.appendChild(o);
  });
  sel.value = S.settings.activeServerId;
  $("#setModel").value = S.settings.model;
  $("#setTemp").value = S.settings.temperature;
  $("#tempVal").textContent = Number(S.settings.temperature).toFixed(1);
  $("#setSystem").value = S.settings.systemPrompt;
}
function openSettings() { loadSettingsIntoForm(); renderGgufSettings(); $("#connResult").textContent = ""; $("#connResult").className = "conn-result"; openModal("#settingsModal"); }
$("#btnSettings").addEventListener("click", openSettings);
$("#btnSettingsMobile").addEventListener("click", openSettings);
$("#btnOpenSettings").addEventListener("click", openSettings);

$("#setServer").addEventListener("change", (e) => setActiveServer(e.target.value));
$("#setModel").addEventListener("change", (e) => { S.settings.model = e.target.value.trim(); save(); updateTopbar(); });
$("#setTemp").addEventListener("input", (e) => { S.settings.temperature = Number(e.target.value); $("#tempVal").textContent = Number(e.target.value).toFixed(1); save(); });
$("#setSystem").addEventListener("change", (e) => { S.settings.systemPrompt = e.target.value; save(); toast("System prompt guardado"); });

/* ---------- notas de conocimiento ---------- */
let editingNoteId = null;
function openNoteModal(id = null) {
  editingNoteId = id;
  const k = id ? S.knowledge.find((x) => x.id === id) : null;
  $("#noteTitleInput").value = k?.title ?? "";
  $("#noteContentInput").value = k?.content ?? "";
  $("#btnDeleteNote").hidden = !k;
  openModal("#noteModal");
  setTimeout(() => $("#noteTitleInput").focus(), 60);
}
$("#btnAddNote").addEventListener("click", () => openNoteModal());
$("#btnSaveNote").addEventListener("click", () => {
  const title = $("#noteTitleInput").value.trim();
  const content = $("#noteContentInput").value.trim();
  if (!title || !content) { toast("Ponle título y contenido a la nota", true); return; }
  if (editingNoteId) {
    const k = S.knowledge.find((x) => x.id === editingNoteId);
    if (k) { k.title = title; k.content = content; k.updatedAt = Date.now(); }
  } else {
    S.knowledge.push({ id: uid("k"), title, content, updatedAt: Date.now() });
  }
  save(); renderNotes(); closeModal("#noteModal");
  toast("Nota guardada");
});
$("#btnDeleteNote").addEventListener("click", () => {
  askConfirm("¿Eliminar nota?", "Alma dejará de usarla como contexto.", () => {
    S.knowledge = S.knowledge.filter((x) => x.id !== editingNoteId);
    save(); renderNotes(); closeModal("#noteModal");
    toast("Nota eliminada");
  });
});

/* ---------- memoria ---------- */
let editingMemoryId = null;
function openMemoryModal(id = null) {
  editingMemoryId = id;
  const m = id ? S.memory.find((x) => x.id === id) : null;
  $("#memoryInput").value = m?.text ?? "";
  $("#btnDeleteMemory").hidden = !m;
  openModal("#memoryModal");
  setTimeout(() => $("#memoryInput").focus(), 60);
}
$("#btnAddMemory").addEventListener("click", () => openMemoryModal());
$("#btnSaveMemory").addEventListener("click", () => {
  const text = $("#memoryInput").value.trim();
  if (!text) { toast("Escribe el recuerdo primero", true); return; }
  if (editingMemoryId) {
    const m = S.memory.find((x) => x.id === editingMemoryId);
    if (m) { m.text = text; m.updatedAt = Date.now(); }
  } else {
    S.memory.push({ id: uid("m"), text, updatedAt: Date.now() });
  }
  save(); renderMemory(); closeModal("#memoryModal");
  toast("Recuerdo guardado");
});
$("#btnDeleteMemory").addEventListener("click", () => {
  askConfirm("¿Eliminar recuerdo?", "Alma lo olvidará para siempre.", () => {
    S.memory = S.memory.filter((x) => x.id !== editingMemoryId);
    save(); renderMemory(); closeModal("#memoryModal");
    toast("Recuerdo eliminado");
  });
});

/* ---------- servidores ---------- */
function setActiveServer(id, retest = true) {
  if (!S.settings.servers.some((s) => s.id === id)) return;
  S.settings.activeServerId = id;
  save(); renderServers(); loadSettingsIntoForm(); updateTopbar();
  setConn("idle");
  if (retest) testConnection(true);
  toast("Servidor: " + activeServer().name);
}
function renderServers() {
  const ul = $("#serverList");
  ul.innerHTML = "";
  S.settings.servers.forEach((s) => {
    const isBrowser = s.browser === true;
    const li = document.createElement("li");
    li.className = "server-item" + (s.id === S.settings.activeServerId ? " active" : "");
    const sub = isBrowser
      ? (browserLoaded() ? "\u2713 " + browserModelName() : "Sin modelo cargado")
      : s.url;
    li.innerHTML = `<button class="server-main" title="Usar este servidor">
        <span class="server-name">${isBrowser ? "\U0001f4f1 " : ""}${esc(s.name)}${s.id === S.settings.activeServerId ? " · activo" : ""}</span>
        <span class="server-url">${esc(sub)}</span>
      </button>
      ${isBrowser ? "" : `<button class="mini-btn danger" title="Eliminar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>`}`;
    li.querySelector(".server-main").addEventListener("click", () => {
      setActiveServer(s.id);
      if (!(isBrowser && !browserLoaded())) closeModal("#serverModal");
    });
    const delBtn = li.querySelector(".mini-btn");
    if (delBtn) delBtn.addEventListener("click", () => {
      if (S.settings.servers.length <= 1) { toast("No puedes eliminar el único servidor", true); return; }
      askConfirm("¿Eliminar servidor?", `"${s.name}" se quitará de la lista.`, () => {
        S.settings.servers = S.settings.servers.filter((x) => x.id !== s.id);
        if (S.settings.activeServerId === s.id) S.settings.activeServerId = S.settings.servers[0].id;
        save(); renderServers(); loadSettingsIntoForm(); setConn("idle");
        toast("Servidor eliminado");
      });
    });
    ul.appendChild(li);
  });
}
function openServerModal() {
  renderServers();
  renderBrowserCard();
  browserProgressUI(false);
  $("#newServerName").value = "";
  $("#newServerUrl").value = "";
  openModal("#serverModal");
  setTimeout(() => $("#newServerName").focus(), 60);
}
$("#btnAddServer").addEventListener("click", () => {
  const name = $("#newServerName").value.trim();
  let url = $("#newServerUrl").value.trim().replace(/\/+$/, "");
  if (!name || !url) { toast("Ponle nombre y dirección al servidor", true); return; }
  if (!/^https?:\/\//i.test(url)) url = "http://" + url;
  S.settings.servers.push({ id: uid("srv"), name, url });
  save(); renderServers(); loadSettingsIntoForm();
  $("#newServerName").value = "";
  $("#newServerUrl").value = "";
  toast("Servidor agregado — tócalo para usarlo");
});

/* ---------- GGUF en el navegador ---------- */
const PRESETS = {
  qwen05: {
    name: "Qwen2.5 0.5B",
    url: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q8_0.gguf",
    size: "~500 MB",
    desc: "Rápido · ideal para teléfonos",
  },
  qwen15: {
    name: "Qwen2.5 1.5B",
    url: "https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf",
    size: "~1 GB",
    desc: "Mejor calidad · tablets y PC",
  },
};

let ggufMod = null, ggufFailed = false;
async function getGguf() {
  if (ggufFailed) throw new Error("motor local no disponible");
  if (!ggufMod) {
    try { ggufMod = await import("./gguf.js"); }
    catch (e) { ggufFailed = true; throw e; }
  }
  return ggufMod;
}
const browserLoaded = () => !!(ggufMod && ggufMod.isLoaded());
const browserModelName = () => (ggufMod && ggufMod.modelName()) || null;

function fmtMB(n) {
  if (!n || n <= 0) return "";
  return (n / 1048576).toFixed(n > 104857600 ? 0 : 1) + " MB";
}

function renderBrowserCard() {
  const status = $("#browserStatus");
  const loaded = browserLoaded();
  if (loaded) {
    status.textContent = "✓ " + browserModelName();
    status.className = "browser-status ok";
  } else if (S.settings.browserModel) {
    status.textContent = "En caché: " + S.settings.browserModel.name + " — toca Descargar para cargarlo";
    status.className = "browser-status cached";
  } else {
    status.textContent = "Sin modelo";
    status.className = "browser-status";
  }
  $("#btnUseBrowser").hidden = !loaded;
  const gpuNote = $("#gpuNote");
  getGguf().then((g) => {
    gpuNote.textContent = g.webGpuSupported()
      ? "Tu navegador tiene WebGPU: irá más rápido."
      : "Tu navegador no tiene WebGPU: usará CPU (más lento, pero funciona).";
  }).catch(() => { gpuNote.textContent = ""; });
}

function browserProgressUI(loading) {
  $("#browserProgress").hidden = !loading;
  if (!loading) { $("#browserBar").style.width = "0%"; $("#browserPct").textContent = ""; }
}

async function loadBrowserModel(kind) {
  let gguf;
  try { gguf = await getGguf(); }
  catch { toast("No se pudo cargar el motor local (revisa tu internet)", true); return; }
  const preset = kind === "preset" ? PRESETS[$("#presetModel").value] : null;
  const file = kind === "file" ? $("#fileGguf").files[0] : null;
  if (kind === "file" && !file) return;
  const name = kind === "preset" ? preset.name : file.name;
  $("#browserStatus").textContent = "Cargando " + name + "…";
  $("#browserStatus").className = "browser-status loading";
  browserProgressUI(true);
  try {
    if (kind === "preset") {
      await gguf.loadFromUrl(preset.url, preset.name, (loaded, total) => {
        const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;
        $("#browserBar").style.width = pct + "%";
        $("#browserPct").textContent = total > 0 ? `${pct}% · ${fmtMB(loaded)} de ${fmtMB(total)}` : fmtMB(loaded);
      });
    } else {
      await gguf.loadFromFile(file, () => {
        $("#browserPct").textContent = "Leyendo archivo…";
      });
    }
    S.settings.browserModel = { kind, id: kind === "preset" ? $("#presetModel").value : null, name };
    save();
    browserProgressUI(false);
    setActiveServer("srv_browser");
    renderBrowserCard(); renderGgufSettings();
    toast("Modelo listo — ya puedes chatear 🖤");
  } catch (e) {
    browserProgressUI(false);
    renderBrowserCard();
    toast("No se pudo cargar el modelo", true);
  }
}

$("#btnLoadPreset").addEventListener("click", () => loadBrowserModel("preset"));
$("#btnPickGguf").addEventListener("click", () => $("#fileGguf").click());
$("#fileGguf").addEventListener("change", () => loadBrowserModel("file"));
$("#btnUseBrowser").addEventListener("click", () => {
  setActiveServer("srv_browser");
  closeModal("#serverModal");
});
$("#btnLoadGgufSettings").addEventListener("click", () => $("#fileGguf").click());

function renderGgufSettings() {
  const el = $("#ggufStatus");
  if (!el) return;
  if (browserLoaded()) {
    el.textContent = "✓ " + browserModelName();
    el.className = "browser-status ok";
  } else {
    el.textContent = "Sin modelo";
    el.className = "browser-status";
  }
}

/* ---------- estado de conexión ---------- */
function setConn(state, text) {
  const pill = $("#connPill");
  pill.classList.remove("ok", "bad", "checking");
  const dot = $("#connDot"), label = $("#connText");
  if (state === "ok") { pill.classList.add("ok"); label.textContent = text || "Conectado"; }
  else if (state === "bad") { pill.classList.add("bad"); label.textContent = text || "Desconectado"; }
  else if (state === "checking") { pill.classList.add("checking"); label.textContent = "Verificando…"; }
  else { label.textContent = "Sin verificar"; }
}
async function testConnection(quiet = false) {
  if (isBrowserBackend()) {
    if (browserLoaded()) {
      setConn("ok", "En este navegador · listo");
      return true;
    }
    setConn("bad", "En este navegador · sin modelo");
    return false;
  }
  const base = serverUrl();
  if (!quiet) setConn("checking");
  try {
    const res = await fetch(base + "/api/tags", { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const models = (data.models || []).map((m) => m.name);
    const dl = $("#modelList");
    dl.innerHTML = "";
    models.forEach((m) => { const o = document.createElement("option"); o.value = m; dl.appendChild(o); });
    setConn("ok", `Conectado · ${activeServer().name}`);
    if (!quiet) {
      const r = $("#connResult");
      r.className = "conn-result ok";
      r.textContent = `Conexión exitosa. Modelos disponibles: ${models.join(", ") || "ninguno — haz 'ollama pull " + S.settings.model + "'"}.`;
    }
    return true;
  } catch (err) {
    setConn("bad");
    if (!quiet) {
      const r = $("#connResult");
      r.className = "conn-result bad";
      r.textContent = "No se pudo conectar a Ollama en " + base + ". Revisa que esté corriendo con OLLAMA_ORIGINS=*.";
    }
    return false;
  }
}
$("#btnTestConn").addEventListener("click", () => testConnection(false));
$("#connPill").addEventListener("click", openServerModal);
$("#btnRetryConn").addEventListener("click", async () => {
  const ok = await testConnection(false);
  if (ok) { $("#offlineCard").hidden = true; toast("Alma está en línea"); }
});

/* ---------- chat con modelo GGUF en el navegador ---------- */
let stopLocal = false;
async function sendMessageLocal(content) {
  let gguf;
  try { gguf = await getGguf(); }
  catch { toast("No se pudo cargar el motor local", true); return; }
  if (!gguf.isLoaded()) {
    toast("Primero carga un modelo .gguf", true);
    openServerModal();
    return;
  }
  let conv = activeConv();
  if (!conv) conv = newConversation();
  conv.messages.push({ role: "user", content, ts: Date.now() });
  if (conv.messages.length === 1) {
    conv.title = content.slice(0, 42) + (content.length > 42 ? "…" : "");
  }
  $("#composer").value = "";
  autogrow();
  save(); renderChatList(); renderChat();
  $("#welcome").style.display = "none";

  const chat = $("#chat");
  const el = messageEl({ role: "assistant", content: "", ts: Date.now() });
  const bubble = el.querySelector(".bubble");
  bubble.classList.add("streaming");
  chat.appendChild(el);
  scrollBottom();

  const history = conv.messages.slice(-21, -1).map((m) => ({ role: m.role, content: m.content }));
  const messages = [
    { role: "system", content: buildSystemPrompt() },
    ...history,
    { role: "user", content },
  ];
  stopLocal = false;
  aborter = { abort() { stopLocal = true; } };
  setGenerating(true);
  let full = "";
  try {
    full = await gguf.chat(messages, {
      temperature: S.settings.temperature,
      onToken: (piece, f) => { full = f; bubble.innerHTML = md(full); scrollBottom(true); },
      shouldStop: () => stopLocal,
    });
    bubble.classList.remove("streaming");
    bubble.innerHTML = md(full) || "<p><em>Sin respuesta del modelo.</em></p>";
    if (full.trim()) {
      conv.messages.push({ role: "assistant", content: full, ts: Date.now() });
      save();
    }
    const fresh = messageEl({ role: "assistant", content: full, ts: Date.now() });
    el.replaceWith(fresh);
    scrollBottom();
  } catch (err) {
    bubble.classList.remove("streaming");
    if (stopLocal && full.trim()) {
      conv.messages.push({ role: "assistant", content: full + "\n\n*(respuesta detenida)*", ts: Date.now() });
      save(); renderChat();
    } else if (!stopLocal) {
      el.remove();
      toast("El modelo local falló al responder", true);
    } else {
      el.remove();
    }
  } finally {
    aborter = null;
    setGenerating(false);
    renderChatList();
  }
}

/* ---------- chat con Ollama (streaming) ---------- */
let aborter = null;
function updateTopbar() {
  $("#topbarModel").textContent = isBrowserBackend()
    ? "Alma · " + (browserModelName() || "sin modelo")
    : "Alma · " + (S.settings.model || "sin modelo");
}
function setGenerating(on) {
  $("#btnSend").hidden = on;
  $("#btnStop").hidden = !on;
  $("#composer").disabled = on;
}
$("#btnStop").addEventListener("click", () => aborter?.abort());

async function sendMessage(text) {
  const content = (text ?? $("#composer").value).trim();
  if (!content || aborter) return;
  if (isBrowserBackend()) return sendMessageLocal(content);
  let conv = activeConv();
  if (!conv) conv = newConversation();
  conv.messages.push({ role: "user", content, ts: Date.now() });
  if (conv.messages.length === 1) {
    conv.title = content.slice(0, 42) + (content.length > 42 ? "…" : "");
  }
  $("#composer").value = "";
  autogrow();
  save(); renderChatList(); renderChat();
  $("#welcome").style.display = "none";

  // burbuja de Alma en streaming
  const chat = $("#chat");
  const el = messageEl({ role: "assistant", content: "", ts: Date.now() });
  const bubble = el.querySelector(".bubble");
  bubble.classList.add("streaming");
  chat.appendChild(el);
  scrollBottom();

  const history = conv.messages.slice(-21, -1).map((m) => ({ role: m.role, content: m.content }));
  const messages = [
    { role: "system", content: buildSystemPrompt() },
    ...history,
    { role: "user", content },
  ];
  const base = serverUrl();
  aborter = new AbortController();
  setGenerating(true);
  let full = "";
  try {
    const res = await fetch(base + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: S.settings.model,
        messages,
        stream: true,
        options: { temperature: S.settings.temperature },
      }),
      signal: aborter.signal,
    });
    if (!res.ok || !res.body) throw new Error("HTTP " + res.status);
    setConn("ok", "Conectado");
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const line of lines) {
        const t = line.trim();
        if (!t) continue;
        try {
          const j = JSON.parse(t);
          const piece = j.message?.content || "";
          if (piece) { full += piece; bubble.innerHTML = md(full); scrollBottom(true); }
          if (j.done) break;
        } catch { /* línea parcial, se completa en el siguiente chunk */ }
      }
    }
    bubble.classList.remove("streaming");
    bubble.innerHTML = md(full) || "<p><em>Sin respuesta del modelo.</em></p>";
    if (full.trim()) {
      conv.messages.push({ role: "assistant", content: full, ts: Date.now() });
      save();
    }
    // re-render para activar el botón copiar con el contenido final
    const fresh = messageEl({ role: "assistant", content: full, ts: Date.now() });
    el.replaceWith(fresh);
    scrollBottom();
  } catch (err) {
    bubble.classList.remove("streaming");
    const aborted = err?.name === "AbortError";
    if (aborted && full.trim()) {
      conv.messages.push({ role: "assistant", content: full + "\n\n*(respuesta detenida)*", ts: Date.now() });
      save(); renderChat();
    } else if (!aborted) {
      el.remove();
      setConn("bad");
      $("#offlineCard").hidden = false;
      $("#offlineCard").scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      el.remove();
    }
  } finally {
    aborter = null;
    setGenerating(false);
    renderChatList();
  }
}

function scrollBottom(keep = false) {
  const sc = $("#chatScroll");
  if (!keep || sc.scrollHeight - sc.scrollTop - sc.clientHeight < 120) {
    sc.scrollTop = sc.scrollHeight;
  }
}

$("#btnSend").addEventListener("click", () => sendMessage());
$("#btnNewChat").addEventListener("click", () => { newConversation(); closeDrawer(); });

/* ---------- composer ---------- */
const composer = $("#composer");
function autogrow() {
  composer.style.height = "auto";
  composer.style.height = Math.min(composer.scrollHeight, 140) + "px";
}
composer.addEventListener("input", autogrow);
composer.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
$$(".chip").forEach((c) => c.addEventListener("click", () => {
  composer.value = c.dataset.prompt;
  autogrow();
  composer.focus();
}));

/* ---------- init ---------- */
function init() {
  renderChatList();
  renderNotes();
  renderMemory();
  renderChat();
  updateTopbar();
  setConn("idle");
  testConnection(true);
  autogrow();
}
init();
