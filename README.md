# Missão Solar – PEA3100, Relatório 4, Grupo 07

Jogo web (quiz + minigame) sobre o sistema fotovoltaico do Grupo 07. Os textos e números ficam em `src/data.js`.

## Instalar

```bash
npm install
```

## Rodar

```bash
npm run dev
```

Abra o endereço mostrado no terminal. Com `--host`, o jogo também abre pelo IP local, então dá para testar no celular na mesma rede.

## Gerar o build

```bash
npm run build
```

## Publicar

Envie a pasta `dist` para qualquer hospedagem estática, como GitHub Pages, Netlify ou Vercel. Como `base: './'` usa caminhos relativos, o jogo funciona em qualquer subpasta.
