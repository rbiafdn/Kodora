// Uygulamadaki diller. Yeni dil eklemek: veri dosyasını yaz, buraya ekle, CodeBlock'ta renklendirme tanımı ekle.
import type { Language } from './types'
import { csharp, giris as csharpGiris } from './csharp'
import { python, pythonGiris } from './python'
import { java, javaGiris } from './java'
import { cpp, cppGiris } from './cpp'
import { c, cGiris } from './c'
import { php, phpGiris } from './php'
import { buildSql, sqlGiris, dialectTitles, type Dialect } from './sql'
import { html, htmlGiris } from './html'
import { css, cssGiris } from './css'
import { js, jsGiris } from './js'
import { ts, tsGiris } from './ts'
import { react, reactGiris } from './react'
import { vue, vueGiris } from './vue'
import { angular, angularGiris } from './angular'
import { node, nodeGiris } from './node'
import { nextjs, nextjsGiris } from './nextjs'
import { svelte, svelteGiris } from './svelte'
import { tailwind, tailwindGiris } from './tailwind'
import { aspnet, aspnetGiris } from './aspnet'
import { django, djangoGiris } from './django'
import { spring, springGiris } from './spring'
import { laravel, laravelGiris } from './laravel'
import { git, gitGiris } from './git'
import { bash, bashGiris } from './bash'
import { docker, dockerGiris } from './docker'
import { mongodb, mongodbGiris } from './mongodb'
import { redis, redisGiris } from './redis'
import { pandas, pandasGiris } from './pandas'
import { aiTemel, aiTemelGiris } from './ai-temel'
import { prompt, promptGiris } from './prompt'

const SQL_GROUP = { id: 'sql', title: 'SQL' }
const WEB_GROUP = { id: 'web', title: 'Web' }
const BACKEND_GROUP = { id: 'backend', title: 'Backend' }
const TOOLS_GROUP = { id: 'araclar', title: 'Araçlar' }
const DATA_GROUP = { id: 'veri', title: 'Veri' }
const AI_GROUP = { id: 'ai', title: 'Yapay Zeka' }
const sqlDialect = (id: Dialect): Language => ({
  id,
  title: dialectTitles[id],
  comment: '--',
  hl: 'sql',
  group: SQL_GROUP,
  giris: sqlGiris(id),
  topics: buildSql(id),
})

export const languages: Language[] = [
  { id: 'csharp', title: 'C#', comment: '//', giris: csharpGiris, topics: csharp },
  { id: 'python', title: 'Python', comment: '#', giris: pythonGiris, topics: python },
  { id: 'java', title: 'Java', comment: '//', giris: javaGiris, topics: java },
  { id: 'cpp', title: 'C++', comment: '//', giris: cppGiris, topics: cpp },
  { id: 'c', title: 'C', comment: '//', giris: cGiris, topics: c },
  { id: 'php', title: 'PHP', comment: '//', giris: phpGiris, topics: php },
  sqlDialect('mysql'),
  sqlDialect('mssql'),
  sqlDialect('postgres'),
  sqlDialect('sqlite'),
  { id: 'html', title: 'HTML', comment: '<!--', commentEnd: '-->', group: WEB_GROUP, giris: htmlGiris, topics: html },
  { id: 'css', title: 'CSS', comment: '/*', commentEnd: '*/', group: WEB_GROUP, giris: cssGiris, topics: css },
  { id: 'js', title: 'JavaScript', comment: '//', group: WEB_GROUP, giris: jsGiris, topics: js },
  { id: 'ts', title: 'TypeScript', comment: '//', group: WEB_GROUP, giris: tsGiris, topics: ts },
  { id: 'react', title: 'React', comment: '//', group: WEB_GROUP, giris: reactGiris, topics: react },
  { id: 'vue', title: 'Vue', comment: '//', group: WEB_GROUP, giris: vueGiris, topics: vue },
  { id: 'angular', title: 'Angular', comment: '//', group: WEB_GROUP, giris: angularGiris, topics: angular },
  { id: 'node', title: 'Node.js + Express', comment: '//', group: WEB_GROUP, giris: nodeGiris, topics: node },
  { id: 'nextjs', title: 'Next.js', comment: '//', hl: 'react', group: WEB_GROUP, giris: nextjsGiris, topics: nextjs },
  { id: 'svelte', title: 'Svelte', comment: '//', group: WEB_GROUP, giris: svelteGiris, topics: svelte },
  { id: 'tailwind', title: 'Tailwind', comment: '<!--', commentEnd: '-->', hl: 'html', group: WEB_GROUP, giris: tailwindGiris, topics: tailwind },
  { id: 'aspnet', title: 'ASP.NET Core', comment: '//', hl: 'csharp', group: BACKEND_GROUP, giris: aspnetGiris, topics: aspnet },
  { id: 'django', title: 'Django', comment: '#', hl: 'python', group: BACKEND_GROUP, giris: djangoGiris, topics: django },
  { id: 'spring', title: 'Spring Boot', comment: '//', hl: 'java', group: BACKEND_GROUP, giris: springGiris, topics: spring },
  { id: 'laravel', title: 'Laravel', comment: '//', hl: 'php', group: BACKEND_GROUP, giris: laravelGiris, topics: laravel },
  { id: 'git', title: 'Git', comment: '#', hl: 'bash', group: TOOLS_GROUP, giris: gitGiris, topics: git },
  { id: 'bash', title: 'Bash / Linux', comment: '#', group: TOOLS_GROUP, giris: bashGiris, topics: bash },
  { id: 'docker', title: 'Docker', comment: '#', hl: 'bash', group: TOOLS_GROUP, giris: dockerGiris, topics: docker },
  { id: 'mongodb', title: 'MongoDB', comment: '//', hl: 'js', group: DATA_GROUP, giris: mongodbGiris, topics: mongodb },
  { id: 'redis', title: 'Redis', comment: '#', hl: 'bash', group: DATA_GROUP, giris: redisGiris, topics: redis },
  { id: 'pandas', title: 'Pandas', comment: '#', hl: 'python', group: DATA_GROUP, giris: pandasGiris, topics: pandas },
  { id: 'ai-temel', title: 'Yapay Zeka Temelleri', comment: '#', hl: 'python', group: AI_GROUP, giris: aiTemelGiris, topics: aiTemel },
  { id: 'prompt', title: 'Prompt Mühendisliği', comment: '#', hl: 'prompt', group: AI_GROUP, giris: promptGiris, topics: prompt },
]
