# AGENTS.md

A repository with seven React lab projects (labs 1–5, 7 and 8): `lab-1/`
(environment setup and a profile card), `lab-2/` (components, props and the
team page), `lab-3/` (component-tree refactoring and the coffee menu page),
`lab-4/` (state, effects and the filterable coffee menu), `lab-5/` (form
events, controlled and uncontrolled components), `lab-7/` (custom hooks,
container/presentational components and render props) and `lab-8/` (compound
components, context, accessible tabs and HOCs). Each lab is a separate Vite
app on React 19 and Vite 8, in JavaScript with JSX. No TypeScript yet.
User-facing text is in Ukrainian. Node.js 24 LTS, npm 11.

## Scope

- Work only in the lab directory named in the task (`lab-1/`, `lab-2/`,
  `lab-3/`, `lab-4/`, `lab-5/`, `lab-7/` or `lab-8/`). Don't change the
  other lab or root configuration files unless the task is about them.
- If a task touches root files, change only the files it names and list the
  other root files in the report.

## Commands

Install dependencies once at the repository root:

- `npm install`: install dependencies for all labs (npm workspaces)

Run the rest inside the lab directory (`cd lab-1`, `cd lab-2`, `cd lab-3`,
`cd lab-4`, `cd lab-5`, `cd lab-7` or `cd lab-8`):

- `npm run dev`: dev server at http://localhost:5173
- `npm run lint`: ESLint
- `npm run format`: format all files with Prettier
- `npm run format:check`: check formatting without changing files
- `npm run build`: production build into `dist/`

A task is done only when `npm run lint`, `npm run format:check` and
`npm run build` pass in the lab you changed. Run all three and report their
results.

## Project structure

- `lab-1/index.html`: the page Vite serves; the app mounts into `<div id="root">`
- `lab-1/src/main.jsx`: entry point; renders `<App />` inside `<StrictMode>`
- `lab-1/src/App.jsx`: root component with the profile card
- `lab-2/index.html`: the page Vite serves for lab 2
- `lab-2/src/main.jsx`: entry point for lab 2
- `lab-2/src/App.jsx`: root component of the team page
- `lab-2/src/data.js`: the `team` array
- `lab-3/src/App.jsx`: root component of the coffee menu page
- `lab-3/src/data.js`: the `menu` array of categories and items
- `lab-3/src/components/`: `SearchBar`, `MenuTable`, `MenuCategory` and
  `MenuItemRow`
- `lab-4/src/App.jsx`: root component that renders the header,
  `FilterableMenuTable` and `CafeInfo`
- `lab-4/src/filterMenu.js`: the pure `filterMenu` function
- `lab-4/src/components/`: the lab 3 components plus `CafeInfo` and
  `FilterableMenuTable`
- `lab-5/src/App.jsx`: root component of the booking page
- `lab-5/src/describeBooking.js`: builds the confirmation text
- `lab-5/src/components/`: `BookingForm` and `GuestsStepper`
- `lab-7/src/App.jsx`: root component of the coffee beans page
- `lab-7/src/hooks/`: `useLocalStorage`, `useCountdown` and `useShowMore`
- `lab-7/src/components/`: page components plus `TimerView` and `ShowMore`
- `lab-7/tests/`: the provided Vitest and React Testing Library tests
- `lab-8/src/App.jsx`: root component with the product card and tabs
- `lab-8/src/components/Tabs.jsx`: the compound `Tabs` component
- `lab-8/src/hoc/withAnalytics.jsx`: the `withAnalytics` higher-order component
- `lab-8/tests/`: the provided Vitest and React Testing Library tests
- `lab-*/src/components/`: one component per file, named in PascalCase
  (`ProfileCard.jsx`, `Header.jsx`, `Avatar.jsx`)
- `lab-*/public/`: static files, copied to the build as is

## React rules

- Function components and hooks only. No class components.
- Use current React 19 APIs: `createRoot`, not `ReactDOM.render`. No
  `propTypes`, and no `defaultProps` on function components (use default
  parameter values instead).
- Follow the Rules of Hooks: call hooks only at the top level of a component
  or a custom hook, never in a condition, a loop or after an early return.
- Keep rendering pure. Compute values from props and state during render
  instead of copying them into state with `useEffect`.
- Give list items a stable `key` from the data, never the array index.
- Read props with destructuring in the function parameter.
- Use semantic HTML: `<button>` for actions, `<a href>` for navigation, a
  `<label>` for every form field, `alt` on every `<img>`.
- Don't use `dangerouslySetInnerHTML`.

## Dependencies and configuration

- Don't add, remove or upgrade npm packages without asking first, and say why
  a package is needed.
- Don't run `npm audit fix --force`.
- Don't change `eslint.config.js`, `.prettierrc.json`, `vite.config.js` or
  the scripts in `package.json` unless the task is about them.
- Never turn off ESLint rules or add `eslint-disable` comments. Fix the
  cause.

## How to work

- Before editing, read the relevant files and list the files you will change.
- Keep each change small and limited to the task.
- After editing, summarise what changed and show the check results.
- Never put secrets (API keys, tokens, passwords) in the code. Every
  `VITE_*` variable ends up in the public bundle.
