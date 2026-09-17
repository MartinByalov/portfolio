// protocol.rs
use serde::{Serialize, Deserialize};
use crate::vault::encrypt_data;

#[derive(Serialize, Deserialize, Debug)]
pub struct SecureMessage {
    pub sender: String,
    pub recipient: String,
    pub payload: Vec<u8>,
}

impl SecureMessage {
    pub fn new(sender: String, recipient: String, data: String, shared_secret: &[u8]) -> Result<Self, String> {
        let encrypted_payload = encrypt_data(data.as_bytes(), shared_secret)?;
        Ok(Self {
            sender,
            recipient,
            payload: encrypted_payload,
        })
    }
}