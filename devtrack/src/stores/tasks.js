import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { load, save } from '../utils/storage'
import { uid } from '../utils/id'
import { toDateStr } from '../utils/date'

const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 }

export const useTasksStore = defineStore('tasks', () => {
  const items = ref(load('tasks', []))
  watch(items, (value) => save('tasks', value), { deep: true })

  function add({ title, subjectId = null, priority = 'medium', status = 'todo', due = '', notes = '' }) {
    const task = {
      id: uid(),
      title: title.trim(),
      subjectId,
      priority,
      status,
      due,
      notes: notes.trim(),
      createdAt: Date.now(),
      completedAt: status === 'done' ? Date.now() : null
    }
    items.value.unshift(task)
    return task
  }

  function update(id, patch) {
    const task = items.value.find((t) => t.id === id)
    if (!task) return
    Object.assign(task, patch)
    task.completedAt = task.status === 'done' ? task.completedAt || Date.now() : null
  }

  function setStatus(id, status) {
    update(id, { status })
  }

  function remove(id) {
    items.value = items.value.filter((t) => t.id !== id)
  }

  function detachSubject(subjectId) {
    items.value.forEach((t) => {
      if (t.subjectId === subjectId) t.subjectId = null
    })
  }

  const pending = computed(() => items.value.filter((t) => t.status !== 'done'))
  const doneCount = computed(() => items.value.filter((t) => t.status === 'done').length)
  const isOverdue = (t) => t.status !== 'done' && !!t.due && t.due < toDateStr()
  const overdueCount = computed(() => items.value.filter(isOverdue).length)

  const upcoming = computed(() =>
    [...pending.value]
      .sort((a, b) => {
        if (a.due && b.due && a.due !== b.due) return a.due.localeCompare(b.due)
        if (a.due && !b.due) return -1
        if (!a.due && b.due) return 1
        return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
      })
      .slice(0, 5)
  )

  return { items, add, update, setStatus, remove, detachSubject, pending, doneCount, overdueCount, upcoming, isOverdue }
})
