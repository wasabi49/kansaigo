import sqlite3 from 'sqlite3'
import { Database, open } from 'sqlite'

// データベース接続をPromiseで返す関数
export async function getDb(): Promise<Database> {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

export default getDb();