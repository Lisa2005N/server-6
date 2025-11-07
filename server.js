// 今回はクライアントサイドもルーティングもないので何もimportしない

const kv = await Deno.openKv();

await kv.set(['pokemon', 'ブラッキー'], { type: '悪', level: 35 });
await kv.set(['pokemon', 'シャワーズ'], { type: '水', level: 26 });

await kv.get(['pokemon', 'ブラッキー']);

const pkmns = await kv.list({ prefix: ['pokemon'] });
for await (const p of pkmns) {
  console.log(p.key);
  console.log(p.value);
}

await kv.delete(['pokemon', 'シャワーズ']);

const deleteList = await kv.list({ prefix: ['pokemon'] });
const atomic = kv.atomic();
for await (const e of deleteList) atomic.delete(e.key);
const res = await atomic.commit();
if (res.ok) {
  console.log('pokemon コレクションを一括削除しました');
}

async function getNextId() {
  const key = ['counter', 'pokemon'];
  const res = await kv.atomic().sum(key, 1n).commit();
  if (!res.ok) {
    console.error('IDの生成に失敗しました。');
    return null;
  }
  const counter = await kv.get(key);
  return Number(counter.value);
}

await kv.set(['ブラッキー', '所持'], true);
const hasBlacky = await kv.get(['ブラッキー', '所持']);

await kv.set(['ブラッキー', 'date'], new Date());
const date = await kv.get(['ブラッキー', 'date']);
console.log(`捕まえたのは${date.value.getMonth() + 1}月${date.value.getDate()}日です`);
