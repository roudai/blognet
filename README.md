# blognet

> **再構築中(Nuxt 2 → Nuxt 4)**: このリポジトリは、Nuxt 4 + TypeScript(静的生成のみ)へ作り直している最中です。
> 旧 Nuxt 2 のソースは `legacy/` にあり、移植元の参照用として読み取り専用です。
> この README は、切り替え時に書き換えます。

## 再構築の運用ルール

- **`main` へのマージは、全移植と切り替えチェックリストの完了まで行わない。** `main` へのマージが本番(`https://blog.roudai.net`)への公開を起動するため。
- **`nuxt4-rebuild` を統合ブランチとする。** 機能ごとの作業ブランチ(`001-site-foundation` など)は、`nuxt4-rebuild` へ PR でマージする。
- **PR の CI**(`.github/workflows/ci.yml`。対象ブランチは `main` と `nuxt4-rebuild`)では、Lint、型チェック、静的生成のビルド確認、出力の検証、ワークフローの構文検査を行う。**デプロイはしない。**
- **本番への公開は `main` への push だけ**(`.github/workflows/deploy.yml`)。
- パッケージマネージャーは **pnpm**(`package.json` の `packageManager` で固定)、Node は `.nvmrc` のバージョンを使う。ロックファイルは `pnpm-lock.yaml` のみ。
- `legacy/` は変更しない。移行が完了して新サイトを公開したら削除する。

### 開発コマンド

```bash
corepack enable
pnpm install --frozen-lockfile

pnpm dev          # 開発サーバー(http://localhost:3000)
pnpm lint         # ESLint と Prettier の確認
pnpm typecheck    # 型チェック
pnpm generate     # 静的生成(出力は .output/public)
pnpm verify       # 生成結果の検証(CNAME、ページ、広告の痕跡がないこと)
pnpm preview      # 生成結果の確認
```

### リポジトリの外で行う設定

次の設定は、リポジトリのコードでは変更できないため、運営者が GitHub の画面で行う。

1. **Settings > Pages > Source を「GitHub Actions」へ切り替える。** 現在の「Deploy from a branch(`gh-pages`)」のままだと、`deploy.yml` の公開が反映されない。**`main` の初回デプロイの直前**に行う。
2. **Custom domain が `blog.roudai.net` のままであることを確認する。** Actions 方式では、出力の `CNAME` ファイルは Pages に使われず、独自ドメインは Settings の設定で決まる。
3. **ブランチ保護を設定する。** `main` と `nuxt4-rebuild` への PR で、`ci.yml` の `check` と `actionlint` を必須にする。

設定済みの確認項目:

- [ ] Pages の Source が「GitHub Actions」になっている
- [ ] Custom domain が `blog.roudai.net` になっている
- [ ] `main` と `nuxt4-rebuild` のブランチ保護で、`ci.yml` が必須になっている
