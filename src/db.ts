import sqlite3 from 'sqlite3';

// データベース接続
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('データベース接続エラー:', err);
  } else {
    console.log('データベースに接続しました');
  }
});

// テーブル作成
db.serialize(() => {
  // dialect_modes テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS dialect_modes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // ranks テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS ranks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dialect_mode_id INTEGER NOT NULL,
      rank_name TEXT NOT NULL,
      FOREIGN KEY (dialect_mode_id) REFERENCES dialect_modes(id),
      UNIQUE (dialect_mode_id, rank_name)
    )
  `);

  // users テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mail_address TEXT NOT NULL UNIQUE,
      current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
      current_break INTEGER DEFAULT 0 CHECK (current_break >= 0)
    )
  `);

  // user_ranks テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS user_ranks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      rank_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (rank_id) REFERENCES ranks(id),
      UNIQUE (user_id, rank_id)
    )
  `);

  // quests テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dialect_mode_id INTEGER NOT NULL,
      sequence_number INTEGER NOT NULL,
      type INTEGER NOT NULL CHECK (type IN (1, 2)),
      question TEXT NOT NULL,
      FOREIGN KEY (dialect_mode_id) REFERENCES dialect_modes(id),
      UNIQUE (dialect_mode_id, sequence_number)
    )
  `);

  // choices テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS choices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quest_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      FOREIGN KEY (quest_id) REFERENCES quests(id)
    )
  `);

  // answers テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quest_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      FOREIGN KEY (quest_id) REFERENCES quests(id)
    )
  `);

  // quest_progress テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS quest_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quest_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (quest_id) REFERENCES quests(id),
      UNIQUE (user_id, quest_id)
    )
  `);

  // インデックスの作成
  db.run('CREATE INDEX IF NOT EXISTS idx_quests_dialect_mode ON quests(dialect_mode_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_quest_progress_user ON quest_progress(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_user_ranks_user ON user_ranks(user_id)');
});

export default db;
