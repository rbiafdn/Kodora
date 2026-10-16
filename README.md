# Kodora

Kısa kod örnekleriyle hızlı yazılım öğrenme rehberi. Diller: C#, Python, Java, C++, C, PHP, SQL (MySQL, SQL Server, PostgreSQL, SQLite) ve Web (HTML, CSS, JavaScript, TypeScript, React, Vue, Angular, Node.js + Express, Next.js, Svelte, Tailwind), Backend (ASP.NET Core, Django, Spring Boot, Laravel), Araçlar (Git, Bash/Linux, Docker), Veri (MongoDB, Redis, Pandas), Yapay Zeka (Yapay Zeka Temelleri, Prompt Mühendisliği, LLM API Kullanımı, RAG ve Vektör Veritabanı; devamı geliyor).

```
npm install
npm run dev      # http://localhost:5195
npm run build
```


Canlı: https://rbiafdn.github.io/Kodora/ — Depo: https://github.com/rbiafdn/Kodora

Yayınlama: `npm run deploy` (derler, gh-pages dalına gönderir; birkaç dakika sonra canlıya düşer).

- İçerik: `src/data/` (types.ts ortak tipler; csharp.ts, python.ts, java.ts, cpp.ts, c.ts, php.ts dil verileri; sql.ts ortak SQL + lehçe farkları; html.ts, css.ts, js.ts, ts.ts, react.ts, vue.ts, angular.ts, node.ts, nextjs.ts, svelte.ts, tailwind.ts web; aspnet.ts, django.ts, spring.ts, laravel.ts backend; git.ts, bash.ts, docker.ts araçlar; mongodb.ts, redis.ts, pandas.ts veri; ai-temel.ts, prompt.ts, llm-api.ts, rag.ts yapay zeka; index.ts dil listesi). Her dil: giriş soru-cevapları + 15 konu; konu → satır: yapı, açıklama, detay, pratik sorusu
- Arayüz: `src/App.tsx` (sol konu listesi, kompakt satır listesi, sağ detay paneli), `src/CodeBlock.tsx` (renklendirme, kod bloğu, kopyalama)
- Stil: `src/styles.css`
