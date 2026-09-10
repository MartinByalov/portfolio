import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Ensure proper mime type mapping for epub files
express.static.mime.define({
  'application/epub+zip': ['epub']
});

// Serve static assets from project root
app.use(express.static(__dirname, {
  extensions: ['html', 'htm'],
  index: ['index.html']
}));

// Route fallback to index.html for root or SPA paths
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
