# React Hooks Tetris

Classic Tetris built with React 18, TypeScript, and styled-components. Runs in the browser with full keyboard support and on-screen touch controls for mobile.

**[Play now on GitHub Pages](https://mastergennadij.github.io/react-hooks-tetris/)**

## Features

- 7 tetromino types (I, J, L, O, S, T, Z) with randomised spawning
- Level progression — speed increases every 10 cleared rows
- Scoring: 40 / 100 / 300 / 1200 points for 1–4 simultaneous lines, scaled by level
- Responsive layout — board and stats adapt to any screen size
- Mobile D-pad controls with hold-to-repeat for movement and soft-drop

## Controls

| Action | Keyboard | Mobile |
|---|---|---|
| Move left / right | ← → | ◀ ▶ |
| Soft drop (hold) | ↓ | ▼ |
| Rotate | ↑ | ↻ |

## Tech stack

- [React 18](https://react.dev) with Hooks
- [TypeScript 5](https://www.typescriptlang.org) (strict mode)
- [styled-components 6](https://styled-components.com) with transient props
- [Vite 5](https://vitejs.dev) for dev server and production builds

## Getting started

```bash
npm install
npm run dev      # start dev server at localhost:5173
npm run build    # type-check + production build → docs/
npm run preview  # preview the production build locally
```

## Project structure

```
src/
├── components/
│   ├── Cell/           # Single board cell
│   ├── Display/        # Score / level / game-over label
│   ├── MobileControls/ # Touch D-pad (shown on pointer: coarse)
│   ├── Stage/          # 12×20 game grid
│   ├── StartButton/
│   └── Tetris/         # Root game component + keyboard handlers
├── helpers/
│   ├── gameHelpers.ts  # Stage creation, collision detection
│   └── tetrominos.ts   # Shape and colour definitions
├── hooks/
│   ├── useGameStatus.ts
│   ├── useInterval.ts
│   ├── usePlayer.ts
│   └── useStage.ts
└── types.ts            # Shared types (Cell, Stage, Player, …)
```
