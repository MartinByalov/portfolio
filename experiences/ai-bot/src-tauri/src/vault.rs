// vault.rs
use chacha20poly1305::{
    aead::{Aead, KeyInit},
    XChaCha20Poly1305, XNonce,
};
use rand::{rngs::OsRng, RngCore};
use std::fs;

pub fn encrypt_data(data: &[u8], secret_key: &[u8]) -> Result<Vec<u8>, String> {
    // Използваме първите 32 байта от secret_key за симетричен ключ
    let key = &secret_key[..32];
    let cipher = XChaCha20Poly1305::new(key.into());

    let mut nonce_bytes = [0u8; 24];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = XNonce::from_slice(&nonce_bytes);

    let ciphertext = cipher
        .encrypt(nonce, data)
        .map_err(|e| format!("Encryption error: {}", e))?;

    // Залепяме nonce към шифрования текст, за да можем да го декриптираме по-късно
    let mut result = nonce_bytes.to_vec();
    result.extend(ciphertext);
    Ok(result)
}

pub fn decrypt_data(encrypted_data: &[u8], secret_key: &[u8]) -> Result<Vec<u8>, String> {
    if encrypted_data.len() < 24 {
        return Err("Invalid data format".to_string());
    }

    let key = &secret_key[..32];
    let cipher = XChaCha20Poly1305::new(key.into());

    let nonce = XNonce::from_slice(&encrypted_data[..24]);
    let ciphertext = &encrypted_data[24..];

    cipher
        .decrypt(nonce, ciphertext)
        .map_err(|e| format!("Decryption error: {}", e))
}
