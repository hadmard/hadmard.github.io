const fs = require('fs');
const path = require('path');

// 1. Remove MC CSS
let css = fs.readFileSync('src/styles/global.css', 'utf-8');
css = css.replace(/\.mc-[^{]+{[^}]+}/g, '');
css = css.replace(/\.mc-[^\s]+\s*{[^}]+}/g, '');
fs.writeFileSync('src/styles/global.css', css);

// 2. Scaffold missing pages
const pages = [
  { name: 'projects', en: false },
  { name: 'investments', en: false },
  { name: 'resume', en: false },
  { name: 'projects', en: true },
  { name: 'investments', en: true },
  { name: 'resume', en: true }
];

const template = (name, isEn) => {
  const depth = isEn ? '../..' : '..';
  const loc = isEn ? 'en' : 'zh-cn';
  const alt = isEn ? '' : '/en';
  return `---
import Layout from '${depth}/layouts/Layout.astro';
import SiteHeader from '${depth}/components/SiteHeader.astro';
import { getCopy, localePath } from '${depth}/utils/i18n';

const locale = '${loc}';
const copy = getCopy(locale);
const alternatePath = '${alt}/' + '${name}';
---

<Layout
    title={\`\${copy.nav.find(i=>i.id==='${name}')?.label||'${name}'} | \${copy.brand.name}\`}
    description={copy.seo.description}
    lang={locale}
    canonicalPath={\`${isEn ? '/en/' : '/'}${name}\`}
    alternatePath={alternatePath}
>
    <main class="site-shell mx-auto px-4 py-8">
        <SiteHeader locale={locale} alternatePath={alternatePath} />
        
        <section id="${name}" class="max-w-4xl mx-auto w-full mt-12 px-6">
            <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
                <div class="text-center space-y-4">
                    <h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-white/90 capitalize">{copy['${name}']?.title || '${name}'}</h1>
                    <p class="text-lg text-white/50">{copy['${name}']?.intro || ''}</p>
                </div>
                <div class="p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl transition group hover:bg-white/[0.03]">
                    <p class="text-white/60 leading-relaxed font-light">
                        This space embodies the <strong>${name}</strong> focus. Functioning on pure precision, glassmorphism, and minimal cognitive load, representing a more mature, Apple-styled aesthetic.
                    </p>
                </div>
            </div>
        </section>
    </main>
</Layout>`
};

pages.forEach(p => {
  const dir = p.en ? 'src/pages/en' : 'src/pages';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, p.name + '.astro'), template(p.name, p.en));
});

let home = "";
if (fs.existsSync('src/components/HomePage.astro')) {
    home = fs.readFileSync('src/components/HomePage.astro', 'utf-8');
    home = home.replace('class="mc-bg p-2 sm:p-4 rounded shadow-2xl"', 'class="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-3xl animate-in fade-in zoom-in duration-1000"');
    home = home.replace('class="mc-bg-inset p-1 sm:p-3 relative overflow-hidden"', 'class="relative w-full h-[70vh] sm:h-[80vh]"');
    fs.writeFileSync('src/components/HomePage.astro', home);
}
