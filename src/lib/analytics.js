/**
 * 「実際のテスターの結果が偏っている(虚無僧に集中する)原因を調査したい」という
 * 要望に基づく、匿名の診断結果ログ。個人を特定する情報は一切収集しない
 * (名前・メール・IP・ユーザーエージェント等は送らない)。
 *
 * 送信する内容は以下のみ:
 * - lang: 診断時の言語('ja'/'en')
 * - commonAnswers: 共通7問で選んだ選択肢idの配列(例: ['c1a','c2c',...])
 * - branchAnswers: 分岐後3問で選んだ選択肢idの配列
 * - factionId: 内部分類(buke/jisha/shomin)。ユーザーには見せないが、
 *   調査用途では分析の助けになるため送る
 * - resultId: 最終タイプid(例: 'komuso')
 * - clientSessionId: ブラウザ内でランダム生成するUUID(個人情報ではない。
 *   同じ人が複数回診断した際の重複を後で見分けるためだけの用途)
 *
 * 保存先はSupabaseの書き込み専用テーブル(RLSでINSERTのみ許可、SELECTポリシー
 * は定義していないため公開anonキー経由では読み取れない)。送信に失敗しても
 * 診断自体には一切影響しない(fire-and-forget、常にtry/catchで握る)。
 *
 * @supabase/supabase-js は1件INSERTするだけの用途には過大(バンドルに約230KB
 * 追加される)なため使わず、PostgRESTのREST APIに直接fetchする(このアプリの
 * 「バックエンドなし・依存最小限」という方針を保つため)。
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const SESSION_ID_KEY = 'ninja-shindan:client-session-id'

/**
 * ブラウザごとに1つ、ランダムなUUIDを作って使い続ける(個人情報ではない、
 * ただの匿名の乱数)。localStorageが使えない環境(プライベートモード等)では
 * その場で生成するだけにして、送信自体は諦めない。
 */
function getClientSessionId() {
  try {
    const existing = localStorage.getItem(SESSION_ID_KEY)
    if (existing) return existing
    const fresh = crypto.randomUUID()
    localStorage.setItem(SESSION_ID_KEY, fresh)
    return fresh
  } catch {
    return crypto.randomUUID()
  }
}

/**
 * 診断が完了した瞬間に1回呼ぶ。失敗しても画面には一切影響させない。
 * @param {{ lang: string, commonAnswers: Array<{id: string}>, branchAnswers: Array<{id: string}>, factionId: string, resultId: string }} params
 */
export function logDiagnosisEvent({ lang, commonAnswers, branchAnswers, factionId, resultId }) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return // 環境変数未設定時は何もしない

  const body = {
    lang,
    common_picks: commonAnswers.map((choice) => choice.id),
    branch_picks: branchAnswers.map((choice) => choice.id),
    faction_id: factionId,
    result_id: resultId,
    client_session_id: getClientSessionId(),
  }

  fetch(`${SUPABASE_URL}/rest/v1/ninja_shindan_diagnosis_events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(body),
  }).catch((err) => {
    console.warn('診断ログの送信に失敗(診断結果には影響なし):', err)
  })
}
