import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: 'Dashboard' } },
  { path: '/subjects', name: 'subjects', component: () => import('../views/SubjectsView.vue'), meta: { title: 'Subjects' } },
  { path: '/tasks', name: 'tasks', component: () => import('../views/TasksView.vue'), meta: { title: 'Tasks' } },
  { path: '/timer', name: 'timer', component: () => import('../views/TimerView.vue'), meta: { title: 'Focus timer' } },
  { path: '/sessions', name: 'sessions', component: () => import('../views/SessionsView.vue'), meta: { title: 'Sessions' } },
  { path: '/settings', name: 'settings', component: () => import('../views/SettingsView.vue'), meta: { title: 'Settings' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  // Hash history keeps routing working on static hosts such as GitHub Pages
  history: createWebHashHistory(),
  routes
})

router.afterEach((to) => {
  document.title = `${to.meta.title} · DevTrack`
})

export default router
