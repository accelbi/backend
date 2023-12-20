
import { readFileSync } from 'fs';

const credentials = JSON.parse(readFileSync('./credentials.json', 'utf8'));

console.log(credentials);