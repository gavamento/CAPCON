# 就活ポートフォリオサイト（CAPCON）

ゲームプログラマー・ゲームプランナー向けの就活ポートフォリオ。Astro + Tailwind CSS で構築し、Firebase Hosting で公開します。

## 機能

- 1〜3年次の成長タイムライン
- 作品一覧（学年・職種フィルタ）
- 学内コンテスト（タブ: コンテスト一覧 / コンテスト出品作品）
- 作品詳細（YouTube 遅延埋め込み、画像ギャラリー、企画書 PDF）
- Firebase Analytics

## 開発

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:4321` を開きます。

## ビルド

```bash
npm run build
npm run preview
```

出力先: `dist/`

## Firebase Hosting へのデプロイ

### 初回のみ

1. [Firebase CLI](https://firebase.google.com/docs/cli) をインストール  
   `npm install -g firebase-tools`
2. ログイン: `firebase login`
3. プロジェクトは `.firebaserc` で `capcom-d876d` を指定済み

### デプロイ

```bash
npm run deploy
```

または:

```bash
npm run build
firebase deploy --only hosting
```

公開 URL（例）: `https://capcom-d876d.web.app`

## 作品の追加・編集

### 1. Markdown で作品を登録

`src/content/works/` に `.md` ファイルを追加します。

```yaml
---
title: "作品タイトル"
tags:
  - year-2
  - programmer
contestIds:
  - hal-event-week
role: "メインプログラマー"
team: "4人チーム"
date: "2025-06"
summary: "一覧に表示する短い説明"
youtubeId: "YouTubeの動画ID"
thumbnail: "/images/my-game.png"
images:
  - "/images/screen1.png"
pdf: "/pdf/my-plan.pdf"
tech:
  - "C++"
highlights:
  - "工夫した点"
featured: true
---

本文（詳細説明）をここに書きます。
```

### 2. 画像・PDF を配置

| 種類 | 配置先 |
|------|--------|
| サムネ・スクショ | `public/images/` |
| 企画書 PDF | `public/pdf/` |

### 3. YouTube 動画 ID

動画 URL `https://www.youtube.com/watch?v=XXXXXXXX` の `XXXXXXXX` 部分を `youtubeId` に設定します。

### 4. 学内コンテストの追加

**コンテスト（イベント）** — `src/content/contests/` に `.md` を追加します。ファイル名（拡張子除く）が ID になります。

```yaml
---
title: "HAL Game Expo 2024"
date: "2024-12"
tags:
  - year-1
organizer: "HAL東京"
award: "参加"
summary: "一覧に表示する短い説明"
thumbnail: "/images/contest.png"
link: "https://example.com"  # 任意
featured: false
---

参加記録や振り返りを本文に書きます。
```

**コンテスト作品** — 既存の `src/content/works/` の frontmatter に、紐づけるコンテスト ID を指定します。

```yaml
contestIds:
  - "hal-game-expo-2024"
```

`/contests` ページの「学内コンテスト」タブにイベント、「コンテスト作品」タブに `contestIds` のある作品が表示されます。

### 5. プロフィール編集

`src/pages/about.astro` の名前・経歴・GitHub / メールリンクを更新してください。

### 6. 成長タイムラインの文言

`src/data/growth.ts` で各年次のテーマ・スキル文言を編集できます。

## ディレクトリ構成

```
src/
  content/works/     # 作品データ（Markdown）
  content/contests/  # 学内コンテスト（Markdown）
  components/        # UI コンポーネント
  layouts/           # 共通レイアウト
  pages/             # ページ
  lib/firebase.ts    # Firebase / Analytics
public/
  images/            # 画像
  pdf/               # 企画書 PDF
firebase.json        # Hosting 設定
```

## 技術スタック

- [Astro](https://astro.build/) 6
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Firebase](https://firebase.google.com/) Hosting + Analytics
