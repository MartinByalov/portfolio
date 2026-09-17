// main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use axum::{
    extract::{Path, State as AxumState},
    routing::{get, post},
    Json, Router,
};
use ed25519_dalek::{Signer, SigningKey};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, VecDeque};
use std::sync::{Arc, Mutex, RwLock};
use tauri::State;

mod agent;

type SharedRelayData = Arc<RwLock<HashMap<String, VecDeque<String>>>>;

pub struct AppState {
    signing_key: Mutex<SigningKey>,
    relay_url: Mutex<String>,
    relay_data: SharedRelayData,
    knowledge: Mutex<String>,
}

#[derive(Clone, Serialize, Deserialize)]
struct RelayMessage {
    recipient: String,
    payload: String,
    signature: String,
}

#[tauri::command]
async fn get_identity(state: State<'_, AppState>) -> Result<String, String> {
    let key = state.signing_key.lock().unwrap();
    Ok(hex::encode(key.verifying_key().to_bytes()))
}

#[tauri::command]
fn open_ollama_download() -> Result<(), String> {
    std::process::Command::new("cmd.exe")
        .args(["/C", "start", "", "https://ollama.com/download"])
        .spawn()
        .map(|_| ())
        .map_err(|error| format!("Could not open Ollama download page: {error}"))
}

#[tauri::command]
async fn set_relay_url(state: State<'_, AppState>, new_url: String) -> Result<(), String> {
    let mut url = state.relay_url.lock().unwrap();
    *url = new_url;
    Ok(())
}

#[tauri::command]
async fn update_knowledge(state: State<'_, AppState>, text: String) -> Result<(), String> {
    let mut k = state.knowledge.lock().unwrap();
    *k = text;
    Ok(())
}

#[tauri::command]
async fn upload_pdf(state: State<'_, AppState>, path: String) -> Result<String, String> {
    let bytes = std::fs::read(&path).map_err(|e| e.to_string())?;
    let content = pdf_extract::extract_text_from_mem(&bytes).map_err(|e| e.to_string())?;
    let mut k = state.knowledge.lock().unwrap();
    *k = content.clone();
    Ok(format!(
        "Successfully ingested {} characters from PDF",
        content.len()
    ))
}

#[tauri::command]
async fn ask_ai(state: State<'_, AppState>, prompt: String) -> Result<String, String> {
    let context = state.knowledge.lock().unwrap().clone();
    let ai_agent = agent::Agent::new("qwen2.5:0.5b");
    let full_prompt = if context.is_empty() {
        prompt
    } else {
        format!(
            "System: Use the following context to answer.\nContext: {}\nUser: {}",
            context, prompt
        )
    };
    ai_agent.chat(&full_prompt).await
}

#[tauri::command]
async fn start_local_relay(state: State<'_, AppState>) -> Result<String, String> {
    let data = state.relay_data.clone();
    tokio::spawn(async move {
        let app = Router::new()
            .route("/push", post(push_handler))
            .route("/pull/:id", get(pull_handler))
            .with_state(data);
        let addr = std::net::SocketAddr::from(([0, 0, 0, 0], 8080));
        let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
        axum::serve(listener, app).await.unwrap();
    });
    Ok("Relay active".to_string())
}

async fn push_handler(AxumState(state): AxumState<SharedRelayData>, Json(msg): Json<RelayMessage>) {
    let mut map = state.write().unwrap();
    map.entry(msg.recipient).or_default().push_back(msg.payload);
}

async fn pull_handler(
    Path(id): Path<String>,
    AxumState(state): AxumState<SharedRelayData>,
) -> Json<Vec<String>> {
    let mut map = state.write().unwrap();
    let msgs: Vec<String> = map
        .get_mut(&id)
        .map(|q| q.drain(..).collect())
        .unwrap_or_default();
    Json(msgs)
}

#[tauri::command]
async fn send_to_relay(
    state: State<'_, AppState>,
    recipient: String,
    message: String,
) -> Result<(), String> {
    let (sig, url) = {
        let key = state.signing_key.lock().unwrap();
        let s = hex::encode(key.sign(message.as_bytes()).to_bytes());
        let u = state.relay_url.lock().unwrap().clone();
        (s, u)
    };
    let client = reqwest::Client::builder()
        .no_proxy()
        .build()
        .map_err(|e| e.to_string())?;
    client
        .post(format!("{}/push", url))
        .json(&RelayMessage {
            recipient,
            payload: message,
            signature: sig,
        })
        .send()
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn check_mail(state: State<'_, AppState>) -> Result<Vec<String>, String> {
    let (id, url) = {
        let key = state.signing_key.lock().unwrap();
        let u = state.relay_url.lock().unwrap().clone();
        (hex::encode(key.verifying_key().to_bytes()), u)
    };
    let client = reqwest::Client::builder()
        .no_proxy()
        .build()
        .map_err(|e| e.to_string())?;
    let res = client
        .get(format!("{}/pull/{}", url, id))
        .send()
        .await
        .map_err(|e| e.to_string())?;
    Ok(res.json().await.unwrap_or_default())
}

fn main() {
    let signing_key = SigningKey::generate(&mut OsRng);
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            signing_key: Mutex::new(signing_key),
            relay_url: Mutex::new("http://127.0.0.1:8080".to_string()),
            relay_data: Arc::new(RwLock::new(HashMap::new())),
            knowledge: Mutex::new(String::new()),
        })
        .invoke_handler(tauri::generate_handler![
            get_identity,
            open_ollama_download,
            ask_ai,
            send_to_relay,
            check_mail,
            start_local_relay,
            set_relay_url,
            update_knowledge,
            upload_pdf
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}