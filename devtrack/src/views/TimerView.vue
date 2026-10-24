<script setup>
import { useSubjectsStore } from '../stores/subjects'
import { useTimerStore } from '../stores/timer'
import { useSessionsStore } from '../stores/sessions'
import { formatClock, formatMinutes } from '../utils/date'
import ProgressRing from '../components/ProgressRing.vue'

const subjects = useSubjectsStore()
const timer = useTimerStore()
const sessions = useSessionsStore()

const modes = [
  { key: 'focus', label: 'Focus' },
  { key: 'short', label: 'Short break' },
  { key: 'long', label: 'Long break' }
]

</script>

<template>
  <section>
    <header class="page-head">
      <div>
        <h1>Focus timer</h1>
        <p>Studied today: {{ formatMinutes(sessions.todayMinutes) }}</p>
      </div>
      <div class="tabs">
        <button v-for="m in modes" :key="m.key" :class="{ active: timer.mode === m.key }" @click="timer.setMode(m.key)">{{ m.label }}</button>
      </div>
    </header>

    <div class="stage">
      <ProgressRing :progress="timer.progress">
        <span class="clock">{{ formatClock(timer.remaining) }}</span>
        <span class="muted">{{ modes.find((m) => m.key === timer.mode).label }}</span>
      </ProgressRing>

      <div class="controls">
        <label class="field" v-if="timer.mode === 'focus'">
          Subject
          <select v-model="timer.subjectId" :disabled="timer.running">
            <option :value="null">No subject</option>
            <option v-for="s in subjects.items" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </label>

        <div class="row wrap" style="justify-content: center">
          <button v-if="!timer.running" class="btn primary big" @click="timer.start()">
            {{ timer.remaining < timer.total ? 'Resume' : 'Start' }}
          </button>
          <button v-else class="btn big" @click="timer.pause()">Pause</button>
          <button class="btn big" @click="timer.stopAndLog()" :disabled="timer.remaining === timer.total">
            {{ timer.mode === 'focus' ? 'Stop and save' : 'Reset' }}
          </button>
        </div>

        <p v-if="timer.lastEvent" class="toast">{{ timer.lastEvent }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stage { display: flex; flex-direction: column; align-items: center; gap: 32px; padding-top: 12px; }
.clock { font-family: var(--font-display); font-size: clamp(3rem, 14vw, 4.6rem); font-weight: 600; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.controls { display: flex; flex-direction: column; gap: 16px; width: min(360px, 100%); }
.big { padding: 12px 26px; font-size: 1rem; }
</style>
