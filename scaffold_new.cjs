const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'projects', en: false, img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop' },
  { name: 'investments', en: false, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
  { name: 'resume', en: false, img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop' },
  { name: 'projects', en: true, img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop' },
  { name: 'investments', en: true, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
  { name: 'resume', en: true, img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop' }
];

const template = (name, isEn, img) => {
  const depth = isEn ? '../..' : '..';
  const loc = isEn ? 'en' : 'zh-cn';
  const alt = isEn ? '' : '/en';
  const can = isEn ? '/en/' : '/';
  
  return \---
import Layout from '\/layouts/Layout.astro';
import SiteHeader from '\/components/SiteHeader.astro';
import { getCopy, localePath } from '\/utils/i18n';

const locale = '\';
const copy = getCopy(locale);
const alternatePath = '\/' + '\/';
---

<Layout
    title={\\\\\\$\\\{copy.nav.find(i=>i.id==='\')?.label||'\'\\\} | \\\$\\\{copy.brand.name\\}\\\}
    description={copy.seo.description}
    lang={locale}
    canonicalPath="\\/"
    alternatePath={alternatePath}
>
    <!-- Background Header Image -->
    <div class="fixed inset-0 z-[-1] min-h-[50vh] bg-[url('\')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-screen pointer-events-none fade-in duration-1000 mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)"></div>

    <main class="site-shell mx-auto px-4 sm:px-8 lg:px-12 py-8 min-h-screen relative z-10 w-full">
        <SiteHeader locale={locale} alternatePath={alternatePath} />
        
        <section id="\" class="max-w-5xl mx-auto w-full mt-24 px-6 isolate">
            <div class="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <div class="text-center space-y-6">
                    <h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 capitalize">{\copy['\']?.title || '\'}</h1>
                    <p class="text-xl md:text-2xl text-white/50 font-light">{\copy['\']?.intro || ''}</p>
                </div>
                <div class="p-10 md:p-16 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transition group hover:bg-white/[0.05] hover:border-white/20 duration-500">
                    <div class="flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-8 shadow-inner shadow-white/20">
                        <svg class="w-10 h-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <p class="text-white/70 text-lg md:text-xl leading-relaxed font-light">
                        This space explores the <strong>\</strong> dimension. Rebuilt with deep precision, ambient glassmorphism, and minimal cognitive load¡ªembodying an immersive cinematic aesthetic.
                    </p>
                </div>
            </div>
        </section>
    </main>
</Layout>\
};

pages.forEach(p => {
  const dir = p.en ? 'src/pages/en' : 'src/pages';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, p.name + '.astro'), template(p.name, p.en, p.img).replace(/\\copy/g, 'copy'));
});
