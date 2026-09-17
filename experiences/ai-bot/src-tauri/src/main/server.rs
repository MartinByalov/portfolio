// src/bin/server.rs
// Името на файла: server.rs

use axum::{extract::{Path, State}, routing::{get, post}, Json, Router};
use serde::{Deserialize, Serialize};
use std::{collections::{HashMap, VecDeque}, sync::{Arc, RwLock}, net::SocketAddr};

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
        .route("/push", post(push_handler))
        .route("/pull/:id", get(pull_handler))
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("🚀 Relay Active on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn push_handler(State(state): State<SharedState>, Json(msg): Json<RelayMessage>) {
    let mut map = state.write().unwrap();
    map.entry(msg.recipient).or_default().push_back(msg.payload);
}

async fn pull_handler(Path(id): Path<String>, State(state): State<SharedState>) -> Json<Vec<String>> {
    let mut map = state.write().unwrap();
    let msgs = map.get_mut(&id).map(|q| q.drain(..).collect()).unwrap_or_default();
    Json(msgs)
}