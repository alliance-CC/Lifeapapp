# Vercel デプロイ手順

Vercel プロジェクト: https://vercel.com/alliance-ccs-projects/lifeapapp

本アプリは Next.js 14 製で、Vercel が自動でフレームワークを認識します。
以下の手順でデプロイを完了してください。

---

## 1. 本番ブランチの確認

Vercel の **Production Branch** は通常 `main` です。本リポジトリには `main` ブランチを作成済みのため、`main` への push で自動的に本番デプロイされます。

> Vercel ダッシュボード → プロジェクト → Settings → Git → Production Branch が `main` になっているか確認してください。

## 2. 環境変数の設定（必須）

Supabase と連携するため、Vercel に以下の環境変数を登録してください。
**Vercel ダッシュボード → プロジェクト → Settings → Environment Variables**

| 変数名 | 値 | 取得元 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase ダッシュボード → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...`（公開可能な anon key） | Supabase ダッシュボード → Project Settings → API → Project API keys → `anon` `public` |

- 環境（Environment）は **Production / Preview / Development すべて** にチェックを入れてください。
- 設定後は **Redeploy**（再デプロイ）が必要です。

> ⚠️ `anon key` はクライアントに公開される前提のキーです。秘密の `service_role` key は **絶対に登録しない**でください（要件定義 NFR に準拠）。

## 3. デプロイの実行

環境変数を設定したら、以下のいずれかでデプロイされます。

- `main` ブランチに push する（自動デプロイ）
- Vercel ダッシュボードの **Deployments → Redeploy** をクリック

## 4. キャラクター画像の追加（任意）

スプラッシュ画面（ロード画面）に御社キャラクターを表示するには、
`public/character.png` を追加して `main` に push してください。
詳細は [`public/README.md`](./public/README.md) を参照。

---

## ローカルでの動作確認

```bash
npm install
cp .env.example .env.local   # Supabase の値を記入
npm run dev                  # http://localhost:3000
```

## ビルド確認

```bash
npm run build   # 全13ルートが正常にビルドされることを確認済み
```
