const fs = require('fs');

const messageFile = process.argv[2];
const message = fs.readFileSync(messageFile, 'utf8').trim();
const firstLine = message.split('\n')[0];

if (firstLine.length > 60) {
  console.error('Commit message exceeds 60 characters.');
  process.exit(1);
}

const firstWord = firstLine.split(' ')[0];
if (/ed$/.test(firstWord)) {
  console.error('Commit message should use the imperative mood.');
  process.exit(1);
}

// Success

