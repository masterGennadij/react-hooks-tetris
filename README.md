# React Hooks Tetris

Classic Tetris built with React 18, TypeScript 5, and Vite. Runs in the browser with full keyboard support, on-screen touch controls for mobile, and automatic game-state persistence.

**[Play now on GitHub Pages](https://mastergennadij.github.io/react-hooks-tetris/)**

## Features

- 7 tetromino types (I, J, L, O, S, T, Z) with randomised spawning
- Level progression — speed increases every 10 cleared rows
- Scoring: 40 / 100 / 300 / 1200 points for 1–4 simultaneous lines, scaled by level
- **Pause / resume** — press P or Escape (or the ⏸ button on mobile)
- **Game persistence** — closing or refreshing the tab saves the current board, score, and level to `localStorage`; on return the player is offered Continue or New Game
- Responsive layout — board and stats adapt to any screen size
- Mobile D-pad controls with hold-to-repeat for movement and soft-drop

## Controls

| Action | Keyboard | Mobile |
|---|---|---|
| Move left / right | ← → | ◀ ▶ |
| Soft drop (hold) | ↓ | ▼ |
| Rotate | ↑ | ↻ |
| Pause / unpause | P or Escape | ⏸ |

## Tech stack

- [React 18](https://react.dev) with Hooks
- [TypeScript 5](https://www.typescriptlang.org) (strict mode)
- [Vite 5](https://vitejs.dev) for dev server and production builds
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) for unit tests
- CSS Modules with CSS custom properties for dynamic cell colours

## Getting started

```bash
npm install
npm run dev           # start dev server at localhost:5173
npm run build         # type-check + production build → docs/
npm run preview       # preview the production build locally
npm test              # run unit tests (single pass)
npm run test:watch    # run tests in watch mode
npm run test:coverage # generate coverage report
```

## Project structure

```
src/
├── components/
│   ├── Cell/           # Single board cell
│   ├── Display/        # Score / level / status label
│   ├── MobileControls/ # Touch D-pad (shown on pointer: coarse)
│   ├── Stage/          # 12×20 game grid
│   ├── StartButton/    # Primary action button
│   └── Tetris/         # Root game component, keyboard handlers, save/restore
├── helpers/
│   ├── gameHelpers.ts  # Board creation, collision detection
│   ├── storage.ts      # localStorage save / load / clear helpers
│   └── tetrominos.ts   # Shape and colour definitions
├── hooks/
│   ├── useGameStatus.ts
│   ├── useInterval.ts
│   ├── usePlayer.ts
│   └── useStage.ts
└── types.ts            # Shared types (Cell, Board, Player, …)
```
