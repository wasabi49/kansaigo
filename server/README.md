# バックエンド API ドキュメント

## プロジェクト構成

```
server/
├── src/
│ ├── routes/           # ルーティング
│ │ ├── auth.ts        # 認証関連
│ │ ├── dialects.ts    # 方言関連
│ │ ├── quests.ts      # クエスト関連
│ │ └── users.ts       # ユーザー関連
│ ├── auth/            # 認証関連の実装
│ │ ├── google.ts      # Google認証
│ │ ├── localStrategy.ts # ローカル認証
│ │ └── passport.ts    # Passport設定
│ ├── scripts/
│ │ ├── seed.ts        # DBシード
│ │ └── cleanupSessions.ts # セッションクリーンアップ
│ ├── types/
│ │ ├── ModeSeedData.ts
│ │ └── QuestSeedData.ts
│ ├── data/
│ │ ├── modes.json     # 方言モードデータ
│ │ └── quests.json    # クエストデータ
│ ├── utils/           # ユーティリティ
│ │ └── stamina.ts     # スタミナ計算
│ ├── app.ts           # アプリケーションのエントリーポイント
│ └── db.ts            # データベース設定
├── .gitignore
├── package.json       # 依存パッケージ設定
└── tsconfig.json      # TypeScript設定
```

## データベース構成

### データベースファイル

- メイン DB: `./database/app.sqlite`
- セッション DB: `./database/sessions.sqlite`

### データベース構造

- `users`: ユーザー情報
- `dialect_modes`: 方言モード
- `quests`: クエスト情報
- `choices`: 選択肢
- `answers`: 難読地名の正解
- `quest_progress`: クエスト進捗
- `providers`: 認証プロバイダー
- `user_authentications`: 外部認証情報
- `credentials`: ローカル認証情報
- `login_attempts`: ログイン試行記録

## 環境変数の設定

### 必須環境変数

```bash
# サーバー設定
BACKEND_PORT=8080                      # バックエンドのポート（デフォルト: 8080）
NODE_ENV=development                   # 環境設定（development/production）

# CORS設定
FRONTEND_ORIGIN=http://localhost:3000  # フロントエンドのオリジン（CORS用）

# Google認証設定
GOOGLE_CLIENT_ID=                      # Google OAuth クライアントID
GOOGLE_CLIENT_SECRET=                  # Google OAuth クライアントシークレット
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback

# セッション設定
SESSION_SECRET=your-secret-key         # セッションの暗号化キー（本番環境では必ず変更）
```

## API 仕様

### 認証関連 API

#### ローカルユーザー登録 POST `/auth/local/register`

新規ユーザーの登録

**リクエスト**

```json
{
  "mail_address": "string",
  "password": "string"
}
```

**レスポンス**

- 成功時 (201): `{ "message": "User created and logged in" }`

**エラーレスポンス**

- 400: `{ "message": "User already exists" }` - ユーザーが既に存在
- 500: `{ "message": "Failed to create user" }` - ユーザー作成失敗

#### ローカルログイン POST `/auth/local/login`

メールアドレスとパスワードによるログイン

**リクエスト**

```json
{
  "mail_address": "string",
  "password": "string"
}
```

**レスポンス**

- 成功時 (200): `{ "message": "Login successful" }`

**エラーレスポンス**

- 401: `{ "message": "メールアドレスまたはパスワードが間違っています" }` - 認証失敗
- 429: `{ "error": "Too many attempts" }` - ログイン試行回数超過
- 500: `{ "message": "server error" }` - サーバーエラー

#### Google 認証 GET `/auth/google`

Google 認証画面へリダイレクト

#### Google コールバック GET `/auth/google/callback`

Google 認証後のコールバック処理

- 成功時: フロントエンドのホームページへリダイレクト
- 失敗時: フロントエンドのログインページへリダイレクト

#### ログアウト GET `/auth/logout`（要認証）

現在のセッションからログアウト

- 成功時: フロントエンドのログインページへリダイレクト

### 方言関連 API（要認証）

#### 方言一覧取得 GET `/dialects`

利用可能な方言モードの一覧を取得

**レスポンス**

- 成功時 (200)

```json
[
  {
    "id": "number",
    "name": "string"
  }
]
```

**エラーレスポンス**

- 401: `{ "error": "Unauthorized" }` - 未認証
- 500: `{ "error": "Failed to fetch dialect modes" }` - 取得失敗

#### 方言のクエスト一覧取得 GET `/dialects/:dialectId/quests`

指定された方言モードで利用可能なクエストの一覧を取得

**パラメータ**

- `dialectId`: 方言モードの ID

**レスポンス**

- 成功時 (200)

```json
[
  {
    "id": "number",
    "sequence_number": "number",
    "type": "number"
  }
]
```

**エラーレスポンス**

- 401: `{ "error": "Unauthorized" }` - 未認証
- 500: `{ "error": "Failed to fetch quests" }` - 取得失敗

### クエスト関連 API（要認証）

#### クエスト詳細取得 GET `/quests/:questId`

指定されたクエストの詳細情報を取得

**パラメータ**

- `questId`: クエストの ID

**レスポンス**

- 成功時 (200)
  - 選択肢問題（type: 1）の場合:

```json
{
  "id": "number",
  "sequence_number": "number",
  "type": 1,
  "question": "string",
  "choices": [
    {
      "id": "number",
      "content": "string"
    }
  ]
}
```

- 難読地名問題（type: 2）の場合:

```json
{
  "id": "number",
  "sequence_number": "number",
  "type": 2,
  "question": "string"
}
```

**エラーレスポンス**

- 401: `{ "error": "Unauthorized" }` - 未認証
- 404: `{ "error": "Quest not found" }` - クエスト未発見
- 500: `{ "error": "Failed to fetch quest" }` - 取得失敗

#### クエスト回答 POST `/quests/:questId/answer`

クエストに回答する

**パラメータ**

- `questId`: クエストの ID

**リクエスト**

```json
{
  "answer": "string"
}
```

注: 選択肢クエストの場合は選択肢 ID、難読地名クエストの場合は回答文字列

**レスポンス**

- 成功時 (200)

```json
{
  "is_correct": "boolean",
  "correct_answer": "string",
  "xp_gained": "number"
}
```

**エラーレスポンス**

- 400: `{ "error": "Not enough stamina", "next_recovery": "timestamp" }` - スタミナ不足
- 401: `{ "error": "Unauthorized" }` - 未認証
- 404: `{ "error": "Quest type not found" }` - クエスト未発見
- 404: `{ "error": "Choice not found" }` - 選択肢未発見
- 404: `{ "error": "Correct answer not found" }` - 正解データ未発見
- 500: `{ "error": "Failed to answer quest" }` - 回答処理失敗

### ユーザー関連 API（要認証）

#### プロフィール取得 GET `/users/profile`

ログインユーザーの情報を取得（スタミナは自動的に最新の値に更新）

**レスポンス**

- 成功時 (200)

```json
{
  "id": "number",
  "name": "string",
  "mail_address": "string",
  "current_streak": "number",
  "current_break": "number",
  "stamina": "number",
  "last_stamina_update": "string",
  "created_at": "string",
  "profile_image_url": "string",
  "ranks": {
    "osaka": "string",
    "kyoto": "string",
    "kobe": "string"
  },
  "xp": "number"
}
```

注: `profile_image_url`は Base64 エンコードされた画像 URL

**エラーレスポンス**

- 401: `{ "error": "Unauthorized" }` - 未認証
- 404: `{ "error": "user not found" }` - ユーザー未発見
- 500: `{ "error": "server error" }` - サーバーエラー

#### プロフィール画像アップロード POST `/users/profile/image`

プロフィール画像をアップロード

**リクエスト**

- Content-Type: `multipart/form-data`
- フィールド名: `profile_image`
- ファイル形式: 画像ファイル（5MB 以下）

**レスポンス**

- 成功時 (200)

```json
{
  "message": "profile image updated",
  "profile_image_url": "string"
}
```

注: `profile_image_url`は Base64 エンコードされた画像 URL

**エラーレスポンス**

- 400: `{ "message": "file size is under 5MB" }` - ファイルサイズ超過
- 400: `{ "message": "file is not uploaded" }` - ファイル未アップロード
- 400: `{ "message": "image file only" }` - 不正なファイル形式
- 401: `{ "error": "Unauthorized" }` - 未認証
- 500: `{ "message": "server error" }` - サーバーエラー

### 共通仕様

#### 認証

- 保護されたエンドポイントには認証が必要
- 未認証の場合は 401 エラー
- セッションベースの認証を使用

#### エラーレスポンス形式

基本形式:

```json
{
  "error": "string"
}
```

追加情報がある場合:

```json
{
  "error": "string",
  "message": "string",
  "details": "object"
}
```

例）スタミナ不足:

```json
{
  "error": "Not enough stamina",
  "next_recovery": "2024-03-20T10:30:00.000Z"
}
```

例）レート制限:

```json
{
  "error": "Too many requests",
  "retry_after": 60
}
```

#### ステータスコード

- 200: 成功（リクエスト成功）
- 201: 作成成功（新規リソース作成）
- 400: リクエスト不正（バリデーションエラー、スタミナ不足など）
- 401: 未認証（ログインが必要）
- 403: 権限なし（アクセス権限がない）
- 404: リソース未発見（指定されたリソースが存在しない）
- 409: 競合（既に存在するリソース）
- 413: ペイロード過大（ファイルサイズ超過など）
- 415: サポートされていないメディアタイプ（不正なファイル形式）
- 429: リクエスト過多（レート制限超過）
- 500: サーバーエラー（内部エラー）

### スタミナシステム

- 最大値: 5
- 回復時間: 10 分に 1 つ
- 消費: クエスト不正解時に 1 消費
- 初期値: 5

## 開発環境のセットアップ

### Docker を使用する場合

1. 環境変数の設定:

```bash
cp .env.example .env
# 必要な値を設定
```

2. コンテナの起動:

```bash
docker-compose up -d
```

3. コンテナの停止:

```bash
docker-compose down
```

4. コンテナとボリュームの完全削除:

```bash
docker-compose down -v
```

### ローカルで実行する場合

1. 依存パッケージのインストール:

```bash
npm install
```

2. データベースディレクトリの作成:

```bash
mkdir database
```

3. データベースの初期化:

```bash
npm run seed
```

4. 開発サーバーの起動:

```bash
npm run dev
```

## 注意事項

- データベースは`sqlite_storage`ボリュームに永続化
- セッションは 24 時間で有効期限切れ（1 時間ごとにクリーンアップ）
- 本番環境では必ず強力な`SESSION_SECRET`を設定
- Google 認証情報は Google Cloud Console から取得
