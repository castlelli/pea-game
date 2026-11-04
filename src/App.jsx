import { useEffect, useRef, useState } from 'react'
import {
  TITULO,
  SUBTITULO,
  DESCRICAO,
  QUIZ,
  MINIGAME,
  TOTAL,
  REGRA,
} from './data.js'

function embaralhar(lista) {
  const a = [...lista]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function horaAgora() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function novaRodada() {
  return {
    quiz: QUIZ.map((q) => ({ ...q, opcoes: embaralhar(q.opcoes) })),
    mini: MINIGAME.map((e) => ({ ...e, cards: embaralhar(e.cards) })),
  }
}

function Feedback({ certo, texto, extra, ultimo, onNext }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])
  return (
    <div ref={ref} className={`feedback ${certo ? 'ok' : 'erro'}`} role="status">
      <p className="feedback-titulo">
        {certo ? '✔ Acertou! +1 ponto' : '✘ Errou'}
      </p>
      <p>{texto}</p>
      {extra && <p className="feedback-extra">{extra}</p>}
      <button className="btn" onClick={onNext}>
        {ultimo ? 'Ver resultado' : 'Avançar →'}
      </button>
    </div>
  )
}

function Progresso({ rotulo, atual, total }) {
  return (
    <div className="progresso">
      <span>
        {rotulo} {atual}/{total}
      </span>
      <div className="barra">
        <div style={{ width: `${(atual / total) * 100}%` }} />
      </div>
    </div>
  )
}

export default function App() {
  const [tela, setTela] = useState('inicio')
  const [nome, setNome] = useState('')
  const [rodada, setRodada] = useState(novaRodada)
  const [idx, setIdx] = useState(0)
  const [escolha, setEscolha] = useState(null)
  const [pontos, setPontos] = useState(0)
  const [hora, setHora] = useState('')

  function comecar(e) {
    e.preventDefault()
    if (!nome.trim()) return
    setRodada(novaRodada())
    setIdx(0)
    setEscolha(null)
    setPontos(0)
    setHora('')
    setTela('quiz')
  }

  function responder(i, certa) {
    if (escolha !== null) return
    setEscolha(i)
    if (certa) setPontos((p) => p + 1)
    if (tela === 'mini' && idx === rodada.mini.length - 1) setHora(horaAgora())
  }

  function avancar() {
    setEscolha(null)
    const total = tela === 'quiz' ? rodada.quiz.length : rodada.mini.length
    if (idx < total - 1) {
      setIdx(idx + 1)
    } else if (tela === 'quiz') {
      setIdx(0)
      setTela('mini')
    } else {
      setTela('fim')
    }
    window.scrollTo(0, 0)
  }

  if (tela === 'inicio') {
    return (
      <main className="app">
        <div className="sol" aria-hidden="true">☀️</div>
        <h1>{TITULO}</h1>
        <p className="sub">{SUBTITULO}</p>
        <p className="desc">{DESCRICAO}</p>
        <form onSubmit={comecar} className="form">
          <label htmlFor="nome">Seu nome</label>
          <input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            maxLength={40}
            required
          />
          <button className="btn" disabled={!nome.trim()}>
            Começar ⚡
          </button>
        </form>
        <p className="regra">
          {TOTAL} pontos no máximo. {REGRA}
        </p>
      </main>
    )
  }

  if (tela === 'quiz') {
    const q = rodada.quiz[idx]
    const respondida = escolha !== null
    const certo = respondida && q.opcoes[escolha].certa
    const textoCerta = q.opcoes.find((o) => o.certa).texto
    return (
      <main className="app">
        <Progresso rotulo="Quiz" atual={idx + 1} total={rodada.quiz.length} />
        <p className="tema">{q.tema}</p>
        <h2>{q.pergunta}</h2>
        <div className="opcoes">
          {q.opcoes.map((o, i) => {
            let cls = 'opcao'
            let marca = ''
            if (respondida && o.certa) {
              cls += ' certa'
              marca = '✔ '
            } else if (respondida && i === escolha) {
              cls += ' errada'
              marca = '✘ '
            }
            return (
              <button
                key={o.texto}
                className={cls}
                onClick={() => responder(i, o.certa)}
                disabled={respondida}
              >
                {marca}
                {o.texto}
              </button>
            )
          })}
        </div>
        {respondida && (
          <Feedback
            certo={certo}
            texto={q.explicacao}
            extra={certo ? null : `Resposta certa: ${textoCerta}.`}
            onNext={avancar}
          />
        )}
      </main>
    )
  }

  if (tela === 'mini') {
    const etapa = rodada.mini[idx]
    const respondida = escolha !== null
    const escolhido = respondida ? etapa.cards[escolha] : null
    const correto = etapa.cards.find((c) => c.certa)
    return (
      <main className="app">
        <Progresso rotulo="Etapa" atual={idx + 1} total={rodada.mini.length} />
        <section className="missao">
          <p className="missao-rotulo">🎯 Missão {idx + 1}</p>
          <p className="missao-objetivo">{etapa.objetivo}</p>
          <p className="missao-req">Requisitos:</p>
          <ul>
            {etapa.criterios.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          {etapa.dado && <p className="missao-dado">ℹ️ {etapa.dado}</p>}
        </section>
        <p className="instrucao">👇 Toque no card que cumpre a missão</p>
        <div className="cards">
          {etapa.cards.map((c, i) => {
            let cls = 'card'
            let selo = null
            if (respondida && c.certa) {
              cls += ' certa'
              selo = '✔ Certa'
            } else if (respondida && i === escolha) {
              cls += ' errada'
              selo = '✘ Sua escolha'
            }
            return (
              <button
                key={c.nome}
                className={cls}
                onClick={() => responder(i, c.certa)}
                disabled={respondida}
              >
                {selo && <span className="selo">{selo}</span>}
                <span className="card-nome">{c.nome}</span>
                <dl>
                  {c.specs.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </button>
            )
          })}
        </div>
        {respondida && (
          <Feedback
            certo={escolhido.certa}
            texto={escolhido.feedback}
            extra={
              escolhido.certa
                ? null
                : `A certa era ${correto.nome}: ${correto.feedback}`
            }
            ultimo={idx === rodada.mini.length - 1}
            onNext={avancar}
          />
        )}
      </main>
    )
  }

  return (
    <main className="app fim">
      <div className="sol" aria-hidden="true">🏆</div>
      <h1>Missão cumprida!</h1>
      <div className="placar">
        <p className="placar-nome">{nome.trim()}</p>
        <p className="placar-nota">
          {pontos}/{TOTAL}
        </p>
        <p className="placar-hora">Terminou às {hora}</p>
      </div>
      <p className="regra">
        Tire um print desta tela. {REGRA}
      </p>
      <p className="sub">{SUBTITULO}</p>
    </main>
  )
}
