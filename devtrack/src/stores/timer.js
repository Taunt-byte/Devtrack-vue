import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { load, save } from '../utils/storage'
import { useSessionsStore } from './sessions'

const DEFAULTS = { focus: 25, short: 5, long: 15 }

export const useTimerStore = defineStore('timer', () => {
  const durations = ref({ ...DEFAULTS, ...load('timer-settings', {}) })
  watch(durations, (value) => save('timer-settings', value), { deep: true })

  const mode = ref('focus') // 'focus' | 'short' | 'long'
  const subjectId = ref(null)
  const remaining = ref(durations.value.focus * 60)
  const running = ref(false)
  const lastEvent = ref('')

  let endAt = 0
  let handle = null

  const total = computed(() => durations.value[mode.value] * 60)
  const progress = computed(() => (total.value ? 1 - remaining.value / total.value : 0))

  function tick() {
    remaining.value = Math.max(0, Math.ceil((endAt - Date.now()) / 1000))
    if (remaining.value === 0) finish()
  }

  function start() {
    if (running.value) return
    lastEvent.value = ''
    endAt = Date.now() + remaining.value * 1000
    running.value = true
    handle = setInterval(tick, 250)
  }

  function pause() {
    clearInterval(handle)
    handle = null
    running.value = false
  }

  function setMode(next) {
    pause()
    mode.value = next
    remaining.value = durations.value[next] * 60
  }

  function reset() {
    pause()
    remaining.value = total.value
  }

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 660
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8)
      osc.connect(gain).connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.8)
    } catch {
      /* audio is optional */
    }
  }

  function finish() {
    pause()
    beep()
    if (mode.value === 'focus') {
      useSessionsStore().add({ subjectId: subjectId.value, minutes: durations.value.focus, note: 'Focus timer' })
      lastEvent.value = `Focus session saved: ${durations.value.focus} min.`
      setMode('short')
    } else {
      lastEvent.value = 'Break finished. Ready for the next focus session?'
      setMode('focus')
    }
  }

  // Stop a focus session early and keep the minutes already studied
  function stopAndLog() {
    if (mode.value !== 'focus') return reset()
    const elapsedMin = Math.floor((total.value - remaining.value) / 60)
    pause()
    if (elapsedMin >= 1) {
      useSessionsStore().add({ subjectId: subjectId.value, minutes: elapsedMin, note: 'Focus timer (stopped early)' })
      lastEvent.value = `Saved ${elapsedMin} min of focus.`
    }
    remaining.value = total.value
  }

  function updateDurations(next) {
    durations.value = { ...durations.value, ...next }
    if (!running.value) remaining.value = durations.value[mode.value] * 60
  }

  return { durations, mode, subjectId, remaining, running, lastEvent, total, progress, start, pause, reset, setMode, stopAndLog, updateDurations }
})
