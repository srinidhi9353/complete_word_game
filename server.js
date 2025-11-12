const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load words (simple wordlist). You can replace data/words.txt with a larger dictionary.
// Words are lowercased.
const WORDS_FILE = path.join(__dirname, 'data', 'words.txt');
const words = new Set();
let trieRoot = {};

// Build simple trie for prefix checks
function insertTrie(word) {
  let node = trieRoot;
  for (const ch of word) {
    if (!node[ch]) node[ch] = {};
    node = node[ch];
  }
  node.isEnd = true;
}

function canHavePrefix(prefix) {
  let node = trieRoot;
  for (const ch of prefix) {
    if (!node[ch]) return false;
    node = node[ch];
  }
  return true;
}

function isFullWord(w) {
  return words.has(w);
}

function loadWords() {
  if (!fs.existsSync(WORDS_FILE)) {
    console.warn('No words file found at', WORDS_FILE);
    return;
  }
  const data = fs.readFileSync(WORDS_FILE, 'utf8');
  data.split(/\r?\n/).forEach(line => {
    const w = line.trim().toLowerCase();
    if (w) {
      words.add(w);
      insertTrie(w);
    }
  });
  console.log(`Loaded ${words.size} words.`);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: check current partial word
app.post('/api/check', (req, res) => {
  const { current } = req.body;
  if (typeof current !== 'string') {
    return res.status(400).json({ error: 'current is required' });
  }
  const w = current.toLowerCase();
  const isWord = isFullWord(w);
  const canContinue = canHavePrefix(w);
  res.json({ isWord, canContinue });
});

// Serve a simple health route
app.get('/api/health', (req, res) => res.json({ ok: true }));

loadWords();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
