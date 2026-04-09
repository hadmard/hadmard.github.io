const fs = require('fs');
const path = require('path');
async function readJsonFile(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
async function load() {
  const baseDir = path.resolve(process.cwd(), 'custom/cc98-investment-crawler/output/topic-6450962');
  const summary = await readJsonFile(path.join(baseDir, 'records/investment-summary.json')).catch(() => null);
  const topic = summary?.topic ?? await readJsonFile(path.join(baseDir, 'raw/topic.json')).catch(() => null);
  const postPagesRaw = await readJsonFile(path.join(baseDir, 'raw/posts.json')).catch(()=>null);
  const postPages = Array.isArray(postPagesRaw) ? postPagesRaw : (postPagesRaw ? [postPagesRaw] : []);
  const posts = (postPages ?? []).flatMap(p => p.items ?? []).map((post, i) => ({floor: post.floor??i, isDeleted: !!post.isDeleted}));
  console.log('topic?', !!topic);
  console.log('posts?', posts.length);
}
load();
