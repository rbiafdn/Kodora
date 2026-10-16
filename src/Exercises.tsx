import { useEffect, useMemo, useState } from 'react'
import type { Exercise, Language } from './data/types'
import { Code } from './CodeBlock'

export const EGZ = 'egzersizler'

// İlerleme tarayıcıda saklanır: hangi adımlar bitti, hangi notlar yazıldı.
export type Progress = { done: boolean[]; notes: string[]; t: number }
const key = (langId: string, topicId: string) => `kodora-egz:${langId}:${topicId}`

export function loadProgress(langId: string, topicId: string, n: number): Progress {
  try {
    const raw = localStorage.getItem(key(langId, topicId))
    if (raw) {
      const p = JSON.parse(raw) as Progress
      return { done: Array.from({ length: n }, (_, i) => !!p.done?.[i]), notes: Array.from({ length: n }, (_, i) => p.notes?.[i] ?? ''), t: p.t ?? 0 }
    }
  } catch {}
  return { done: Array(n).fill(false), notes: Array(n).fill(''), t: 0 }
}

function saveProgress(langId: string, topicId: string, p: Progress) {
  try {
    localStorage.setItem(key(langId, topicId), JSON.stringify({ ...p, t: Date.now() }))
  } catch {}
}

function clearProgress(langId: string, topicId: string) {
  try {
    localStorage.removeItem(key(langId, topicId))
  } catch {}
}

export function doneCount(langId: string, e: Exercise) {
  return loadProgress(langId, e.topic, e.adimlar.length).done.filter(Boolean).length
}

export function completedExercises(lang: Language) {
  return (lang.egzersizler ?? []).filter((e) => doneCount(lang.id, e) === e.adimlar.length).length
}

type ListProps = { lang: Language; tick: number; open: (topicId: string) => void }

// Egzersiz listesi: konu başına bir kart, ilerleme çubuğu, Başla / Devam et.
export function ExerciseList({ lang, tick, open }: ListProps) {
  const list = lang.egzersizler ?? []
  const total = list.length
  const finished = completedExercises(lang)
  return (
    <>
      <h1>Egzersizler</h1>
      <p className="lead">
        Her konu için küçük bir uygulamalı proje. Adımları yaptıkça işaretle, notunu yaz; ilerlemen bu tarayıcıda saklanır, istediğin zaman kaldığın yerden devam edersin.
        <span className="egz-total"> {finished}/{total} egzersiz tamamlandı.</span>
      </p>
      <div className="egz-list" key={tick}>
        {list.map((e, i) => {
          const t = lang.topics.find((x) => x.id === e.topic)
          const n = e.adimlar.length
          const d = doneCount(lang.id, e)
          const state = d === 0 ? 'Başla' : d === n ? 'Tekrar aç' : 'Devam et'
          return (
            <button type="button" key={e.topic} className={d === n ? 'egz-card finished' : 'egz-card'} onClick={() => open(e.topic)}>
              <span className="egz-num">{i + 1}</span>
              <span className="egz-body">
                <span className="egz-topic">{t?.title ?? e.topic}</span>
                <span className="egz-title">{e.title}</span>
                <span className="egz-amac">{e.amac}</span>
                <span className="egz-bar"><span style={{ width: `${(d / n) * 100}%` }} /></span>
              </span>
              <span className="egz-state">
                <span className="egz-count">{d}/{n} adım</span>
                <span className="egz-btn">{state}</span>
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}

type ViewProps = {
  lang: Language
  exercise: Exercise
  hl: string
  onChange: () => void
  back: () => void
  next: (() => void) | null
}

// Tek egzersiz: adımlar işaretlenir, not yazılır; seçili adımın ipucu ve çözümü sağ panelde (mobilde satır içinde).
export function ExerciseView({ lang, exercise, hl, onChange, back, next }: ViewProps) {
  const n = exercise.adimlar.length
  const [p, setP] = useState<Progress>(() => loadProgress(lang.id, exercise.topic, n))
  const firstOpen = p.done.findIndex((d) => !d)
  const [active, setActive] = useState(firstOpen < 0 ? 0 : firstOpen)
  const [showSolution, setShowSolution] = useState(false)

  useEffect(() => {
    const np = loadProgress(lang.id, exercise.topic, n)
    setP(np)
    const f = np.done.findIndex((d) => !d)
    setActive(f < 0 ? 0 : f)
    setShowSolution(false)
  }, [lang.id, exercise.topic, n])

  const update = (np: Progress) => {
    setP(np)
    saveProgress(lang.id, exercise.topic, np)
    onChange()
  }
  const toggle = (i: number) => {
    const done = p.done.slice()
    done[i] = !done[i]
    update({ ...p, done })
    if (done[i]) {
      const f = done.findIndex((d, j) => !d && j > i)
      if (f >= 0) setActive(f)
      setShowSolution(false)
    }
  }
  const note = (i: number, v: string) => {
    const notes = p.notes.slice()
    notes[i] = v
    update({ ...p, notes })
  }
  const reset = () => {
    if (!confirm('Bu egzersizin işaretleri ve notları silinsin mi?')) return
    clearProgress(lang.id, exercise.topic)
    update({ done: Array(n).fill(false), notes: Array(n).fill(''), t: 0 })
    setActive(0)
    setShowSolution(false)
  }
  const d = p.done.filter(Boolean).length
  const finished = d === n
  const step = exercise.adimlar[active]
  const topic = lang.topics.find((x) => x.id === exercise.topic)

  const aid = useMemo(
    () => (
      <div className="egz-aid">
        <div className="detail-label">Adım {active + 1} · {finished ? 'Tamamlandı' : p.done[active] ? 'Yapıldı' : 'Sırada'}</div>
        <p className="detail-text">{step.gorev}</p>
        {step.ipucu && (
          <>
            <div className="detail-label">İpucu</div>
            <p className="detail-text">{step.ipucu}</p>
          </>
        )}
        {step.cozum && (
          <>
            <div className="detail-label">Örnek çözüm</div>
            {showSolution ? <Code lines={step.cozum} lang={hl} /> : (
              <button type="button" className="copy egz-show" onClick={() => setShowSolution(true)}>Çözümü göster</button>
            )}
          </>
        )}
        {finished && exercise.sonuc && (
          <>
            <div className="detail-label">Tebrikler</div>
            <p className="detail-text egz-sonuc">{exercise.sonuc}</p>
          </>
        )}
      </div>
    ),
    [active, step, showSolution, finished, p.done, hl, exercise.sonuc],
  )

  return (
    <>
      <main className="content">
        <div className="egz-head">
          <button type="button" className="link egz-back" onClick={back}>← Egzersizler</button>
          <span className="crumb">{topic?.title}</span>
        </div>
        <h1>{exercise.title}</h1>
        <p className="lead">{exercise.amac}</p>
        <div className="egz-progress">
          <span className="egz-bar"><span style={{ width: `${(d / n) * 100}%` }} /></span>
          <span className="egz-count">{d}/{n} adım</span>
          <button type="button" className="copy" onClick={reset}>Sıfırla</button>
          {next && finished && <button type="button" className="copy egz-next" onClick={next}>Sonraki egzersiz →</button>}
        </div>
        <ol className="steps">
          {exercise.adimlar.map((s, i) => (
            <li key={i} className={(p.done[i] ? 'step done' : 'step') + (i === active ? ' active' : '')} onClick={() => { setActive(i); setShowSolution(false) }}>
              <label className="step-row" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={p.done[i]} onChange={() => toggle(i)} />
                <span className="step-num">{i + 1}</span>
                <span className="step-text">{s.gorev}</span>
              </label>
              <textarea
                className="step-note"
                placeholder="Notun, cevabın veya yazdığın kod…"
                value={p.notes[i]}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => note(i, e.target.value)}
                rows={p.notes[i] ? Math.min(8, p.notes[i].split('\n').length + 1) : 1}
              />
              {i === active && <div className="egz-inline">{aid}</div>}
            </li>
          ))}
        </ol>
      </main>
      <aside className="detail egz-side">
        <div className="detail-head"><span className="crumb">{exercise.title}</span></div>
        <p className="detail-text egz-side-count">{d}/{n} adım tamamlandı</p>
        {aid}
        <p className="detail-hint">Soldaki adıma tıklayınca ipucu ve çözümü burada görürsün. Yaptığın adımı işaretle; sonraki adım otomatik seçilir.</p>
      </aside>
    </>
  )
}
