<script setup>
import { computed } from 'vue'
import { useSubjectsStore } from '../stores/subjects'
import { useTasksStore } from '../stores/tasks'
import { useSessionsStore } from '../stores/sessions'
import { formatMinutes, formatDate } from '../utils/date'
import { loadDemoData } from '../utils/demo'
import StatCard from '../components/StatCard.vue'
import WeeklyChart from '../components/WeeklyChart.vue'
import EmptyState from '../components/EmptyState.vue'

const subjects = useSubjectsStore()
const tasks = useTasksStore()
const sessions = useSessionsStore()

const isEmpty = computed(() => !subjects.items.length && !tasks.items.length && !sessions.items.length)

const goals = computed(() =>
  subjects.items.map((s) => {
    const done = sessions.weekMinutesFor(s.id)
    const pct = s.weeklyGoalMin ? Math.min(100, Math.round((done / s.weeklyGoalMin) * 100)) : 0
    return { ...s, done, pct }
  })
)

const demo = () => loadDemoData({ subjects, tasks, sessions })
</script>

<template>
  <section>
    <header class="page-head">
      <div>
        <h1>Dashboard</h1>
        <p>Your study progress at a glance.</p>
      </div>
      <RouterLink to="/timer" class="btn primary">Start focusing</RouterLink>
    </header>

    <EmptyState
      v-if="isEmpty"
      title="Nothing tracked yet"
      text="Add your first subject, or fill DevTrack with sample data to explore."
    >
      <RouterLink to="/subjects" class="btn primary">Add a subject</RouterLink>
      <button class="btn" @click="demo">Load sample data</button>
    </EmptyState>

    <template v-else>
      <div class="grid cols-4 stats">
        <StatCard label="Studied today" :value="formatMinutes(sessions.todayMinutes)" />
        <StatCard label="Last 7 days" :value="formatMinutes(sessions.weekMinutes)" />
        <StatCard label="Current streak" :value="`${sessions.streak} day${sessions.streak === 1 ? '' : 's'}`" />
        <StatCard
          label="Open tasks"
          :value="tasks.pending.length"
          :hint="tasks.overdueCount ? `${tasks.overdueCount} overdue` : 'None overdue'"
        />
      </div>

      <div class="panel">
        <div class="row between"><h2>Last 7 days</h2><span class="muted small">Minutes per day</span></div>
        <WeeklyChart :days="sessions.last7Days" />
      </div>

      <div class="grid cols-2">
        <div class="panel">
          <div class="row between"><h2>Weekly goals</h2><RouterLink to="/subjects" class="muted small">Manage</RouterLink></div>
          <p v-if="!goals.length" class="muted">No subjects yet.</p>
          <div class="stack">
            <div v-for="g in goals" :key="g.id">
              <div class="row between small">
                <span class="row"><span class="dot" :style="{ background: g.color }"></span>{{ g.name }}</span>
                <span class="muted">
                  {{ formatMinutes(g.done) }}<template v-if="g.weeklyGoalMin"> / {{ formatMinutes(g.weeklyGoalMin) }}</template>
                </span>
              </div>
              <div class="progress"><span :style="{ width: g.pct + '%', background: g.color }"></span></div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="row between"><h2>Up next</h2><RouterLink to="/tasks" class="muted small">All tasks</RouterLink></div>
          <p v-if="!tasks.upcoming.length" class="muted">All caught up. Add a task to plan your next step.</p>
          <div class="stack">
            <div v-for="t in tasks.upcoming" :key="t.id" class="row between">
              <span class="row">
                <span class="dot" :style="{ background: subjects.byId(t.subjectId)?.color || '#4b4570' }"></span>{{ t.title }}
              </span>
              <span class="pill" :class="{ overdue: tasks.isOverdue(t) }" v-if="t.due">{{ formatDate(t.due) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
section > * + * { margin-top: 16px; }
.stats { margin-bottom: 8px; padding: 6px 0 14px; }
</style>
