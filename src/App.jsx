import { useEffect, useRef, useState } from 'react'
import {
  TITULO,
  SUBTITULO,
  DESCRICAO,
  QUIZ,
  MINIGAME,
  TOTAL,
  REGRA,
  GRUPOS,
  MINUTOS_ABANDONO,
} from './data.js'
import { Icon, SunHero, TrophyHero } from './icons.jsx'
import { configurado, ouvirGrupos, reservarGrupo, finalizar } from './db.js'

function embaralhar(lista) {
  const a = [...lista]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Página só de ranking: qualquer endereço terminado em /ranking.
const SO_RANKING = /\/ranking\/?$/.test(window.location.pathname)

function horaDe(d) {
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// Situação de um grupo que ainda não terminou.
function situacao(g) {
  if (!g) return 'livre'
  if (g.status === 'fim') return 'fim'
  const minutos = g.inicio ? (Date.now() - g.inicio.getTime()) / 60000 : 0
  return minutos > MINUTOS_ABANDONO ? 'abandonou' : 'jogando'
}

const ROTULO = {
  livre: 'Ainda não jogou',
  jogando: 'Jogando…',
  abandonou: 'Não terminou',
}

function Ranking({ lista, meuGrupo }) {
  if (!lista) return <p className="regra">Carregando ranking…</p>
  const porId = Object.fromEntries(lista.map((g) => [g.id, g]))
  const terminados = lista
    .filter((g) => g.status === 'fim' && GRUPOS.includes(g.id))
    .sort((a, b) => b.pontos - a.pontos || a.fim - b.fim)
  const outros = GRUPOS.filter((id) => porId[id]?.status !== 'fim')
  return (
    <section className="ranking">
      <h2>
        <Icon name="trophy" size={22} /> Ranking ao vivo
      </h2>
      <ol>
        {terminados.map((g, i) => (
          <li key={g.id} className={g.id === meuGrupo ? 'meu' : ''}>
            <span className="pos">{i + 1}º</span>
            <span className="quem">
              <strong>Grupo {g.id}</strong>
              <small>{g.nome}</small>
            </span>
            <span className="nota">
              {g.pontos}/{TOTAL}
              <small>{g.fim ? horaDe(g.fim) : '…'}</small>
            </span>
          </li>
        ))}
        {outros.map((id) => {
          const s = situacao(porId[id])
          return (
            <li key={id} className={`pendente ${id === meuGrupo ? 'meu' : ''}`}>
              <span className="pos">–</span>
              <span className="quem">
                <strong>Grupo {id}</strong>
                {porId[id] && <small>{porId[id].nome}</small>}
              </span>
              <span className="nota">
                <small>{ROTULO[s]}</small>
              </span>
            </li>
          )
        })}
      </ol>
      <p className="regra">{REGRA}</p>
    </section>
  )
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
        <Icon name={certo ? 'check' : 'x'} size={26} />
        {certo ? 'Acertou! +1 ponto' : 'Errou'}
      </p>
      <p>{texto}</p>
      {extra && <p className="feedback-extra">{extra}</p>}
      <button className="btn" onClick={onNext}>
        {ultimo ? 'Ver resultado' : 'Avançar'} <Icon name="arrow" />
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
  const [selecionado, setSelecionado] = useState(null)
  const [pontos, setPontos] = useState(0)
  const [hora, setHora] = useState('')
  const [grupo, setGrupo] = useState(null)
  const [lista, setLista] = useState(null)
  const [aviso, setAviso] = useState('')
  const [reservando, setReservando] = useState(false)
  const [salvo, setSalvo] = useState('salvando')

  useEffect(
    () =>
      ouvirGrupos(setLista, () =>
        setAviso('Sem conexão com o ranking. Verifique a internet e recarregue.')
      ),
    []
  )

  // Avisa antes de sair no meio do jogo: quem sai perde a vez do grupo.
  useEffect(() => {
    if (tela !== 'quiz' && tela !== 'mini') return
    const aviso = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', aviso)
    return () => window.removeEventListener('beforeunload', aviso)
  }, [tela])

  // Na página /ranking, redesenha a cada 30 s para "Jogando…" virar "Não terminou".
  const [, setTique] = useState(0)
  useEffect(() => {
    if (!SO_RANKING) return
    const t = setInterval(() => setTique((n) => n + 1), 30000)
    return () => clearInterval(t)
  }, [])

  const ocupados = new Set((lista ?? []).map((g) => g.id))

  if (SO_RANKING) {
    return (
      <main className="app so-ranking">
        <h1>{TITULO}</h1>
        <p className="sub">{SUBTITULO}</p>
        {aviso && <p className="alerta">{aviso}</p>}
        <Ranking lista={lista} />
      </main>
    )
  }

  async function comecar(e) {
    e.preventDefault()
    if (!nome.trim() || !grupo || reservando) return
    setAviso('')
    setReservando(true)
    try {
      await reservarGrupo(grupo, nome.trim())
    } catch (err) {
      setReservando(false)
      setAviso(
        err.message === 'ocupado'
          ? `O Grupo ${grupo} já jogou ou está jogando. Cada grupo joga uma vez.`
          : 'Não foi possível reservar o grupo. Verifique a internet e tente de novo.'
      )
      setGrupo(null)
      return
    }
    setReservando(false)
    setRodada(novaRodada())
    setIdx(0)
    setEscolha(null)
    setSelecionado(null)
    setPontos(0)
    setHora('')
    setTela('quiz')
  }

  async function salvar(total) {
    setSalvo('salvando')
    try {
      await finalizar(grupo, total)
      setSalvo('ok')
    } catch {
      setSalvo('erro')
    }
  }

  function responder(i, certa) {
    if (escolha !== null) return
    setEscolha(i)
    const novo = pontos + (certa ? 1 : 0)
    setPontos(novo)
    if (tela === 'mini' && idx === rodada.mini.length - 1) {
      setHora(horaDe(new Date()))
      salvar(novo)
    }
  }

  function avancar() {
    setEscolha(null)
    setSelecionado(null)
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
        <SunHero />
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
          <span className="label">Seu grupo</span>
          {!configurado ? (
            <p className="alerta">
              Firebase não configurado. Preencha src/firebase-config.js.
            </p>
          ) : !lista ? (
            <p className="regra">Carregando grupos…</p>
          ) : (
            <div className="grupos" role="radiogroup" aria-label="Seu grupo">
              {GRUPOS.map((id) => {
                const usado = ocupados.has(id)
                const s = situacao(lista.find((g) => g.id === id))
                const rotulo = {
                  fim: 'já jogou',
                  jogando: 'jogando',
                  abandonou: 'não terminou',
                }[s]
                return (
                  <button
                    type="button"
                    key={id}
                    role="radio"
                    aria-checked={grupo === id}
                    className={`grupo${grupo === id ? ' ativo' : ''}`}
                    disabled={usado}
                    onClick={() => setGrupo(id)}
                  >
                    <strong>{id}</strong>
                    <small>{usado ? rotulo : grupo === id ? 'escolhido' : 'livre'}</small>
                  </button>
                )
              })}
            </div>
          )}
          {aviso && <p className="alerta">{aviso}</p>}
          <button
            className="btn"
            disabled={!nome.trim() || !grupo || ocupados.has(grupo) || reservando}
          >
            {reservando ? 'Reservando…' : 'Começar'} <Icon name="bolt" />
          </button>
        </form>
        <p className="regra">
          Cada grupo joga uma única vez. Se sair ou recarregar a página no meio,
          o grupo perde a vez. {TOTAL} pontos no máximo. {REGRA}
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
            let marca = null
            if (respondida && o.certa) {
              cls += ' certa'
              marca = <Icon name="check" />
            } else if (respondida && i === escolha) {
              cls += ' errada'
              marca = <Icon name="x" />
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
    const comSelecao = !respondida && selecionado !== null
    return (
      <main className={`app${comSelecao ? ' com-selecao' : ''}`}>
        <Progresso rotulo="Etapa" atual={idx + 1} total={rodada.mini.length} />
        <section className="missao">
          <p className="missao-rotulo">
            <Icon name="target" size={18} /> Missão {idx + 1}
          </p>
          <p className="missao-objetivo">{etapa.objetivo}</p>
          <p className="missao-req">Requisitos:</p>
          <ul>
            {etapa.criterios.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          {etapa.dado && (
            <p className="missao-dado">
              <Icon name="info" size={18} /> {etapa.dado}
            </p>
          )}
        </section>
        <p className="instrucao">
          <Icon name="tap" size={28} /> Selecione o card que cumpre a missão
          e confirme
        </p>
        <div className="cards">
          {etapa.cards.map((c, i) => {
            let cls = 'card'
            let selo = null
            if (respondida && c.certa) {
              cls += ' certa'
              selo = (
                <>
                  <Icon name="check" size={14} /> Certa
                </>
              )
            } else if (respondida && i === escolha) {
              cls += ' errada'
              selo = (
                <>
                  <Icon name="x" size={14} /> Sua escolha
                </>
              )
            } else if (!respondida && i === selecionado) {
              cls += ' selecionado'
              selo = (
                <>
                  <Icon name="check" size={14} /> Selecionado
                </>
              )
            }
            return (
              <button
                key={c.nome}
                className={cls}
                onClick={() => setSelecionado(i)}
                disabled={respondida}
                aria-pressed={i === selecionado}
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
        {!respondida && selecionado !== null && (
          <div className="confirmar">
            <p className="confirmar-escolha">
              Selecionado: <strong>{etapa.cards[selecionado].nome}</strong>
            </p>
            <button
              className="btn"
              onClick={() =>
                responder(selecionado, etapa.cards[selecionado].certa)
              }
            >
              Confirmar escolha <Icon name="check" />
            </button>
          </div>
        )}
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

  // Hora do servidor, quando já chegou; até lá, a do aparelho.
  const meu = (lista ?? []).find((g) => g.id === grupo)
  const horaFinal = meu?.status === 'fim' && meu.fim ? horaDe(meu.fim) : hora
  return (
    <main className="app fim">
      <TrophyHero />
      <h1>Missão cumprida!</h1>
      <div className="placar">
        <p className="placar-grupo">Grupo {grupo}</p>
        <p className="placar-nome">{nome.trim()}</p>
        <p className="placar-nota">
          {pontos}/{TOTAL}
        </p>
        <p className="placar-hora">Terminou às {horaFinal}</p>
        <p className={`salvo ${salvo}`}>
          {salvo === 'ok' && (
            <>
              <Icon name="check" size={16} /> Resultado salvo no ranking
            </>
          )}
          {salvo === 'salvando' && 'Salvando no ranking…'}
          {salvo === 'erro' && (
            <>
              <Icon name="x" size={16} /> Não foi possível salvar.{' '}
              <button className="link" onClick={() => salvar(pontos)}>
                Tentar de novo
              </button>
            </>
          )}
        </p>
      </div>
      <Ranking lista={lista} meuGrupo={grupo} />
      <p className="sub">{SUBTITULO}</p>
    </main>
  )
}
