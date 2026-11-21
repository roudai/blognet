// 静的生成の出力に含まれなければならない、移植済みのページのパス。
// ページを追加したら、ここに追記する(scripts/verify-output.mjs と scripts/verify-parity.mjs が使う)。

/** specs/002-posts の記事ページ5件 */
export const postPages = ['/post-37', '/post-386', '/post-388', '/post-535', '/post-700']

/** トップページ(骨組みは specs/001-site-foundation、記事一覧は specs/002-posts) */
export const topPages = ['/']

export const migratedPages = [...topPages, ...postPages]
