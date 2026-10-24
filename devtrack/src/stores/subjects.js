import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { load, save } from '../utils/storage'
import { uid } from '../utils/id'
import { useTasksStore } from './tasks'
import { useSessionsStore } from './sessions'

export const useSubjectsStore = defineStore('subjects', () => {
  const items = ref(load('subjects', []))
  watch(items, (value) => save('subjects', value), { deep: true })

  function add({ name, color = '#8b5cf6', weeklyGoalMin = 0 }) {
    const subject = {
      id: uid(),
      name: name.trim(),
      color,
      weeklyGoalMin: Number(weeklyGoalMin) || 0,
      createdAt: Date.now()
    }
    items.value.push(subject)
    return subject
  }

  function update(id, patch) {
    const subject = items.value.find((s) => s.id === id)
    if (!subject) return
    Object.assign(subject, patch, { weeklyGoalMin: Number(patch.weeklyGoalMin) || 0 })
  }

  function remove(id) {
    items.value = items.value.filter((s) => s.id !== id)
    useTasksStore().detachSubject(id)
    useSessionsStore().detachSubject(id)
  }

  const byId = (id) => items.value.find((s) => s.id === id) || null

  return { items, add, update, remove, byId }
})
