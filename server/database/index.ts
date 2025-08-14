// Usar JSON storage como alternativa mais compatível
export { statements, initDatabase } from './adapter.js';
export { default as db } from './json-storage.js';
