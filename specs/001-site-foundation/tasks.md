# Tasks: サイト基盤

**Input**: Design documents from `/specs/001-site-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: 自動テストは作らない(Spec で必須としていない)。品質ゲートは Lint、型チェック、generate、出力の検証。

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [x] T001 旧 CI(`.github/workflows/ci.yml`)のトリガーを `main` への push のみに限定する(`legacy/` への移動前)
- [x] T002 旧 Nuxt 2 のファイルを `legacy/` へ移動する
- [x] T003 `package.json`(pnpm、Node 24、scripts)を作り、Nuxt 4.6.4、Tailwind 4.3.5、`@nuxt/eslint`、Prettier、TypeScript 5.9、`vue-tsc` を入れる
- [x] T004 [P] `nuxt.config.ts`、`tsconfig.json`、`eslint.config.mjs`、`.prettierrc`、`.prettierignore`、`.editorconfig`、`.nvmrc`、`.gitignore` を roudai.net に合わせて置く
- [x] T005 [P] `modules/prerender-pages.ts` を roudai.net から流用する

## Phase 2: Foundational

- [x] T006 `app/assets/css/main.css` に、Bulma のテーマ値と `.content` 相当のスタイルを置く(roudai.net から流用)
- [x] T007 `app/app.vue` と `app/layouts/default.vue`(1/2 幅、中央寄せ)を作る

## Phase 3: User Story 1 - ヘッダーとフッター (P1)

- [x] T008 [P] [US1] `app/components/IconGithub.vue` と `app/data/site.ts` を置く
- [x] T009 [US1] `app/components/AppHeader.vue`(サイト名リンク、desktop 以上でのみ表示する GitHub アイコン)を作る
- [x] T010 [US1] `app/components/AppFooter.vue`(© 2012-{年} roudai.net、GitHub アイコン)を作る
- [x] T011 [US1] 幅 1280px と 700px で、公開中のサイトと実測で比較する(quickstart の 1)

## Phase 4: User Story 2 - CI とデプロイ (P2)

- [x] T012 [P] [US2] `.github/actions/setup/action.yml`、`.github/workflows/ci.yml`、`.github/workflows/deploy.yml` を roudai.net から流用し、旧 `ci.yml` を置き換える
- [ ] T013 [US2] `nuxt4-rebuild` 宛ての PR で CI が成功し、デプロイが走らないことを確認する(PR の作成後)
- [ ] T014 [US2] ブランチ保護で、PR の CI を必須にする(リポジトリの設定。運営者が行う)
- [x] T015 [US2] `nuxt4-rebuild` を統合ブランチとし、切り替えまで `main` へマージしない運用を README に記載する

## Phase 5: User Story 3 - 公開物 (P3)

- [x] T016 [P] [US3] `public/CNAME` と `public/favicon.ico` を `legacy/static/` からコピーする(`ads.txt` はコピーしない)
- [x] T017 [US3] `scripts/pages.mjs` と `scripts/verify-output.mjs` を作り、`pnpm verify` を成功させる

## Phase 6: User Story 4 - トップの骨組み (P3)

- [x] T018 [US4] `app/pages/index.vue` を骨組みとして作る

## Phase 7: Polish

- [x] T019 `scripts/preview.mjs` を roudai.net から流用する
- [x] T020 クリーンな状態から `pnpm lint`、`pnpm typecheck`、`pnpm generate`、`pnpm verify` が成功することを確認する
- [x] T021 `legacy/` が変更されていないことを確認する(`git diff v1-nuxt2 -- legacy/` が移動のみ)

## Dependencies

- Phase 1 → Phase 2 → US1 → US2〜US4(US2〜US4 は互いに独立)
