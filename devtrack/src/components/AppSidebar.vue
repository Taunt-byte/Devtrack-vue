<script setup>
import AppIcon from './AppIcon.vue'
import { useSessionsStore } from '../stores/sessions'

const sessions = useSessionsStore()

const links = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/subjects', label: 'Subjects', icon: 'subjects' },
  { to: '/tasks', label: 'Tasks', icon: 'tasks' },
  { to: '/timer', label: 'Focus timer', icon: 'timer' },
  { to: '/sessions', label: 'Sessions', icon: 'sessions' },
  { to: '/settings', label: 'Settings', icon: 'settings' }
]
</script>

<template>
  <aside class="sidebar">
    <RouterLink to="/" class="brand">
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#1d1835" />
        <path d="M18 20l14 24 14-24" fill="none" stroke="#a78bfa" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>DevTrack</span>
    </RouterLink>

    <nav>
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
        <AppIcon :name="link.icon" />
        <span>{{ link.label }}</span>
      </RouterLink>
    </nav>

    <div class="streak" v-if="sessions.streak > 0">
      <AppIcon name="flame" :size="20" />
      <div>
        <strong>{{ sessions.streak }}-day streak</strong>
        <p class="small muted">Study today to keep it going.</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky; top: 0; height: 100vh;
  display: flex; flex-direction: column; gap: 28px;
  padding: 24px 16px; border-right: 1px solid var(--border);
  background: rgba(12, 10, 22, 0.6); backdrop-filter: blur(8px);
}
.brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 700; font-size: 1.2rem; padding: 0 8px; }
nav { display: flex; flex-direction: column; gap: 4px; }
.nav-link {
  display: flex; align-items: center; gap: 12px; padding: 10px 12px;
  border-radius: var(--radius-sm); color: var(--muted); transition: background 0.15s, color 0.15s;
}
.nav-link:hover { color: var(--text); background: var(--panel); }
.nav-link.router-link-exact-active { color: #fff; background: var(--primary-soft); box-shadow: inset 3px 0 0 var(--primary); }
.streak { margin-top: auto; display: flex; gap: 10px; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--warning); }
.streak strong { color: var(--text); font-weight: 600; }

@media (max-width: 860px) {
  .sidebar {
    position: fixed; top: auto; bottom: 0; left: 0; right: 0; z-index: 20;
    height: auto; flex-direction: row; padding: 8px; gap: 0;
    border-right: 0; border-top: 1px solid var(--border); background: rgba(12, 10, 22, 0.92);
  }
  .brand, .streak { display: none; }
  nav { flex-direction: row; width: 100%; justify-content: space-around; }
  .nav-link { flex-direction: column; gap: 2px; font-size: 0.68rem; padding: 6px 8px; box-shadow: none !important; }
}
</style>
