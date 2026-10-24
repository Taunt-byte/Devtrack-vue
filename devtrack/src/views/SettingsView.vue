<script setup>
import { reactive, ref } from 'vue'
import { useSubjectsStore } from '../stores/subjects'
import { useTasksStore } from '../stores/tasks'
import { useSessionsStore } from '../stores/sessions'
import { useTimerStore } from '../stores/timer'
import { exportData, importData, clearAllData } from '../utils/backup'
import { loadDemoData } from '../utils/demo'

const subjects = useSubjectsStore()
const tasks = useTasksStore()
const sessions = useSessionsStore()
const timer = useTimerStore()

const durations = reactive({ ...timer.durations })
const message = ref('')
const fileInput = ref(null)

function saveDurations() {
  const clamp = (v, fallback) => Math.min(180, Math.max(1, Math.round(Number(v)) || fallback))
  timer.updateDurations({
    focus: clamp(durations.focus, 25),
    short: clamp(durations.short, 5),
    long: clamp(durations.long, 15)
  })
  Object.assign(durations, timer.durations)
  message.value = 'Timer durations saved.'
}

async function onImport(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    await importData(file)
    location.reload()
  } catch (error) {
    message.value = `Import failed: ${error.message}`
  } finally {
    event.target.value = ''
  }
}

function demo() {
  loadDemoData({ subjects, tasks, sessions })
  message.value = 'Sample data added.'
}

function reset() {
  if (confirm('Delete all subjects, tasks and sessions? This cannot be undone.')) {
    clearAllData()
    location.reload()
  }
}
</script>

<template>
  <section>
    <header class="page-head">
      <div>
        <h1>Settings</h1>
        <p>Everything is stored in your browser. Nothing leaves your device.</p>
      </div>
    </header>

    <p v-if="message" class="toast message">{{ message }}</p>

    <div class="stack gap">
      <form class="panel form-grid" @submit.prevent="saveDurations">
        <h2 class="full">Timer durations (minutes)</h2>
        <label class="field">Focus<input v-model.number="durations.focus" type="number" min="1" max="180" /></label>
        <label class="field">Short break<input v-model.number="durations.short" type="number" min="1" max="180" /></label>
        <label class="field">Long break<input v-model.number="durations.long" type="number" min="1" max="180" /></label>
        <div class="row" style="align-items: flex-end"><button class="btn primary">Save durations</button></div>
      </form>

      <div class="panel">
        <h2>Backup</h2>
        <p class="muted small" style="margin: 6px 0 14px">Export your data as JSON to keep a copy or move it to another browser.</p>
        <div class="row wrap">
          <button class="btn" @click="exportData">Export backup</button>
          <button class="btn" @click="fileInput.click()">Import backup</button>
          <input ref="fileInput" type="file" accept="application/json" hidden @change="onImport" />
        </div>
      </div>

      <div class="panel">
        <h2>Data</h2>
        <p class="muted small" style="margin: 6px 0 14px">Add sample data to explore the app, or erase everything and start fresh.</p>
        <div class="row wrap">
          <button class="btn" @click="demo">Load sample data</button>
          <button class="btn danger" @click="reset">Delete all data</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gap { gap: 16px; }
.message { margin-bottom: 16px; }
</style>
