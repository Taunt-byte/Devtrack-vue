<script setup>
import { reactive } from 'vue'
import { useSubjectsStore } from '../stores/subjects'
import { useSessionsStore } from '../stores/sessions'
import { formatDate, formatMinutes, toDateStr } from '../utils/date'
import AppIcon from '../components/AppIcon.vue'
import EmptyState from '../components/EmptyState.vue'

const subjects = useSubjectsStore()
const sessions = useSessionsStore()

const form = reactive({ subjectId: '', minutes: 30, date: toDateStr(), note: '' })

function submit() {
  const saved = sessions.add({
    subjectId: form.subjectId || null,
    minutes: form.minutes,
    date: form.date || toDateStr(),
    note: form.note
  })
  if (saved) Object.assign(form, { minutes: 30, note: '' })
}
</script>

<template>
  <section>
    <header class="page-head">
      <div>
        <h1>Sessions</h1>
        <p>{{ formatMinutes(sessions.totalMinutes) }} studied in total.</p>
      </div>
    </header>

    <form class="panel form-grid log" @submit.prevent="submit">
      <h2 class="full">Log a session</h2>
      <label class="field">Subject
        <select v-model="form.subjectId">
          <option value="">No subject</option>
          <option v-for="s in subjects.items" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </label>
      <label class="field">Minutes<input v-model.number="form.minutes" type="number" min="1" max="720" required /></label>
      <label class="field">Date<input v-model="form.date" type="date" :max="toDateStr()" required /></label>
      <label class="field">Note<input v-model="form.note" maxlength="120" placeholder="What did you study? (optional)" /></label>
      <div class="full row" style="justify-content: flex-end"><button class="btn primary">Save session</button></div>
    </form>

    <h2 class="history-title">History</h2>
    <EmptyState v-if="!sessions.items.length" title="No sessions yet" text="Use the focus timer or log your first session above." />

    <div class="stack">
      <div v-for="s in sessions.sorted" :key="s.id" class="list-item">
        <span class="dot" :style="{ background: subjects.byId(s.subjectId)?.color || '#4b4570' }"></span>
        <div style="flex: 1; min-width: 0">
          <p>{{ subjects.byId(s.subjectId)?.name || 'No subject' }} <span class="muted">· {{ formatMinutes(s.minutes) }}</span></p>
          <p class="small muted" v-if="s.note">{{ s.note }}</p>
        </div>
        <span class="small muted">{{ formatDate(s.date) }}</span>
        <button class="btn ghost icon danger" aria-label="Delete session" @click="sessions.remove(s.id)"><AppIcon name="trash" /></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.log { margin-bottom: 28px; }
.history-title { margin-bottom: 12px; }
</style>
