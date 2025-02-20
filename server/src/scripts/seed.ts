import { Database } from 'sqlite';
import { getDb } from '../db';
import questSeedData from '../data/quests.json';
import modeSeedData from '../data/modes.json';
import rankSeedData from '../data/ranks.json';
import userSeedData from '../data/users.json';
import userRankSeedData from '../data/user_ranks.json';
import questProgressSeedData from '../data/quest_progress.json';
import ModeSeedData from '../types/ModeSeedData';
import QuestSeedData from '../types/QuestSeedData';
import RankSeedData from '../types/RankSeedData';
import bcrypt from 'bcrypt';

const modeData : ModeSeedData = modeSeedData;
const questData : QuestSeedData = questSeedData;
const rankData : RankSeedData = rankSeedData;


async function createTables(db: Database) {
  // テーブルを作成
  await db.exec(`
    CREATE TABLE dialect_modes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE ranks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dialect_mode_id INTEGER NOT NULL,
      rank_name TEXT NOT NULL,
      FOREIGN KEY (dialect_mode_id) REFERENCES dialect_modes(id),
      UNIQUE (dialect_mode_id, rank_name)
    );

    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT DEFAULT '名無し' NOT NULL,
      mail_address TEXT NOT NULL UNIQUE,
      current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
      current_break INTEGER DEFAULT 0 CHECK (current_break >= 0)
    );

    CREATE TABLE user_ranks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      rank_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (rank_id) REFERENCES ranks(id),
      UNIQUE (user_id, rank_id)
    );

    CREATE TABLE quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dialect_mode_id INTEGER NOT NULL,
      sequence_number INTEGER NOT NULL,
      type INTEGER NOT NULL CHECK (type IN (1, 2)),
      question TEXT NOT NULL,
      FOREIGN KEY (dialect_mode_id) REFERENCES dialect_modes(id),
      UNIQUE (dialect_mode_id, sequence_number)
    );

    CREATE TABLE choices (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      choice_id INTEGER NOT NULL,
      quest_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      FOREIGN KEY (quest_id) REFERENCES quests(id)
    );

    CREATE TABLE answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quest_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      FOREIGN KEY (quest_id) REFERENCES quests(id)
    );

    CREATE TABLE quest_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quest_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (quest_id) REFERENCES quests(id),
      UNIQUE (user_id, quest_id)
    );

    CREATE TABLE providers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider_name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE user_authentications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      provider_id INTEGER NOT NULL,
      sub TEXT NOT NULL,
      avatar_url TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (provider_id) REFERENCES providers(id),
      UNIQUE (provider_id, sub)
    );

    CREATE TABLE credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      mail_address TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX idx_quests_dialect_mode ON quests(dialect_mode_id);
    CREATE INDEX idx_quest_progress_user ON quest_progress(user_id);
    CREATE INDEX idx_user_ranks_user ON user_ranks(user_id);
    CREATE INDEX idx_user_authentications_sub ON user_authentications(sub);
  `);
}

async function dropTables(db: Database) {
  await db.exec(`
    DROP TABLE IF EXISTS quest_progress;
    DROP TABLE IF EXISTS choices;
    DROP TABLE IF EXISTS answers;
    DROP TABLE IF EXISTS quests;
    DROP TABLE IF EXISTS user_ranks;
    DROP TABLE IF EXISTS ranks;
    DROP TABLE IF EXISTS user_authentications;
    DROP TABLE IF EXISTS providers;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS dialect_modes;
    DROP TABLE IF EXISTS credentials;
  `);
}

async function seedData(db: Database) {
  await db.run('BEGIN TRANSACTION');

  try {
    // モードの登録
    for (const mode of modeSeedData.dialect_modes) {
      await db.run(
        'INSERT INTO dialect_modes (id, name) VALUES (?, ?)',
        [mode.id, mode.name]
      );
    }

    // ランクの登録
    for (const rank of rankSeedData.ranks) {
      await db.run(
        'INSERT INTO ranks (dialect_mode_id, rank_name) VALUES (?, ?)',
        [rank.dialect_mode_id, rank.rank_name]
      );
    }

    // 問題の登録
    for (const quest of questSeedData.quests) {
      const { lastID } = await db.run(
        'INSERT INTO quests (dialect_mode_id, sequence_number, type, question) VALUES (?, ?, ?, ?)',
        [quest.dialect_mode_id, quest.sequence_number, quest.type, quest.question]
      );

      if (quest.type === 1 && quest.choices) {
        for (const choice of quest.choices) {
          await db.run(
            'INSERT INTO choices (choice_id, quest_id, content, is_correct) VALUES (?, ?, ?, ?)',
            [choice.id, lastID, choice.content, choice.is_correct]
          );
        }
      }

      if (quest.type === 2 && quest.answer) {
        await db.run(
          'INSERT INTO answers (quest_id, content) VALUES (?, ?)',
          [lastID, quest.answer]
        );
      }
    }

    // ユーザーの登録
    for (const user of userSeedData.users) {
      await db.run(
        'INSERT INTO users (name, mail_address, current_streak, current_break) VALUES (?, ?, ?, ?)',
        [user.name, user.mail_address, user.current_streak, user.current_break]
      );
    }

    // ユーザーランクの登録
    for (const userRank of userRankSeedData.user_ranks) {
      await db.run(
        'INSERT INTO user_ranks (user_id, rank_id) VALUES (?, ?)',
        [userRank.user_id, userRank.rank_id]
      );
    }

    // クエスト進捗の登録
    for (const progress of questProgressSeedData.quest_progress) {
      await db.run(
        'INSERT INTO quest_progress (user_id, quest_id) VALUES (?, ?)',
        [progress.user_id, progress.quest_id]
      );
    }

    // プロバイダーの登録
    await db.run(
      'INSERT INTO providers (id, provider_name) VALUES (?, ?)',
      [1, 'google']
    );

    await db.run('COMMIT');
    console.log('データの登録が完了しました');

  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

async function main() {
  const db = await getDb();

  try {
    console.log('テーブルを削除中...');
    await dropTables(db);

    console.log('テーブルを作成中...');
    await createTables(db);

    console.log('データを登録中...');
    await seedData(db);

    console.log('すべての処理が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

main();