正式ロゴ（設定済み）
==================

ファイル: logo.jpg
配置場所: assets/logo/logo.jpg

設定済みです。全8ページ（index / contact / gallery / members /
safety / voice / faq / mission）のヘッダー・サイドバー・フッター、
計24箇所すべてで <img src="assets/logo/logo.jpg"> を使用しています。

ロゴ画像を差し替えたい場合は、このファイル（logo.jpg）を
新しい画像で上書きするだけでOKです（ファイル名を変える場合は、
各HTMLファイル内の "assets/logo/logo.jpg" をすべて新しいファイル名に
書き換えてください）。

なお、ロゴの色に合わせて css/style.css の --color-sora-500 /
--color-taiyo-500 と、各HTMLファイル内 <script>tailwind.config = {...}</script>
の sora.500 / taiyo.500 の値もすでに近い色味に調整済みです。
色味を完全に一致させたい場合はここを微調整してください。
