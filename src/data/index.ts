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

const SQL_GROUP = { id: 'sql', title: 'SQL' }
const WEB_GROUP = { id: 'web', title: 'Web' }
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
]
