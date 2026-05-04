import Database from 'better-sqlite3';
import path from 'path';
import { SCHEMA } from './schema';

const DB_PATH = path.join(process.cwd(), 'data', 'battlebot.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  const fs = require('fs');
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');
  _db.exec(SCHEMA);
  return _db;
}
