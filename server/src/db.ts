import sqlite3 from 'sqlite3'
import { Database, open } from 'sqlite'

export async function getDb(): Promise<Database> {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

export default getDb();