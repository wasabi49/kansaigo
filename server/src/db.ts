import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';

// 環境変数でデータベースのパスを指定（Renderでは /data/ に保存）
const databasePath = process.env.DATABASE_URL || path.join(__dirname, '../database/app.sqlite');
const sessionDatabasePath = process.env.SESSION_DATABASE_URL || path.join(__dirname, '../database/sessions.sqlite');

export async function getDb(): Promise<Database> {
  return open({
    filename: databasePath,
    driver: sqlite3.Database
  });
}

export async function getSessionDb(): Promise<Database> {
  return open({
    filename: sessionDatabasePath,
    driver: sqlite3.Database
  });
}

// デフォルトでデータベース接続をエクスポート
export default getDb();
