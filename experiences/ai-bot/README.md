
                   AI NODE AGENT - README

1. ОПИСАНИЕ НА ПРОТОТИПА

Това приложение е децентрализиран AI възел, изграден с Tauri 2.0 (Rust/React). 
За разлика от стандартните чат ботове, този агент притежава собствена 
криптографска идентичност и може да работи в мрежа без централен облак.

РЕАЛИЗИРАНИ ФУНКЦИИ В ПРОТОТИПА:
- Локален AI Мозък: Директна връзка с Ollama (модел qwen2.5:0.5b).
- RAG Модул: Интегрирано четене на PDF и текстови данни за контекст.
- Крипто-ID: Автоматично генериране на Ed25519 ключове (Node ID).
- P2P Реле: Възможност за хостване на локален сървър за обмен на задачи.
- Auto-Pilot: Автоматичен цикъл за проверка, обработка и отговор на задачи.

2. СИГУРНОСТ И ПОВЕРИТЕЛНОСТ (SECURITY)
Сигурността е заложена в архитектурата на това приложение:

- ЛОКАЛНА ОБРАБОТКА: Всички ваши документи и текстове в "Knowledge Base" 
  остават единствено на вашата машина. Приложението НЕ ги изпраща към 
  никакви външни сървъри или облаци.
  
- РОЛЯТА НА OLLAMA: Ollama се използва ЕДИНСТВЕНО за локално изпълнение 
  на невронната мрежа. Тя действа като изолиран изчислителен двигател, 
  който не предава данните ви в интернет. Комуникацията между бота и 
  Ollama става чрез локален порт (127.0.0.1).

- КРИПТОГРАФСКИ ПОДПИС: Всяко съобщение, изпратено през Relay, е 
  цифрово подписано. Това гарантира, че никой не може да фалшифицира 
  вашата идентичност (Node ID).

3. ИНСТАЛАЦИЯ И СТАРТИРАНЕ (USER)
1. Инсталирайте Ollama от ollama.com.
2. Отворете терминал и изпълнете: ollama run qwen2.5:0.5b
3. Стартирайте приложението (ai-bot.exe).

4. ИНСТРУКЦИИ ЗА РАБОТА
СТЪПКА 1: Конфигуриране на знанията
- В секция "Knowledge Base" поставете текст или използвайте бутона "Upload PDF". 
- Натиснете "Update Text", за да заредите данните.

СТЪПКА 2: Локално ползване
- Напишете въпрос в "AI Brain" и натиснете "Execute Local".
- Ботът ще анализира вашите локални знания и ще върне отговор.

СТЪПКА 3: Работа в мрежа (Relay)
- Споделете вашия Node ID за получаване на задачи.
- Включете "Auto-Pilot" за автоматична обработка на входящи заявки.
- За изпращане на задача: Въведете ID на получателя, напишете текста и пратете.

5. DEVELOPMENT SETUP (FOR CONTRIBUTORS)
To continue updating and developing this node, follow these steps:

PREREQUISITES:
- Rust (https://www.rust-lang.org/)
- Node.js (https://nodejs.org/)
- WebView2 (usually pre-installed on Windows 10/11)

GETTING STARTED:
1. Clone the repository and navigate to the project folder:
   cd ai-node-project

2. Install Frontend dependencies:
   npm install

3. Run in Development Mode (Live Refresh):
   npm run tauri dev

BUILDING THE EXECUTABLE:
To compile the standalone .exe for distribution:
   npm run tauri build

The generated .exe will be located in: 
`src-tauri/target/release/bundle/msi/` or `target/release/`

CORE STACK:
- Frontend: React + TypeScript + Vite
- Backend: Rust (Tauri 2.0)
- Communication: Axum (Relay Server) & Reqwest (Client)
- AI Engine: Ollama API



ЗАБЕЛЕЖКА: Данните в "Knowledge Base" са временни и се изчистват 
при затваряне на приложението за максимална сигурност.
