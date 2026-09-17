// server.rs
use axum::{
    extract::{Path, State},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, VecDeque};
use std::sync::{Arc, RwLock};
use std::net::SocketAddr;

#[derive(Clone, Serialize, Deserialize)]
struct RelayMessage {
    recipient: String,
    payload: String,
    signature: String,
}

type SharedState = Arc<RwLock<HashMap<String, VecDeque<String>>>>;

#[tokio::main]
async fn main() {
    let state = SharedState::default();

    let app = Router::new()
        .route("/push", post(push_message))
        .route("/pull/:id", get(pull_messages))
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("🚀 Blind Relay running on http://{}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn push_message(
    State(state): State<SharedState>,
    Json(payload): Json<RelayMessage>,
) {
    let mut map = state.write().unwrap();
    map.entry(payload.recipient)
        .or_insert_with(VecDeque::new)
        .push_back(payload.payload);
    println!("📩 New message queued for recipient");
}

async fn pull_messages(
    Path(id): Path<String>,
    State(state): State<SharedState>,
) -> Json<Vec<String>> {
    let mut map = state.write().unwrap();
    if let Some(queue) = map.get_mut(&id) {
        let messages: Vec<String> = queue.drain(..).collect();
        return Json(messages);
    }
    Json(vec![])
}