import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  doc,
  onSnapshot,
  runTransaction,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { firebaseConfig } from './firebase-config.js'
import { SALA } from './data.js'

// `npm run dev:emulador` usa o emulador local do Firestore, sem tocar no projeto real.
const EMULADOR = import.meta.env.VITE_EMULADOR === '1'

export const configurado = EMULADOR || Boolean(firebaseConfig.projectId)

let db = null
if (configurado) {
  const app = initializeApp(EMULADOR ? { projectId: 'demo-pea-game' } : firebaseConfig)
  db = getFirestore(app)
  if (EMULADOR) connectFirestoreEmulator(db, location.hostname, 8080)
}

const grupos = () => collection(db, 'salas', SALA, 'grupos')

// Chama `cb` com a lista [{ id, nome, status, pontos, inicio, fim }] a cada mudança.
export function ouvirGrupos(cb, erro) {
  if (!db) return () => {}
  return onSnapshot(
    grupos(),
    (snap) =>
      cb(
        snap.docs.map((d) => {
          const v = d.data({ serverTimestamps: 'estimate' })
          return {
            id: d.id,
            ...v,
            inicio: v.inicio?.toDate() ?? null,
            fim: v.fim?.toDate() ?? null,
          }
        })
      ),
    erro
  )
}

// Reserva o grupo. Falha com Error('ocupado') se ele já jogou ou está jogando.
export async function reservarGrupo(grupo, nome) {
  const ref = doc(grupos(), grupo)
  await runTransaction(db, async (t) => {
    const atual = await t.get(ref)
    if (atual.exists()) throw new Error('ocupado')
    t.set(ref, { nome, status: 'jogando', pontos: 0, inicio: serverTimestamp() })
  })
}

export async function finalizar(grupo, pontos) {
  await updateDoc(doc(grupos(), grupo), {
    status: 'fim',
    pontos,
    fim: serverTimestamp(),
  })
}
