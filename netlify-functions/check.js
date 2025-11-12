const fs = require('fs');
const path = require('path');

// Load words (simple wordlist). You can replace data/words.txt with a larger dictionary.
// Words are lowercased.
const WORDS_FILE = path.join(__dirname, '..', 'data', 'words.txt');
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

// Load words when the function is loaded
loadWords();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { current } = JSON.parse(event.body);
    if (typeof current !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'current is required' })
      };
    }
    
    const w = current.toLowerCase();
    const isWord = isFullWord(w);
    const canContinue = canHavePrefix(w);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ isWord, canContinue })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};