const fs = require('fs');
const path = require('path');

// 1. Remove MC CSS
let css = fs.readFileSync('src/styles/global.css', 'utf-8');
css = css.replace(/\.mc-[^{]+{[^}]+}/g, '');
css = css.replace(/\.mc-[^{]+\s*{[^}]+}/g, '');
fs.writeFileSync('src/styles/global.css', css);

// 2. Scaffold missing pages
const pages = [
  { name: 'projects', en: false },
  { name: 'investments', en: false },
  { name: 'resume', en: true },
  { name: 'projects', en: true },
  { name: 'investments', en: true }
];

const template = (name, isEn) => ---
import Layout from '/layouts/Layout.astro';
import SiteHeader from '/components/SiteHeader.astro';
import { getCopy, localePath } from '/utils/i18n';

const locale = '';
const copy = getCopy(locale);
const alternatePath = localePath('', '');
---

<Layout
    title={\${name} | \\}
    description={copy.seo.description}
    lang={locale}
    canonicalPath={\${isEn ? '/en' : ''}/\}
    alternatePath={alternatePath}
>
    <main class="site-shell gap-12">
        <SiteHeader locale={locale} alternatePath={alternatePath} />
        
        <section id="" class="max-w-4xl mx-auto w-full mt-12 px-6">
            <div class="space-y-8">
                <!-- Apple-like sleek placeholder -->
                <div class="text-center space-y-4">
                    <h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-white/90 capitalize">{copy.?.title || ''}</h1>
                    <p class="text-lg text-white/50">{copy.?.intro || 'Content is being crafted with precision...'}</p>
                </div>
                <div class="p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl">
                    <p class="text-white/60 leading-relaxed">
                        This section represents the <strong></strong> focus area. 
                        It is designed with an Apple-inspired glassmorphism, focusing on fluid animations, profound whitespace, and extreme typographic care.
                        <br/><br/>
                        (Detailed integration of  records will follow the sleek aesthetic.)
                    </p>
                </div>
            </div>
        </section>
    </main>
</Layout>
;

pages.forEach(p => {
  const dir = isEn => isEn ? 'src/pages/en' : 'src/pages';
  const filePath = path.join(dir(p.en), \\.astro\);
  if (!fs.existsSync(dir(p.en))) fs.mkdirSync(dir(p.en), { recursive: true });
  fs.writeFileSync(filePath, template(p.name, p.en));
});

// Update index to be super sleek
let home = fs.readFileSync('src/components/HomePage.astro', 'utf-8');
home = home.replace('class="mc-bg p-2 sm:p-4 rounded shadow-2xl"', 'class="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-3xl"');
home = home.replace('class="mc-bg-inset p-1 sm:p-3 relative overflow-hidden"', 'class="relative w-full h-[70vh] sm:h-[80vh]"');
fs.writeFileSync('src/components/HomePage.astro', home);

console.log('Scaffolded pages and cleaned CSS');
