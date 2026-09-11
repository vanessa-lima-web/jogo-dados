# Jogo de Dados

Projeto Next.js da disciplina **Sistemas para Internet** (UNICAP).

Dois jogadores disputam **5 rodadas**. Em cada rodada cada um lança **dois dados**. Vence a rodada quem tiver a **maior soma**. Se as somas forem iguais, a rodada empata. Ao final das cinco rodadas o jogo informa quem venceu a partida ou se houve empate geral.

## Regras

- Apenas um botão de jogar fica habilitado por vez
- Ordem da rodada: Jogador 1 → Jogador 2 → resultado
- Textos de resultado: `Jogador 1 venceu`, `Jogador 2 venceu` ou `Empate`
- Depois da 5ª rodada aparece o placar da partida e o botão **Jogar Novamente**

## Componentes

- `components/Dado.tsx` — recebe a prop `valor` (1 a 6) e exibe a imagem correspondente
- `components/JogoDados.tsx` — controla rodadas, somas, placar e botões
- `components/Fundo3D.tsx` — fundo com Three.js (dados flutuantes e partículas)

As faces dos dados estão em `public/dados/` (`1.svg` até `6.svg`).

## Como executar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | ambiente de desenvolvimento |
| `npm run build` | build de produção |
| `npm start` | sobe o build |
| `npm run lint` | ESLint |

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Three.js
