import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { languages } from './data'
import type { Item, Language, Topic } from './data/types'
import { Code, highlight } from './CodeBlock'

type Theme = 'light' | 'dark'
type Row = { key: string; topic: string; item: Item }
const GIRIS = 'giris'

// Adres: #/<dil>/<konu>  (konu yoksa giriş sayfası)
function readHash(): { lang: string; topic: string } {
  const m = location.hash.match(/^#\/([\w-]+)(?:\/([\w-]+))?/)
  const lang = languages.find((l) => l.id === m?.[1]) ?? languages[0]
  const t = m?.[2]
  const topic = t && (t === GIRIS || lang.topics.some((x) => x.id === t)) ? t : GIRIS
  return { lang: lang.id, topic }
}

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem('kodora-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Seçenekleri maddeye göre sabit ama karışık sırada dizer (doğru hep ilk sırada olmasın)
function shuffled(options: string[], seed: string) {
  let h = 0
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const arr = options.map((text, index) => ({ text, index }))
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0
    const j = h % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Pratik: elle yazılmış üç seçenekli soru
function Quiz({ item }: { item: Item }) {
  const quiz = item.quiz!
  const options = useMemo(() => shuffled(quiz.o, item.syntax), [quiz, item.syntax])
  const [picked, setPicked] = useState<number | null>(null)
  const [shown, setShown] = useState(false)
  const correct = quiz.a
  return (
    <div className="practice">
      <div className="detail-label">Pratik</div>
      <p className="practice-q">{quiz.q}</p>
      <div className="options">
        {options.map((o) => {
          const isCorrect = o.index === correct
          const cls =
            (picked !== null || shown) && isCorrect ? 'option right' : picked === o.index && !isCorrect ? 'option wrong' : 'option'
          return (
            <button type="button" key={o.index} className={cls} onClick={() => setPicked(o.index)} disabled={shown}>
              {o.text}
            </button>
          )
        })}
      </div>
      <div className="practice-row">
        {picked !== null && picked === correct && <span className="practice-ok">Doğru.</span>}
        {picked !== null && picked !== correct && !shown && <span className="practice-bad">Yanlış, tekrar dene.</span>}
        {shown && <span className="practice-ok">Doğru cevap: <code>{quiz.o[correct]}</code></span>}
        <button type="button" className="copy practice-show" onClick={() => setShown(true)}>Cevabı göster</button>
      </div>
    </div>
  )
}

export function App() {
  const [route, setRoute] = useState(readHash)
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState<Theme>(readTheme)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState<Row | null>(null)

  useEffect(() => {
    const onHash = () => {
      setRoute(readHash())
      setSelected(null)
    }
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('kodora-theme', theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  // Panelin altındaki pratik alanı yalnızca yer varsa gösterilir; taşarsa gizlenir.
  const detailRef = useRef<HTMLElement>(null)
  const [showPractice, setShowPractice] = useState(true)
  useLayoutEffect(() => {
    setShowPractice(true)
    const onResize = () => setShowPractice(true)
    addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [selected?.key])
  useLayoutEffect(() => {
    const el = detailRef.current
    if (showPractice && el && el.scrollHeight > el.clientHeight + 1) setShowPractice(false)
  }, [showPractice, selected?.key])

  const lang: Language = languages.find((l) => l.id === route.lang) ?? languages[0]
  const topic = lang.topics.find((t) => t.id === route.topic) ?? null
  const hl = lang.hl ?? lang.id
  const q = query.trim().toLocaleLowerCase('tr')

  // Üst sekmeler: gruplu diller (SQL lehçeleri) tek sekmede açılır menü olur.
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  useEffect(() => {
    if (!openMenu) return
    const close = () => setOpenMenu(null)
    addEventListener('click', close)
    return () => removeEventListener('click', close)
  }, [openMenu])
  const tabs = languages.reduce<{ key: string; title: string; members: Language[] }[]>((acc, l) => {
    const key = l.group?.id ?? l.id
    const found = acc.find((t) => t.key === key)
    if (found) found.members.push(l)
    else acc.push({ key, title: l.group?.title ?? l.title, members: [l] })
    return acc
  }, [])

  // Arama kapalıyken seçili konunun satırları; açıkken bu dildeki tüm konulardan eşleşenler.
  const rows = useMemo<Row[]>(() => {
    const toRows = (t: Topic) => t.items.map((item, i) => ({ key: t.id + i, topic: t.title, item }))
    if (!q) return topic ? toRows(topic) : []
    return lang.topics
      .flatMap(toRows)
      .filter((r) => [r.topic, r.item.name, r.item.syntax, r.item.note, r.item.desc].join('\n').toLocaleLowerCase('tr').includes(q))
  }, [q, topic, lang])

  const go = (langId: string, topicId: string) => {
    location.hash = `#/${langId}/${topicId}`
    setQuery('')
    setMenuOpen(false)
    setSelected(null)
    scrollTo({ top: 0 })
  }

  const s = selected?.item

  return (
    <div className="app">
      <header className="topbar">
        <button type="button" className="icon-btn menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Menü">
          ☰
        </button>
        <a className="brand" href={`#/${lang.id}/${GIRIS}`} onClick={(e) => { e.preventDefault(); go(lang.id, GIRIS) }}>
          Kodora
        </a>
        <nav className="langs">
          {tabs.map((t) => {
            const active = t.members.some((m) => m.id === lang.id)
            if (t.members.length === 1) {
              const l = t.members[0]
              return (
                <a
                  key={t.key}
                  href={`#/${l.id}/${GIRIS}`}
                  className={active ? 'lang-tab active' : 'lang-tab'}
                  onClick={(e) => { e.preventDefault(); go(l.id, GIRIS) }}
                >
                  {l.title}
                </a>
              )
            }
            return (
              <div key={t.key} className="lang-group" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className={active ? 'lang-tab active' : 'lang-tab'}
                  onClick={() => setOpenMenu(openMenu === t.key ? null : t.key)}
                  aria-haspopup="menu"
                  aria-expanded={openMenu === t.key}
                >
                  {t.title} <span className="caret">▾</span>
                </button>
                {openMenu === t.key && (
                  <div className="lang-menu" role="menu">
                    {t.members.map((m) => (
                      <a
                        key={m.id}
                        href={`#/${m.id}/${GIRIS}`}
                        className={m.id === lang.id ? 'lang-item active' : 'lang-item'}
                        onClick={(e) => { e.preventDefault(); setOpenMenu(null); go(m.id, GIRIS) }}
                      >
                        {m.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        <input
          className="search"
          type="search"
          placeholder={`${lang.title} içinde ara…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="icon-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Tema değiştir"
          title="Tema değiştir"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>

      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}

      <nav className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <div className="nav-title">{lang.title}</div>
        <a
          href={`#/${lang.id}/${GIRIS}`}
          className={!q && !topic ? 'topic active' : 'topic'}
          onClick={(e) => { e.preventDefault(); go(lang.id, GIRIS) }}
        >
          <span className="num">·</span>
          Giriş
        </a>
        {lang.topics.map((t, i) => (
          <a
            key={t.id}
            href={`#/${lang.id}/${t.id}`}
            className={!q && t.id === topic?.id ? 'topic active' : 'topic'}
            onClick={(e) => { e.preventDefault(); go(lang.id, t.id) }}
          >
            <span className="num">{i + 1}</span>
            {t.title}
          </a>
        ))}
      </nav>

      <main className="content">
        {q ? (
          <>
            <h1>Arama: {query.trim()}</h1>
            {rows.length === 0 && <p className="empty">Sonuç yok</p>}
          </>
        ) : topic ? (
          <>
            <h1>{topic.title}</h1>
            <dl className="intro intro-inline">
              <div><dt>Nedir?</dt><dd>{topic.intro.what}</dd></div>
              <div><dt>Ne işe yarar?</dt><dd>{topic.intro.why}</dd></div>
              <div><dt>Nerede kullanılır?</dt><dd>{topic.intro.where}</dd></div>
            </dl>
          </>
        ) : (
          <>
            <h1>{lang.title} Giriş</h1>
            <p className="lead">Konulara başlamadan önce {lang.title} nedir ve neyi öğrenmek üzeresin, kısaca gör.</p>
            <dl className="intro giris">
              {lang.giris.map((g) => (
                <div key={g.q}><dt>{g.q}</dt><dd>{g.a}</dd></div>
              ))}
            </dl>
            <p className="lead">
              Sol menüden <a className="link" href={`#/${lang.id}/${lang.topics[0].id}`} onClick={(e) => { e.preventDefault(); go(lang.id, lang.topics[0].id) }}>1. {lang.topics[0].title}</a> ile başla. Her konuda kısa bir giriş ve kompakt bir yapı listesi var; satıra tıklayınca detay ve pratik sağda açılır.
            </p>
          </>
        )}

        {rows.length > 0 && (
          <div className="sheet">
            {rows.map((r) => (
              <button
                type="button"
                key={r.key}
                className={selected?.key === r.key ? 'row active' : 'row'}
                onClick={() => setSelected(selected?.key === r.key ? null : r)}
              >
                <span className="row-name">{r.item.name}</span>
                <span className="row-syntax">{highlight(r.item.syntax, hl)}</span>
                <span className="row-note">
                  {q && <span className="crumb">{r.topic} · </span>}
                  {lang.comment} {r.item.note}{lang.commentEnd ? ` ${lang.commentEnd}` : ''}
                </span>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Sağ panel hep açık: satır seçiliyse detay, değilse konunun kısa tanıtımı */}
      {!(selected && s) && (
        <aside className="detail">
          {q ? (
            <>
              <div className="detail-head"><span className="crumb">Arama</span></div>
              <p className="detail-text">{rows.length} sonuç. Bir satıra tıklayınca detayı burada açılır.</p>
            </>
          ) : topic ? (
            <>
              <div className="detail-head"><span className="crumb">{topic.title}</span></div>
              <div className="detail-label">Nedir?</div>
              <p className="detail-text">{topic.intro.what}</p>
              <div className="detail-label">Ne işe yarar?</div>
              <p className="detail-text">{topic.intro.why}</p>
              <div className="detail-label">Nerede kullanılır?</div>
              <p className="detail-text">{topic.intro.where}</p>
              <p className="detail-hint">Soldaki listeden bir satıra tıkla, detayı ve pratik sorusu burada açılır.</p>
            </>
          ) : (
            <>
              <div className="detail-head"><span className="crumb">Kodora</span></div>
              <p className="detail-text">Üstten dil, soldan konu seç. Konunun tanıtımı ve seçtiğin satırın detayı burada görünür.</p>
            </>
          )}
        </aside>
      )}

      {selected && s && (
        <aside className="detail selected" ref={detailRef}>
          <div className="detail-head">
            <span className="crumb">{selected.topic}</span>
            <button type="button" className="icon-btn" onClick={() => setSelected(null)} aria-label="Kapat">
              ×
            </button>
          </div>
          <h2 className="detail-name">{s.name}</h2>
          <div className="detail-syntax">{highlight(s.syntax, hl)}</div>
          <p className="detail-desc">{s.desc}</p>

          {s.when && (
            <>
              <div className="detail-label">Ne zaman</div>
              <p className="detail-text">{s.when}</p>
            </>
          )}

          {s.links && (
            <>
              <div className="detail-label">Programlar ve kurulum</div>
              <ul className="links">
                {s.links.map((l) => (
                  <li key={l.url}>
                    <a className="link" href={l.url} target="_blank" rel="noreferrer">
                      {l.name} ↗
                    </a>
                    <span>{l.info}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {s.examples.length > 0 && (
            <>
              <div className="detail-label">{s.examples.length > 1 ? 'Örnekler' : 'Örnek'}</div>
              {s.examples.map((ex, i) => (
                <Code key={i} lines={ex} lang={hl} />
              ))}
            </>
          )}

          {s.parts && (
            <>
              <div className="detail-label">Parçalar</div>
              <dl className="parts">
                {s.parts.map((p) => (
                  <div key={p.code}><dt>{highlight(p.code, hl)}</dt><dd>{p.note}</dd></div>
                ))}
              </dl>
            </>
          )}

          {s.tips && (
            <>
              <div className="detail-label">Not</div>
              <ul className="tips">
                {s.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          )}

          {s.warning && (
            <>
              <div className="detail-label">Sık yapılan hata</div>
              <p className="warning">{s.warning}</p>
            </>
          )}

          {showPractice && s.quiz && <Quiz key={selected.key} item={s} />}
        </aside>
      )}
    </div>
  )
}
