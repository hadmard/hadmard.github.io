const fs = require('fs');

let content = fs.readFileSync('src/components/HomePage.astro', 'utf-8');
content = content.replace(
  ""const postPages = await readJsonFile<Array<{ items?: SyncedPostRecord[] }>>(path.join(baseDir, 'raw/posts.json'));"",
  ""const postPagesRaw = await readJsonFile<any>(path.join(baseDir, 'raw/posts.json'));
        const postPages: Array<{ items?: SyncedPostRecord[] }> = Array.isArray(postPagesRaw) ? postPagesRaw : (postPagesRaw ? [postPagesRaw] : []);""
);

fs.writeFileSync('src/components/HomePage.astro', content);
