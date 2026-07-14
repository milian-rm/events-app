import dotenv from 'dotenv';
import { initServer } from './configs/app.js';

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception en Events Server:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection en Events Server:', err);
  process.exit(1);
});

console.log('Starting Events Service...');
initServer();
