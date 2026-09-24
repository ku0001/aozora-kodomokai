# 青空子ども会Ⅱ 保護者向けサイト 運用メモ

このファイルは、サイトの引き継ぎ・更新作業のためのメモです。
（幹事長が交代しても、このファイルを読めば運用を引き継げることを目指しています）

## サイト構成

- `index.html` … トップページ（LP）
- `contact.html` … お問い合わせ・体験申し込みフォーム
- `gallery.html` … 活動フォトギャラリー
- `members.html` … 学生メンバー紹介
- `css/style.css` … 全ページ共通スタイル
- `js/main.js` … 全ページ共通スクリプト（ヘッダー、FAQ開閉、スクロール演出など）
- `js/contact-form.js` … `contact.html` 専用、フォーム送信処理

Node.jsやビルドツールは使用していません。HTML/CSS/JSをそのままブラウザで開けば動作します。
ローカル確認は `.claude/launch.json` の `static-server` 設定（`.devserver/server.ps1`、ポート5173）を利用してください。

## ⚠️ 公開前に確認・差し替えが必要なもの

### 1. 学生メンバー紹介

`members.html` は、実データが届くまで「準備中」表示になっています。

本人の許可を得た写真・プロフィールが揃ったら、ファイル内にある
`<!-- コンテンツ差込予定 -->` コメントの直後にあるテンプレート（コメントアウト済み）
を使って差し替えてください。手順はファイル内のコメントに記載しています。

（`voice.html` の保護者の声は設定済みです）

### 2. 実際の写真（ロゴは設定済み）

ロゴは `assets/logo/logo.jpg` に設定済みです（全8ページのヘッダー・
サイドバー・フッターに反映済み）。写真は引き続きすべてUnsplashの
仮画像です。`assets/` フォルダ配下に、用途ごとのディレクトリと
配置手順を記載した `README.txt` を用意しています。

- `assets/logo/README.txt` … ロゴ画像の差し替え手順
- `assets/photos/hero/README.txt` … ヒーロー用メイン写真
- `assets/photos/activities/README.txt` … 活動紹介カード用（3枚）
- `assets/photos/gallery/README.txt` … ギャラリーページ用（枚数自由）
- `assets/photos/members/README.txt` … 学生メンバー写真

各HTML内の該当する `<img>` タグの直前に「差し替え先: assets/photos/...」という
コメントがあるので、それを目印に置き換えてください。

## 問い合わせフォームの仕組み（Google Apps Script）

`contact.html` のフォームは、Google Apps Script（GAS）で作った無料のWeb App経由で、
指定したメールアドレスに内容を送信する仕組みです。

### セットアップ手順（最初の1回だけ）

1. https://script.google.com で新規プロジェクトを作成する。
2. 以下のコードを貼り付けて保存する。

```javascript
function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var toAddress = props.getProperty('CONTACT_TO_EMAIL');

  var params = e.parameter;

  var subject = '【青空子ども会Ⅱ】お問い合わせ・体験申し込み（' + params['parent-name'] + '様）';
  var body =
    '保護者氏名: ' + params['parent-name'] + '\n' +
    'お子様の学年: ' + params['child-grade'] + '\n' +
    'メールアドレス: ' + params['email'] + '\n' +
    '電話番号: ' + params['tel'] + '\n' +
    '希望参加日: ' + (params['preferred-date'] || '未入力') + '\n' +
    'ご質問など: ' + (params['message'] || 'なし');

  MailApp.sendEmail({
    to: toAddress,
    subject: subject,
    body: body,
    replyTo: params['email']
  });

  return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. 画面左の歯車アイコン「プロジェクトの設定」を開き、「スクリプト プロパティ」に
   プロパティ名 `CONTACT_TO_EMAIL`、値に送信先メールアドレスを追加する。
4. 右上の「デプロイ」→「新しいデプロイ」→種類「ウェブアプリ」を選択。
   - 実行するユーザー: 自分
   - アクセスできるユーザー: 全員
5. 発行された Web App URL（`https://script.google.com/macros/s/.../exec`）をコピーする。
6. `js/contact-form.js` を開き、冒頭の `GAS_ENDPOINT` の値を、コピーしたURLに書き換える。

### 幹事長交代時の引き継ぎ（これだけでOK）

コードの変更・再デプロイは不要です。以下の手順だけで宛先メールを変更できます。

1. https://script.google.com を開き、対象のプロジェクトを開く。
2. 「プロジェクトの設定」→「スクリプト プロパティ」の `CONTACT_TO_EMAIL` の値を
   新しいメールアドレスに書き換えて保存する。

### 注意点

フォームはGAS Web AppのCORS制約により `no-cors` モードで送信しているため、
JavaScript側では送信の成否を厳密には確認できません（通信エラー以外は成功扱いになります）。
セットアップ後は必ず一度テスト送信を行い、指定メールアドレスに届くことを確認してください。

## GitHub Pagesでの公開手順

1. このフォルダで `git init` し、`git add` → コミットする。
2. GitHub上で新規リポジトリを作成する。
3. リモートを追加して `git push` する。
4. GitHubリポジトリの Settings → Pages で、Source を `main` ブランチ / root に設定する。
5. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開される。
   チラシのQRコードにはこのURLを使用する。
6. 以降の更新は、ローカルで編集して commit・push するだけで自動反映される。
