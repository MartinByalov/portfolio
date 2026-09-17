// identity.rs
use ed25519_dalek::SigningKey;
use rand::rngs::OsRng;
use rand::RngCore;
use serde::{Serialize, Deserialize};
use hex;

#[derive(Serialize, Deserialize, Clone)]
pub struct Identity {
    pub fingerprint: String,
    pub public_key: Vec<u8>,
    #[serde(skip_serializing)]
    pub secret_key: Vec<u8>,
}

pub fn create_new_identity() -> Identity {
    let mut secret_bytes = [0u8; 32];
    OsRng.fill_bytes(&mut secret_bytes);
    
    let signing_key = SigningKey::from_bytes(&secret_bytes);
    let public_key = signing_key.verifying_key();
    
    Identity {
        fingerprint: hex::encode(public_key.as_bytes()),
        public_key: public_key.as_bytes().to_vec(),
        secret_key: signing_key.to_bytes().to_vec(),
    }
}