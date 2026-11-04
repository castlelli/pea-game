# Missão Solar – PEA3100, Relatório 4, Grupo 07

Jogo web (quiz + minigame) sobre o sistema fotovoltaico do Grupo 07. Cada grupo joga uma única vez,
e o ranking ao vivo aparece na tela final. Os textos e números ficam em `src/data.js`.

## Instalar e rodar

```bash
npm install
npm run dev        # usa o Firebase configurado em src/firebase-config.js
npm run build      # gera a pasta dist
```

## Configurar o Firebase (uma vez, cerca de 5 minutos)

1. Em <https://console.firebase.google.com>, clique em **Add project**. O Analytics pode ficar desligado.
2. Em **Build → Firestore Database → Create database**, escolha a região `southamerica-east1` e o modo **production**.
3. Em **Project settings → Your apps → Web (`</>`)**, registre o app e copie o `firebaseConfig`
   para `src/firebase-config.js`. Esse config não é segredo: os dados são protegidos pelas regras.
4. Em **Firestore → Rules**, cole o conteúdo de `firestore.rules` e clique em **Publish**.

## Como funciona

- Os dados ficam em `salas/{SALA}/grupos/{grupo}`, com um documento por grupo.
- Ao clicar em **Começar**, o grupo é reservado. As regras impedem reservar o mesmo grupo duas vezes.
- Quem sai ou recarrega no meio perde a vez: o grupo continua reservado e aparece como "Jogando…".
  Depois de `MINUTOS_ABANDONO` (20 min), passa a aparecer como "Não terminou".
- No fim, a nota é gravada uma única vez, com a hora do servidor. O desempate usa essa hora.
- **Só o ranking:** abra `/ranking` (por exemplo, <https://pea3100-g7.web.app/ranking>). Essa página não tem jogo nem links e se atualiza sozinha.
- Para mudar os grupos, edite `GRUPOS` em `src/data.js` e a lista em `firestore.rules`.

## Testes e reset

- Durante os testes, deixe `SALA = 'teste'` em `src/data.js`. Também valem `'teste2'`, `'teste3'` etc.,
  que começam sempre vazias.
- **Antes da aula, troque para `SALA = 'aula'`**, rode `npm run build` e publique de novo.
- **Para zerar uma sala:** em **Firestore → Data**, abra `salas`, clique nos três pontos ao lado da sala
  (por exemplo, `teste`) e escolha **Delete document**, marcando a opção de apagar as subcoleções.
- **Para liberar um único grupo** (por exemplo, se alguém escolheu o grupo errado), apague só o documento
  dele em `salas/aula/grupos`.

### Sem tocar no projeto real (opcional)

Com `firebase-tools` e Java instalados:

```bash
npx firebase-tools emulators:start --only firestore --project demo-pea-game
npm run dev:emulador
```

## Publicar

Envie a pasta `dist` para qualquer hospedagem estática. Pelo Firebase Hosting, que já está em `firebase.json`:

```bash
npx firebase-tools login
npx firebase-tools deploy --only hosting,firestore:rules --project <id-do-projeto>
```
