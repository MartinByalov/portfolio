// App.tsx
import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { openUrl } from "@tauri-apps/plugin-opener";
import "./App.css";

function App() {
  const [identity, setIdentity] = useState("...");
  const [prompt, setPrompt] = useState("");
  const [ollamaRes, setOllamaRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [relayMsg, setRelayMsg] = useState("");
  const [status, setStatus] = useState("Checking system...");
  const [inbox, setInbox] = useState<string[]>([]);
  const [autoLoop, setAutoLoop] = useState(false);
  const [knowledge, setKnowledge] = useState("");
  const [ollamaReady, setOllamaReady] = useState(false);
  
  const [serverUrl, setServerUrl] = useState("http://127.0.0.1:8080");
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isHosting, setIsHosting] = useState(false);
  const loopRef = useRef<number | null>(null);

  useEffect(() => {
    checkOllama();
    invoke("get_identity").then((id) => setIdentity(id as string));
  }, []);

  async function checkOllama() {
    try {
      const response = await fetch("http://127.0.0.1:11434/api/tags");
      if (response.ok) {
        const data = await response.json();
        const hasModel = data.models?.some((m: any) => 
          m.name.toLowerCase().includes("qwen2.5:0.5b")
        );
        if (hasModel) {
          setOllamaReady(true);
          setStatus("System Ready");
        } else {
          setOllamaReady(false);
          setStatus("Model qwen2.5:0.5b missing!");
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      setOllamaReady(false);
      setStatus("Ollama is not running!");
    }
  }

  async function handleDownloadOllama() {
    const ollamaUrl = "https://ollama.com/download";

    try {
      await invoke("open_ollama_download");
    } catch (err) {
      console.error("Failed to open URL", err);

      // Use the opener plugin in development/browser contexts or as a
      // fallback for older builds that do not contain the native command.
      try {
        await openUrl(ollamaUrl);
      } catch (fallbackError) {
        console.error("Failed to open URL with Tauri opener", fallbackError);
        const browserWindow = window.open(ollamaUrl, "_blank", "noopener,noreferrer");
        if (!browserWindow) {
          window.location.assign(ollamaUrl);
        }
      }
    }
  }

  useEffect(() => {
    if (autoLoop) {
      setStatus("Monitoring...");
      loopRef.current = window.setInterval(async () => {
        try {
          const messages = await invoke("check_mail") as string[];
          if (messages.length > 0) {
            for (const task of messages) {
              setInbox(prev => [`[IN] ${task}`, ...prev]);
              const res = await invoke("ask_ai", { prompt: task }) as string;
              setInbox(prev => [`[OUT] ${res}`, ...prev]);
            }
          }
        } catch (e) { setStatus("Relay Error"); }
      }, 5000);
    } else {
      if (loopRef.current) clearInterval(loopRef.current);
    }
    return () => { if (loopRef.current) clearInterval(loopRef.current); };
  }, [autoLoop]);

  useEffect(() => {
    if (!showHelp) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowHelp(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showHelp]);

  async function handlePdfUpload() {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });
    if (selected && typeof selected === 'string') {
      setStatus("Processing PDF...");
      try {
        const res = await invoke("upload_pdf", { path: selected });
        setStatus("PDF Loaded");
        setOllamaRes(res as string);
      } catch (err) { setStatus("Load Error"); }
    }
  }

  async function handleLocalExecute() {
    if (!ollamaReady) {
      setOllamaRes("Error: Ollama or Model missing.");
      return;
    }
    setLoading(true);
    setOllamaRes("AI is thinking...");
    try {
      const res = await invoke("ask_ai", { prompt });
      setOllamaRes(res as string);
    } catch (err) { setOllamaRes("AI Error: Execution failed."); }
    setLoading(false);
  }

  return (
    <div className="container">
      {!ollamaReady && (
        <div className="setup-warning">
          <div>
            ⚠️ <strong>System Requirement:</strong> {status}
            {status.includes("missing") && (
              <span style={{marginLeft: '10px', fontSize: '0.8rem', opacity: 0.8}}>
                (Run: <code>ollama run qwen2.5:0.5b</code>)
              </span>
            )}
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            <button onClick={handleDownloadOllama} className="btn-check" style={{borderColor: '#e3b341'}}>Download Ollama</button>
            <button onClick={checkOllama} className="btn-check">Retry Check</button>
          </div>
        </div>
      )}

      <header>
        <div>
          <h1>Secure AI Node</h1>
          <div className="identity-box">Node ID: <code>{identity}</code></div>
        </div>
        <div className="button-group">
          <button onClick={() => invoke("start_local_relay").then(() => setIsHosting(true))} className="btn-check">
            {isHosting ? "🟢 Hosting" : "📡 Start Relay"}
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className="btn-check">⚙</button>
          <button
            onClick={() => setShowHelp(true)}
            className="btn-check help-button"
            aria-label="Как работи AI Bot"
            title="Как работи AI Bot"
          >
            ?
          </button>
        </div>
      </header>

      {showHelp && (
        <div className="help-overlay" role="presentation" onClick={() => setShowHelp(false)}>
          <section
            className="help-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="help-modal-header">
              <h2 id="help-title">Как работи AI Bot</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="help-close"
                aria-label="Затвори помощта"
                title="Затвори"
              >
                ×
              </button>
            </div>

            <div className="help-content">
              <p className="help-intro">
                AI Bot е локален AI възел. Той използва Ollama за отговори и може да обменя задачи с други възли чрез Relay.
              </p>

              <h3>Първоначална настройка</h3>
              <ol>
                <li>Натиснете <strong>Download Ollama</strong> и инсталирайте Ollama от официалния сайт.</li>
                <li>Отворете Command Prompt или PowerShell и изпълнете <code>ollama run qwen2.5:0.5b</code>. Това изтегля и стартира нужния модел.</li>
                <li>Върнете се в AI Bot и натиснете <strong>Retry Check</strong>. При успешно свързване статусът ще стане <strong>System Ready</strong>.</li>
              </ol>

              <h3>Работа с лични знания</h3>
              <ol>
                <li>В <strong>Knowledge Base</strong> поставете текст или използвайте <strong>Upload PDF</strong>.</li>
                <li>Натиснете <strong>Update Text</strong>, за да заредите текста като контекст.</li>
                <li>В <strong>AI Brain</strong> напишете въпрос и натиснете <strong>Execute Local</strong>.</li>
                <li>Отговорът се създава локално от Ollama, като се използва зареденият контекст.</li>
              </ol>

              <h3>Работа с Relay</h3>
              <ol>
                <li>Натиснете <strong>Start Relay</strong>, за да стартирате локален Relay сървър.</li>
                <li>Вашият <strong>Node ID</strong> е криптографската идентичност на този възел. Споделете го с другия участник, за да получавате задачи.</li>
                <li>За изпращане въведете неговия Node ID в <strong>Recipient Node ID</strong>, напишете съобщение и натиснете <strong>Send Task</strong>.</li>
                <li>Включете <strong>Auto-Pilot</strong>, ако искате ботът автоматично да проверява за входящи задачи и да отговаря.</li>
              </ol>

              <div className="help-note">
                Документите и текстът в Knowledge Base остават на вашата машина и се изчистват при затваряне на приложението. Ollama работи чрез локалния адрес <code>127.0.0.1</code>.
              </div>
            </div>
          </section>
        </div>
      )}

      {showSettings && (
        <div className="settings-panel">
          <input value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} placeholder="Relay URL" />
          <button onClick={() => invoke("set_relay_url", { newUrl: serverUrl })}>Save URL</button>
        </div>
      )}

      <div className="grid-layout">
        <section className="panel">
          <div className="panel-header"><h2>1. Knowledge Base</h2></div>
          <div className="panel-content">
            <textarea 
              placeholder="Paste text or upload PDF..."
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
            />
            <div className="button-group">
              <button onClick={() => invoke("update_knowledge", { text: knowledge })} className="btn-check" style={{flex: 1}}>Update Text</button>
              <button onClick={handlePdfUpload} className="btn-check" style={{flex: 1}}>📄 Upload PDF</button>
            </div>
            <div style={{fontSize: '0.75rem', color: ollamaReady ? 'var(--text-muted)' : 'var(--danger)'}}>
              Status: {status}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header"><h2>2. AI Brain</h2></div>
          <div className="panel-content">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask anything..." />
            <button onClick={handleLocalExecute} disabled={loading || !ollamaReady} className="btn-send">Execute Local</button>
            {ollamaRes && <div className="response-area">{ollamaRes}</div>}
          </div>
        </section>

        <section className="panel" style={{gridColumn: 'span 2'}}>
          <div className="panel-header"><h2>3. Remote Relay & Tasks</h2></div>
          <div className="panel-content grid-layout">
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              <input placeholder="Recipient Node ID" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
              <textarea placeholder="Task message..." value={relayMsg} onChange={(e) => setRelayMsg(e.target.value)} />
              <div className="button-group">
                <button onClick={() => invoke("send_to_relay", { recipient, message: relayMsg })} className="btn-send" style={{flex: 2}}>Send Task</button>
                <button onClick={() => setAutoLoop(!autoLoop)} className="btn-check" style={{flex: 1}}>{autoLoop ? "Stop" : "Auto-Pilot"}</button>
              </div>
            </div>
            <div className="inbox-list">
              <div className="log-title">Activity Log</div>
              {inbox.map((msg, i) => (
                <div key={i} className={`inbox-item ${msg.includes('[IN]') ? 'log-in' : 'log-out'}`}>
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;