# Tasks: 記事ページとトップページの移植

**Input**: Design documents from `/specs/002-posts/`

**Prerequisites**: plan.md, spec.md, research.md, contracts/pages.md, quickstart.md

**Tests**: 自動テストは作らない。品質ゲートは Lint、型チェック、generate、`pnpm verify`。本番との比較は `pnpm verify:parity`。

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [x] T001 [P] `legacy/assets/37/`、`legacy/assets/700/` の画像を `public/images/37/`、`public/images/700/` にコピーする
- [x] T002 [P] `scripts/verify-parity.mjs` を roudai.net から blognet 向けに作り、`package.json` に `verify:parity` を追加する

## Phase 2: Foundational

- [x] T003 `app/assets/css/main.css` に、Bulma の `title`、`subtitle`、`columns`、`column`、`is-8`、`is-offset-2`、`box` を追加する
- [x] T004 [P] `app/components/YoutubeCard.vue`(iframe)を作り、dev と generate で spike する
- [x] T005 [P] `app/composables/useTwitterWidgets.ts` を作り、直接のアクセスとサイト内の移動の両方で spike する
- [x] T006 [P] `app/components/ImageCard.vue` を作る

## Phase 3: User Story 1、2 - 記事 (P1)

- [x] T007 [US1] `app/pages/post-37.vue`、`post-386.vue`、`post-388.vue`、`post-535.vue`、`post-700.vue` を、移植元のテンプレートから作る(埋め込みの部品の置き換え、画像の URL の変更)
- [x] T008 [US1] `/post-37` の段落の中の `div`(2か所)を、ブラウザーの表示と同じ構造に書き直す
- [x] T009 [US1] `scripts/pages.mjs` に記事5件を追加し、`scripts/verify-output.mjs` に画像の確認を追加する
- [x] T010 [US2] 幅 1280px と狭い幅で、画像、動画、ツイートの大きさと位置を現行と実測で比べる

## Phase 4: User Story 3 - トップページ (P2)

- [x] T011 [US3] `app/pages/index.vue` に、移植元の見出しと5件のリンクを置く

## Phase 5: User Story 4 - 誤字 (P3)

- [x] T012 [US4] 移植元を読み、明らかな誤字を直して spec.md に記録する。判断が必要なものは候補として記録する

## Phase 6: Polish

- [x] T013 `pnpm lint`、`pnpm typecheck`、`pnpm generate`、`pnpm verify`、`pnpm verify:parity` が成功することを確認する
- [x] T014 `legacy/` が変更されていないことを確認する
- [ ] T015 `nuxt4-rebuild` 宛ての PR で CI が成功することを確認する(PR の作成後)

## Dependencies

- Phase 1、2 → US1/US2 → US3、US4
