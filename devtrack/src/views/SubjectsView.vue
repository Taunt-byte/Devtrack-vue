<script setup>
import { reactive, ref } from 'vue'
import { useSubjectsStore } from '../stores/subjects'
import { useTasksStore } from '../stores/tasks'
import { useSessionsStore } from '../stores/sessions'
import { formatMinutes } from '../utils/date'
import AppIcon from '../components/AppIcon.vue'
import ModalDialog from '../components/ModalDialog.vue'
import EmptyState from '../components/EmptyState.vue'

const subjects = useSubjectsStore()
const tasks = useTasksStore()
const sessions = useSessionsStore()

const open = ref(false)
const editingId = ref(null)
const form = reactive({ name: '', color: '#8b5cf6', goalHours: 5 })

function openNew() {
  editingId.value = null
  Object.assign(form, { name: '', color: '#8b5cf6', goalHours: 5 })
  open.value = true
}

function openEdit(s) {
  editingId.value = s.id
  Object.assign(form, { name: s.name, color: s.color, goalHours: +(s.weeklyGoalMin / 60).toFixed(1) })
  open.value = true
}

function submit() {
  if (!form.name.trim()) return
  const payload = { name: form.name.trim(), color: form.color, weeklyGoalMin: Math.round(Number(form.goalHours) * 60) || 0 }
  editingId.value ? subjects.update(editingId.value, payload) : subjects.add(payload)
  open.value = false
}

function remove(s) {
  if (confirm(`Delete "${s.name}"? Its tasks and sessions will be kept without a subject.`)) subjects.remove(s.id)
}

const taskCount = (id) => tasks.items.filter((t) => t.subjectId === id && t.status !== 'done').length
</script>

<template>
  <section>
    <header class="page-head">
      <div>
        <h1>Subjects</h1>
        <p>Group your study by topic and set a weekly goal for each.</p>
      </div>
      <button class="btn primary" @click="openNew"><AppIcon name="plus" /> New subject</button>
    </header>

    <EmptyState v-if="!subjects.items.length" title="No subjects yet" text="Create one for each topic you are learning, like Vue, SQL or Algorithms.">
      <button class="btn primary" @click="openNew">Add a subject</button>
    </EmptyState>

    <div class="grid cols-2">
      <article v-for="s in subjects.items" :key="s.id" class="panel subject" :style="{ '--c': s.color }">
        <div class="row between">
          <h2 class="row"><span class="dot" :style="{ background: s.color }"></span>{{ s.name }}</h2>
          <div class="row">
            <button class="btn ghost icon" aria-label="Edit subject" @click="openEdit(s)"><AppIcon name="edit" /></button>
            <button class="btn ghost icon danger" aria-label="Delete subject" @click="remove(s)"><AppIcon name="trash" /></button>
          </div>
        </div>
        <div class="progress">
          <span :style="{ width: Math.min(100, s.weeklyGoalMin ? (sessions.weekMinutesFor(s.id) / s.weeklyGoalMin) * 100 : 0) + '%', background: s.color }"></span>
        </div>
        <p class="small muted">
          {{ formatMinutes(sessions.weekMinutesFor(s.id)) }} this week<template v-if="s.weeklyGoalMin"> of {{ formatMinutes(s.weeklyGoalMin) }}</template>
          · {{ formatMinutes(sessions.totalMinutesFor(s.id)) }} total · {{ taskCount(s.id) }} open task{{ taskCount(s.id) === 1 ? '' : 's' }}
        </p>
      </article>
    </div>

    <ModalDialog v-model="open" :title="editingId ? 'Edit subject' : 'New subject'">
      <form class="form-grid" @submit.prevent="submit">
        <label class="field full">Name<input v-model="form.name" required maxlength="40" placeholder="e.g. Vue 3" autofocus /></label>
        <label class="field">Color<input v-model="form.color" type="color" /></label>
        <label class="field">Weekly goal (hours)<input v-model.number="form.goalHours" type="number" min="0" step="0.5" /></label>
        <div class="full row" style="justify-content: flex-end">
          <button type="button" class="btn" @click="open = false">Cancel</button>
          <button class="btn primary">{{ editingId ? 'Save changes' : 'Add subject' }}</button>
        </div>
      </form>
    </ModalDialog>
  </section>
</template>

<style scoped>
.subject { display: flex; flex-direction: column; gap: 12px; border-top: 3px solid var(--c); }
.subject > .row:first-child { margin-bottom: 0 !important; }
</style>
