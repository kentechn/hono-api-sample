# 社内テックブログ - フォルダ構成と開発フロー

本プロジェクトでは **レイヤードアーキテクチャ** を採用し、責務を明確に分離しています。  
また、**PrismaまたはDrizzle** を利用してDB管理を行い、テスト時には環境変数を切り替えずにテスト用DBを適用する構成です。

---

## 📂 フォルダ構成

```
src/
├── api/                          # API層（リクエスト・レスポンス処理）
│   ├── articles.ts               # 記事関連のエンドポイント
│   ├── users.ts                  # ユーザー関連のエンドポイント
│   └── tags.ts                   # タグ関連のエンドポイント
│
├── kernel/                       # ドメイン層（ビジネスロジック）
│   ├── services/                 # ビジネスロジックを管理
│   │   ├── articles.service.ts
│   │   ├── users.service.ts
│   │   └── tags.service.ts
│   │
│   └── repositories/             # リポジトリのインターフェース（型のみ）
│       ├── articles.repository.ts
│       ├── users.repository.ts
│       └── tags.repository.ts
│
├── adapter/                      # インフラ層（データアクセス）
│   ├── db/                       # DBインスタンスを管理
│   │   └── database.ts
│   │
│   └── repositories/             # 実際のデータベースとの接続
│       ├── articles.repository.ts
│       ├── users.repository.ts
│       └── tags.repository.ts
│
├── dependencies.ts               # DIコンテナ（依存性の統一管理）
├── bootstrap.ts                  # アプリ起動時のセットアップ（DI適用）
│
├── middlewares/                  # 共通ミドルウェア
│   └── errorHandler.ts           # エラーハンドリング
│
└── tests/                        # テストコード（Vitest）
    ├── setupDatabase.ts          # テスト用DBのセットアップ
    ├── api/                      # APIのテスト
    └── services/                 # ビジネスロジックのテスト

prisma/                           # Prismaのスキーマとマイグレーション
└── schema.prisma

.github/workflows/                # GitHub ActionsのCI/CD設定
└── ci.yml

# プロジェクトのルートファイル
├── README.md                     # プロジェクトの説明（このファイル）
├── package.json                  # プロジェクトの依存関係
├── .env                          # 環境変数（本番用）
├── .env.test                     # 環境変数（テスト用）
├── CODE_STYLE.md                 # コーディング規約
└── CONTRIBUTING.md               # 貢献ガイドライン
```


---

## ✨ フォルダの役割

### **`api/` - API層**
📌 クライアントからのリクエストを受け取り、レスポンスを返す  
📌 `Service` 層を利用し、ビジネスロジックには直接関与しない  
📌 **依存関係の注入（DI）を活用し、疎結合な設計にする**

### **`kernel/` - ドメイン（ビジネスロジック）**
📌 各 `Service` が `Repository` を介してデータを取得・変更する  
📌 **`repositories/` はインターフェース定義のみ**（実装は `adapter/` に配置）  
📌 DIコンテナ (`dependencies.ts`) を通じて `Service` に `Repository` を適用  

### **`adapter/` - インフラ層**
📌 `db/` にデータベースインスタンス (`database.ts`) を管理  
📌 `repositories/` でデータベース接続を実装（PrismaまたはDrizzleを利用）  
📌 **環境変数の変更なしでテスト時にDBを切り替える機能を提供**

---

## 🧪 テスト駆動開発（TDD）の進め方

本プロジェクトでは **TDD（テスト駆動開発）** を採用し、以下の手順で進めます。

1️⃣ **テストを書く**  
   - `tests/` フォルダ内に、新しい機能のテストコードを作成  
   - Vitestを利用し、**期待する動作を記述**（例: `expect()` を使う）  

2️⃣ **テストを実行し、失敗させる**  
   - `npx vitest` でテストを実行  
   - 初めはテストが失敗することを確認し、実装の必要性を明確にする  

3️⃣ **最小限のコードでテストを通す**  
   - 必要なコードを実装し、テストを通す  
   - まずは簡単な実装でOK（後で改善可能）  

4️⃣ **リファクタリングする**  
   - コードを最適化し、可読性や性能を向上させる  
   - テストが通ることを確認しながら、クリーンな実装に仕上げる  

---

## 🔀 Gitブランチ戦略

本プロジェクトでは **本番環境のみ** を用意し、シンプルなブランチ戦略を採用します。  
各機能開発は `feature/` ブランチで行い、完成したら `main` に統合します。

✅ `feature/xxx` → 新機能開発（例: `feature/add-article-api`）  
✅ `fix/xxx` → バグ修正（例: `fix/article-fetch-error`）  
✅ `chore/xxx` → 設定変更やメンテナンス（例: `chore/update-dependencies`）

---

## 🔎 Pull Request（PR）のレビュー手順

📌 **PR作成時のルール**
✅ PRタイトルは簡潔に（例: `feat: 記事投稿APIを追加`）  
✅ 変更内容・目的・テスト結果を記載（`What`, `Why`, `How`）  
✅ 関連Issueがある場合は、リンクを追加（`Closes #123`）  

📌 **PRレビューのチェック項目**
✅ コードの可読性  
✅ ロジックの妥当性  
✅ テストが通るか確認  
✅ Lint & フォーマットチェック (`npx biome lint`)

---

## 🚀 CI/CDパイプライン（GitHub Actions）

### 📌 `.github/workflows/ci.yml` の処理概要
1️⃣ **テスト実行（Vitest）**  
2️⃣ **ビルド（Dockerイメージの作成）**  
3️⃣ **ECRへプッシュ**  

✅ `pnpm install --frozen-lockfile` を利用  
✅ `cache: 'pnpm'` を設定し、高速化  
✅ AWS ECRへ `docker push`  

---

## 📘 コーディング規約

プロジェクトのコーディング規約については、[CODE_STYLE.md](./CODE_STYLE.md) を参照してください。

---

## 🔥 まとめ
🚀 **レイヤードアーキテクチャを採用し、責務を明確化**  
🚀 **TDDで開発し、テストを通してコードの品質を保証**  
🚀 **GitHub Actionsで自動テスト・ビルド・ECRプッシュを実施**  

このREADMEで十分カバーできてるかな？💡 もし **追加したい内容** や **さらに詳しくしたいポイント** があれば教えてね！✨
