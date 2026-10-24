# DevTrack

A dark, purple-themed study manager for developers. Organize subjects, plan tasks, run focus sessions and keep a streak going. Everything is stored in your browser with `localStorage`, so there is no backend and no account.

![Vue 3](https://img.shields.io/badge/Vue-3-8b5cf6?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-7c3aed?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2-a78bfa)
![License](https://img.shields.io/badge/license-MIT-c4b5fd)

## Features

- **Dashboard** with today's time, a 7-day chart, current streak, weekly goals and upcoming tasks.
- **Subjects** with custom colors and weekly study goals.
- **Tasks** with priority, status (to do, in progress, done), due dates, notes, filters and search.
- **Focus timer** (Pomodoro) with adjustable durations. Finished focus sessions are saved automatically, and you can stop early and keep the minutes already studied.
- **Sessions** history with manual logging.
- **Backup** tools: export and import JSON, load sample data, or erase everything.
- **Persistence** through `localStorage`, with no server required.
- Responsive layout (sidebar on desktop, bottom navigation on mobile) and reduced-motion support.

## Tech stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Pinia](https://pinia.vuejs.org/) for state management
- [Vue Router 4](https://router.vuejs.org/) (hash mode, ready for GitHub Pages)
- [Vite](https://vitejs.dev/)
- Plain CSS with custom properties

## Getting started

### Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- npm (included with Node.js)

### Run locally

```bash
git clone https://github.com/Taunt-byte/Devtrack-vue.git
cd devtrack
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Run in VS Code

1. Open the project folder with **File > Open Folder**.
2. Install the recommended extension **Vue - Official** (VS Code will suggest it).
3. Open the integrated terminal with `` Ctrl+` `` and run `npm install`, then `npm run dev`.
4. `Ctrl+Click` the local URL to open the app in your browser.

### Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serves the production build locally
```

## Deploy to GitHub Pages

The project uses a relative `base` and hash routing, so the `dist/` folder works on any static host.

1. Run `npm run build`.
2. Publish the `dist/` folder, for example with the `gh-pages` branch or a GitHub Actions workflow that uploads `dist/` as a Pages artifact.

## Project structure

```
devtrack/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.js
    ├── App.vue
    ├── router/index.js
    ├── stores/
    │   ├── subjects.js
    │   ├── tasks.js
    │   ├── sessions.js
    │   └── timer.js
    ├── utils/
    │   ├── storage.js      # localStorage helpers
    │   ├── backup.js       # export / import / reset
    │   ├── demo.js         # sample data
    │   ├── date.js
    │   └── id.js
    ├── components/
    │   ├── AppSidebar.vue
    │   ├── AppIcon.vue
    │   ├── ModalDialog.vue
    │   ├── EmptyState.vue
    │   ├── StatCard.vue
    │   ├── WeeklyChart.vue
    │   ├── ProgressRing.vue
    │   └── TaskItem.vue
    ├── views/
    │   ├── DashboardView.vue
    │   ├── SubjectsView.vue
    │   ├── TasksView.vue
    │   ├── TimerView.vue
    │   ├── SessionsView.vue
    │   └── SettingsView.vue
    └── styles/main.css
```

## How data is stored

Each store keeps its state in a reactive `ref` and writes it to `localStorage` whenever it changes (`watch` with `deep: true`). Keys are prefixed with `devtrack:`:

| Key                       | Content                    |
| ------------------------- | -------------------------- |
| `devtrack:subjects`       | List of subjects           |
| `devtrack:tasks`          | List of tasks              |
| `devtrack:sessions`       | List of study sessions     |
| `devtrack:timer-settings` | Pomodoro durations         |

Data is tied to the browser and origin. Use **Settings > Export backup** to move it elsewhere.

## Roadmap ideas

- Recurring tasks and tags
- Monthly heatmap of study activity
- Light theme toggle
- PWA support for offline use
- Unit tests with Vitest

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss larger changes.

## License

Released under the [MIT License](LICENSE).
