import { useState } from 'react'

// Küçük renklendirici: bağımlılık yok, satır satır çalışır, dile göre anahtar kelime seti seçer.
type LangDef = { types: Set<string>; keywords: Set<string>; comment: string }

const LANGS: Record<string, LangDef> = {
  csharp: {
    types: new Set(['int', 'long', 'byte', 'double', 'float', 'decimal', 'string', 'char', 'bool', 'var', 'void', 'object']),
    keywords: new Set([
      'using', 'namespace', 'class', 'static', 'const', 'if', 'else', 'switch', 'case', 'default', 'break',
      'continue', 'for', 'foreach', 'while', 'do', 'in', 'return', 'new', 'public', 'private', 'protected',
      'true', 'false', 'null', 'out', 'ref', 'this', 'base', 'get', 'set', 'virtual', 'override', 'interface',
      'abstract', 'record', 'async', 'await', 'event', 'delegate', 'throw', 'try', 'catch', 'finally', 'is', 'params',
    ]),
    comment: '\\/\\/.*|\\/\\*.*',
  },
  python: {
    types: new Set(['int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple', 'None', 'object']),
    keywords: new Set([
      'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'in', 'return', 'import', 'from', 'as', 'with',
      'try', 'except', 'finally', 'raise', 'lambda', 'yield', 'pass', 'break', 'continue', 'and', 'or', 'not',
      'is', 'True', 'False', 'async', 'await', 'global', 'nonlocal', 'self', 'match', 'case', 'del', 'assert',
    ]),
    comment: '#.*',
  },
  java: {
    types: new Set(['int', 'long', 'short', 'byte', 'double', 'float', 'char', 'boolean', 'void', 'var', 'String', 'Integer', 'Double', 'Boolean', 'Long']),
    keywords: new Set([
      'package', 'import', 'class', 'interface', 'enum', 'record', 'extends', 'implements', 'public', 'private',
      'protected', 'static', 'final', 'abstract', 'new', 'this', 'super', 'return', 'if', 'else', 'switch', 'case',
      'default', 'break', 'continue', 'for', 'while', 'do', 'try', 'catch', 'finally', 'throw', 'throws', 'true',
      'false', 'null', 'instanceof', 'synchronized', 'volatile', 'transient', 'assert',
    ]),
    comment: '\\/\\/.*|\\/\\*.*',
  },
  cpp: {
    types: new Set(['int', 'long', 'short', 'char', 'double', 'float', 'bool', 'void', 'auto', 'unsigned', 'signed', 'size_t', 'string', 'vector', 'map', 'set', 'pair', 'optional']),
    keywords: new Set([
      'include', 'define', 'pragma', 'using', 'namespace', 'class', 'struct', 'enum', 'template', 'typename',
      'public', 'private', 'protected', 'virtual', 'override', 'static', 'const', 'constexpr', 'inline', 'new',
      'delete', 'this', 'return', 'if', 'else', 'switch', 'case', 'default', 'break', 'continue', 'for', 'while',
      'do', 'try', 'catch', 'throw', 'true', 'false', 'nullptr', 'noexcept', 'operator', 'std', 'friend', 'explicit',
    ]),
    comment: '\\/\\/.*|\\/\\*.*',
  },
  c: {
    types: new Set(['int', 'long', 'short', 'char', 'double', 'float', 'void', 'unsigned', 'signed', 'size_t', 'bool', 'FILE', 'struct', 'union', 'enum']),
    keywords: new Set([
      'include', 'define', 'ifdef', 'ifndef', 'endif', 'pragma', 'typedef', 'static', 'extern', 'const', 'return',
      'if', 'else', 'switch', 'case', 'default', 'break', 'continue', 'for', 'while', 'do', 'goto', 'sizeof',
      'NULL', 'true', 'false', 'inline', 'volatile', 'register',
    ]),
    comment: '\\/\\/.*|\\/\\*.*',
  },
  php: {
    types: new Set(['int', 'float', 'string', 'bool', 'array', 'void', 'null', 'mixed', 'object', 'callable', 'iterable']),
    keywords: new Set([
      'function', 'fn', 'class', 'interface', 'trait', 'enum', 'extends', 'implements', 'new', 'return', 'if',
      'elseif', 'else', 'endif', 'switch', 'case', 'match', 'default', 'break', 'continue', 'for', 'foreach',
      'endforeach', 'while', 'do', 'as', 'try', 'catch', 'finally', 'throw', 'public', 'private', 'protected',
      'static', 'readonly', 'abstract', 'const', 'namespace', 'use', 'require', 'require_once', 'include', 'echo',
      'print', 'true', 'false', 'global', 'declare', 'yield', 'instanceof', 'self', 'parent',
    ]),
    comment: '\\/\\/.*|#.*|\\/\\*.*',
  },
  sql: {
    types: new Set(['INT', 'INTEGER', 'BIGINT', 'SMALLINT', 'TINYINT', 'DECIMAL', 'NUMERIC', 'FLOAT', 'DOUBLE', 'REAL', 'VARCHAR', 'NVARCHAR', 'CHAR', 'TEXT', 'BOOLEAN', 'BIT', 'DATE', 'DATETIME', 'DATETIME2', 'TIMESTAMP', 'SERIAL', 'NULL']),
    keywords: new Set([
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'LIKE', 'ILIKE', 'BETWEEN', 'EXISTS', 'AS',
      'ORDER', 'BY', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'TOP', 'FETCH', 'NEXT', 'ROWS', 'ONLY', 'DISTINCT',
      'GROUP', 'HAVING', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'CROSS', 'ON', 'UNION', 'ALL',
      'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DATABASE', 'VIEW', 'INDEX',
      'DROP', 'ALTER', 'ADD', 'COLUMN', 'MODIFY', 'TRUNCATE', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
      'UNIQUE', 'DEFAULT', 'CHECK', 'CASCADE', 'AUTO_INCREMENT', 'IDENTITY', 'AUTOINCREMENT', 'GENERATED',
      'ALWAYS', 'WITH', 'RECURSIVE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'BEGIN', 'COMMIT', 'ROLLBACK',
      'TRANSACTION', 'START', 'SAVEPOINT', 'SAVE', 'TO', 'PROCEDURE', 'FUNCTION', 'RETURNS', 'TRIGGER', 'AFTER',
      'BEFORE', 'FOR', 'EACH', 'ROW', 'EXECUTE', 'EXEC', 'CALL', 'LANGUAGE', 'DELIMITER', 'IF', 'USE', 'SHOW',
      'TABLES', 'DESCRIBE', 'EXPLAIN', 'ANALYZE', 'QUERY', 'PLAN', 'GRANT', 'REVOKE', 'USER', 'LOGIN', 'PASSWORD',
      'IDENTIFIED', 'BACKUP', 'RESTORE', 'DISK', 'OVER', 'PARTITION', 'INTERVAL', 'DAY', 'MONTH', 'YEAR',
      'TRUE', 'FALSE', 'MERGE', 'USING', 'MATCHED', 'CONFLICT', 'DO', 'NOTHING', 'DUPLICATE', 'RETURNING',
      'OUTPUT', 'INSERTED', 'EXCLUDED', 'CAST', 'NULLS', 'LAST', 'FIRST', 'SCHEMA', 'PRAGMA', 'SOURCE', 'DECLARE',
    ]),
    comment: '--.*|\\/\\*.*',
  },
  html: {
    types: new Set(['href', 'src', 'alt', 'class', 'id', 'type', 'name', 'value', 'placeholder', 'rel', 'content', 'charset', 'lang', 'for', 'action', 'method', 'width', 'height', 'title', 'required', 'defer', 'target', 'style']),
    keywords: new Set([
      'html', 'head', 'body', 'title', 'meta', 'link', 'script', 'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'form', 'input', 'button', 'label', 'select', 'option', 'textarea',
      'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'caption', 'header', 'nav', 'main', 'section',
      'article', 'aside', 'footer', 'br', 'hr', 'strong', 'em', 'small', 'mark', 'del', 'ins', 'pre', 'code',
      'blockquote', 'q', 'figure', 'figcaption', 'video', 'audio', 'source', 'iframe', 'svg', 'path', 'canvas',
      'details', 'summary', 'dialog', 'dl', 'dt', 'dd', 'abbr', 'DOCTYPE',
    ]),
    comment: '<!--.*',
  },
  css: {
    types: new Set(['color', 'background', 'background-color', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom', 'font-size', 'font-family', 'font-weight', 'line-height', 'gap', 'flex', 'grid', 'transition', 'transform', 'opacity', 'overflow', 'z-index', 'content', 'cursor', 'animation', 'max-width', 'min-height', 'text-align', 'box-shadow', 'border-radius', 'box-sizing']),
    keywords: new Set(['flex', 'grid', 'none', 'block', 'inline', 'inline-block', 'center', 'auto', 'absolute', 'relative', 'fixed', 'sticky', 'hidden', 'solid', 'bold', 'important', 'media', 'keyframes', 'root', 'hover', 'focus', 'before', 'after', 'var', 'calc', 'clamp', 'repeat', 'minmax', 'url', 'rgb', 'hsl', 'translate', 'rotate', 'scale', 'layer', 'import']),
    comment: '\\/\\*.*',
  },
  js: {
    types: new Set(['document', 'window', 'console', 'Math', 'JSON', 'Object', 'Array', 'Promise', 'Date', 'Number', 'String', 'Map', 'Set', 'Error', 'localStorage']),
    keywords: new Set([
      'const', 'let', 'var', 'function', 'return', 'if', 'else', 'switch', 'case', 'default', 'break', 'continue',
      'for', 'of', 'in', 'while', 'do', 'class', 'extends', 'new', 'this', 'super', 'static', 'get', 'set',
      'async', 'await', 'try', 'catch', 'finally', 'throw', 'import', 'export', 'from', 'as', 'true', 'false',
      'null', 'undefined', 'typeof', 'instanceof', 'delete', 'yield', 'debugger',
    ]),
    comment: '\\/\\/.*|\\/\\*.*',
  },
}
// TypeScript ve React: JS tanımını genişletir.
LANGS.ts = {
  types: new Set([...LANGS.js.types, 'string', 'number', 'boolean', 'unknown', 'any', 'void', 'never', 'object', 'Record', 'Partial', 'Required', 'Readonly', 'Pick', 'Omit', 'ReturnType', 'NonNullable', 'Exclude', 'Extract', 'HTMLElement', 'HTMLInputElement', 'HTMLButtonElement', 'Event', 'MouseEvent', 'KeyboardEvent', 'FormData']),
  keywords: new Set([...LANGS.js.keywords, 'interface', 'type', 'enum', 'implements', 'abstract', 'readonly', 'keyof', 'declare', 'namespace', 'is', 'satisfies', 'private', 'public', 'protected', 'override']),
  comment: LANGS.js.comment,
}
LANGS.vue = {
  types: new Set([...LANGS.ts.types, 'ref', 'reactive', 'computed', 'watch', 'watchEffect', 'onMounted', 'onUnmounted', 'onUpdated', 'defineProps', 'defineEmits', 'defineModel', 'withDefaults', 'defineStore', 'storeToRefs', 'useRoute', 'useRouter', 'createApp', 'createRouter', 'createPinia', 'nextTick', 'toRefs', 'provide', 'inject', 'useTemplateRef', 'defineAsyncComponent', 'RouterView', 'RouterLink', 'Transition', 'KeepAlive']),
  keywords: new Set([...LANGS.ts.keywords, 'v-if', 'v-else', 'v-for', 'v-model', 'v-show', 'v-bind', 'v-on', 'template', 'script', 'style', 'setup', 'scoped']),
  comment: LANGS.js.comment,
}
LANGS.angular = {
  types: new Set([...LANGS.ts.types, 'Component', 'Injectable', 'Directive', 'Pipe', 'signal', 'computed', 'effect', 'input', 'output', 'model', 'inject', 'viewChild', 'linkedSignal', 'toSignal', 'HttpClient', 'Router', 'Routes', 'ActivatedRoute', 'FormGroup', 'FormControl', 'Validators', 'FormsModule', 'ReactiveFormsModule', 'RouterOutlet', 'RouterLink', 'TestBed', 'httpResource', 'provideRouter', 'provideHttpClient', 'map', 'switchMap', 'catchError', 'forkJoin', 'of']),
  keywords: new Set([...LANGS.ts.keywords, '@if', '@else', '@for', '@switch', '@case', '@default', '@empty', '@defer', '@placeholder', 'track', 'selector', 'template', 'imports', 'providers']),
  comment: LANGS.js.comment,
}
LANGS.node = {
  types: new Set([...LANGS.ts.types, 'express', 'Router', 'Request', 'Response', 'NextFunction', 'process', 'req', 'res', 'next', 'app', 'jwt', 'bcrypt', 'z', 'prisma', 'pool', 'path', 'fs', 'cors', 'helmet', 'morgan', 'multer']),
  keywords: LANGS.ts.keywords,
  comment: LANGS.js.comment,
}
LANGS.svelte = {
  types: new Set([...LANGS.ts.types, '$state', '$derived', '$effect', '$props', '$bindable', '$inspect', 'goto', 'page', 'fail', 'redirect', 'error', 'json', 'enhance', 'invalidateAll', 'fade', 'fly']),
  keywords: new Set([...LANGS.ts.keywords, 'each', 'snippet', 'render', 'await', 'then', 'bind', 'transition', 'onclick', 'actions', 'load']),
  comment: LANGS.js.comment,
}
LANGS.bash = {
  types: new Set(['git', 'docker', 'npm', 'npx', 'node', 'sudo', 'ls', 'cd', 'cp', 'mv', 'rm', 'cat', 'grep', 'find', 'sed', 'awk', 'tar', 'ssh', 'curl', 'chmod', 'chown', 'mkdir', 'touch', 'echo', 'tail', 'head', 'kill', 'ps', 'systemctl', 'apt', 'rsync', 'scp', 'gh', 'FROM', 'RUN', 'COPY', 'CMD', 'ENTRYPOINT', 'WORKDIR', 'ENV', 'EXPOSE', 'USER', 'ARG', 'services', 'image', 'build', 'ports', 'volumes', 'environment', 'depends_on']),
  keywords: new Set(['if', 'then', 'else', 'elif', 'fi', 'for', 'in', 'do', 'done', 'while', 'case', 'esac', 'function', 'return', 'exit', 'export', 'local', 'set', 'true', 'false', 'AS']),
  comment: '#.*',
}
LANGS.react = {
  types: new Set([...LANGS.ts.types, 'React', 'useState', 'useEffect', 'useRef', 'useContext', 'useReducer', 'useMemo', 'useCallback', 'useId', 'useLayoutEffect', 'createContext', 'createRoot', 'StrictMode', 'memo', 'lazy', 'Suspense', 'Link', 'NavLink', 'Route', 'Routes', 'Outlet', 'Navigate', 'BrowserRouter', 'useParams', 'useNavigate', 'useSearchParams', 'useQuery', 'ErrorBoundary']),
  keywords: LANGS.ts.keywords,
  comment: LANGS.js.comment,
}

const tokenizers: Record<string, RegExp> = {}
function tokenizer(lang: string) {
  if (!tokenizers[lang]) {
    const def = LANGS[lang] ?? LANGS.csharp
    tokenizers[lang] = new RegExp(
      `(${def.comment})|([$fFrRbB]?"(?:[^"\\\\]|\\\\.)*"|[fFrRbB]?'(?:[^'\\\\]|\\\\.)*')|(\\b\\d+(?:\\.\\d+)?[fFmMdDlL]?\\b)|([A-Za-z_]\\w*)|(\\s+)|(.)`,
      'g',
    )
  }
  return tokenizers[lang]
}

export function highlight(code: string, lang = 'csharp') {
  const def = LANGS[lang] ?? LANGS.csharp
  if (lang === 'csharp' && code.includes('*/') && !code.includes('/*')) return <span className="tok-cm">{code}</span>
  const re = tokenizer(lang)
  const out: React.ReactNode[] = []
  let m: RegExpExecArray | null
  re.lastIndex = 0
  while ((m = re.exec(code))) {
    const [text, cm, str, num, id] = m
    let cls = ''
    if (cm) cls = 'tok-cm'
    else if (str) cls = 'tok-str'
    else if (num) cls = 'tok-num'
    else if (id) {
      const next = code.slice(re.lastIndex).match(/^\s*\(/)
      if (def.types.has(id)) cls = 'tok-type'
      else if (def.keywords.has(id)) cls = 'tok-kw'
      else if (next) cls = 'tok-fn'
      else if (/^[A-Z]/.test(id)) cls = 'tok-cls'
    }
    out.push(cls ? <span key={out.length} className={cls}>{text}</span> : text)
  }
  return out
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 1400)
    } catch {}
  }
  return (
    <button type="button" className="copy" onClick={onClick} title="Kopyala">
      {done ? 'Kopyalandı' : 'Kopyala'}
    </button>
  )
}

// Detay panelindeki kod bloğu: sade, kopyalanabilir, satır sarar.
export function Code({ lines, lang }: { lines: string[]; lang: string }) {
  return (
    <div className="code-wrap">
      <pre className="code">
        {lines.map((l, i) => (
          <div className="code-line" key={i}>{l ? highlight(l, lang) : ' '}</div>
        ))}
      </pre>
      <CopyButton text={lines.join('\n')} />
    </div>
  )
}
