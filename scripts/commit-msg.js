const fs = require('fs');

const messageFile = process.argv[2];
const message = fs.readFileSync(messageFile, 'utf8').trim();
const firstLine = message.split('\n')[0];

if (firstLine.length > 60) {
  console.error('Commit message exceeds 60 characters.');
  process.exit(1);
}

let subject = firstLine;
if (firstLine.includes(':')) {
  subject = firstLine.split(':')[1].trim();
}
const firstWord = subject.split(' ')[0].replace(/[^a-zA-Z]/g, '').toLowerCase();
const nonImperativePrefixes = [
  'added',
  'fixed',
  'updated',
  'removed',
  'changed',
  'improved',
  'refactored',
  'corrected',
  'merged',
];
if (nonImperativePrefixes.includes(firstWord)) {
  console.error('Commit message should use the imperative mood.');
  process.exit(1);
}

// Success

