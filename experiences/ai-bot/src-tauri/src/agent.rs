// agent.rs
use serde_json::json;
use std::time::Duration;

pub struct Agent {
    model: String,
}

impl Agent {
    pub fn new(model: &str) -> Self {
        Self {
            model: model.to_string(),
        }
    }

    pub async fn chat(&self, prompt: &str) -> Result<String, String> {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(120))
            .no_proxy()
            .build()
            .map_err(|e| e.to_string())?;

        let payload = json!({
                    "model": self.model,
                    "prompt": prompt,
                    "stream": false,
                    "options": {
            "num_thread": 6,       // Провери колко ядра имаш и сложи N-2
            "num_ctx": 512,        // Малък контекст = по-бърза работа
            "num_predict": 100,    // Ограничаваме дължината на отговора, за да не чакаш вечно
            "num_gpu": 0           // Форсираме CPU, за да не губи време в опити за VRAM алокация
        }
                });

        let url = "http://127.0.0.1:11434/api/generate";

        let res = client
            .post(url)
            .header("Content-Type", "application/json")
            .json(&payload)
            .send()
            .await
            .map_err(|e| format!("Network Error: {}. Is Ollama blocking the app?", e))?;

        // Първо вземаме статуса (Copy тип, не мести обекта)
        let status = res.status();

        if !status.is_success() {
            // Консумираме обекта тук само ако има грешка
            let err_text = res
                .text()
                .await
                .unwrap_or_else(|_| "Unknown error".to_string());
            return Err(format!("Ollama Error {}: {}", status, err_text));
        }

        // Консумираме обекта тук за финалния резултат
        let body: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;

        Ok(body["response"]
            .as_str()
            .unwrap_or("No response content")
            .to_string())
    }
}
