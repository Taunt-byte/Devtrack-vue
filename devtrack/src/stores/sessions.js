import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { load, save } from '../utils/storage'
import { uid } from '../utils/id'
import { addDays, toDateStr } from '../utils/date'

export const useSessionsStore = defineStore('sessions', () => {
  const items = ref(load('sessions', []))
  watch(items, (value) => save('sessions', value), { deep: true })

  function add({ subjectId = null, minutes, date = toDateStr(), note = '' }) {
    const mins = Math.round(Number(minutes))
    if (!mins || mins < 1) return null
    const session = { id: uid(), subjectId, minutes: mins, date, note: note.trim(), createdAt: Date.now() }
    items.value.unshift(session)
    return session
  }

  function remove(id) {
    items.value = items.value.filter((s) => s.id !== id)
  }

  function detachSubject(subjectId) {
    items.value.forEach((s) => {
      if (s.subjectId === subjectId) s.subjectId = null
    })
  }

  const sorted = computed(() =>
    [...items.value].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
  )

  const minutesByDate = computed(() => {
    const map = {}
    items.value.forEach((s) => (map[s.date] = (map[s.date] || 0) + s.minutes))
    return map
  })

  const todayMinutes = computed(() => minutesByDate.value[toDateStr()] || 0)
  const totalMinutes = computed(() => items.value.reduce((sum, s) => sum + s.minutes, 0))

  const last7Days = computed(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = addDays(new Date(), -i)
      const date = toDateStr(d)
      days.push({
        date,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: minutesByDate.value[date] || 0,
        isToday: i === 0
      })
    }
    return days
  })

  const weekMinutes = computed(() => last7Days.value.reduce((sum, d) => sum + d.minutes, 0))

  const streak = computed(() => {
    let day = new Date()
    if (!minutesByDate.value[toDateStr(day)]) day = addDays(day, -1)
    let count = 0
    while (minutesByDate.value[toDateStr(day)] > 0) {
      count++
      day = addDays(day, -1)
    }
    return count
  })

  function weekMinutesFor(subjectId) {
    const cutoff = toDateStr(addDays(new Date(), -6))
    return items.value
      .filter((s) => s.subjectId === subjectId && s.date >= cutoff)
      .reduce((sum, s) => sum + s.minutes, 0)
  }

  function totalMinutesFor(subjectId) {
    return items.value.filter((s) => s.subjectId === subjectId).reduce((sum, s) => sum + s.minutes, 0)
  }

  return {
    items, add, remove, detachSubject, sorted, todayMinutes, totalMinutes,
    last7Days, weekMinutes, streak, weekMinutesFor, totalMinutesFor
  }
})
