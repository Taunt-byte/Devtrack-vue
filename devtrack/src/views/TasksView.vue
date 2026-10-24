<script setup>
import { computed, reactive, ref } from 'vue'
import { useSubjectsStore } from '../stores/subjects'
import { useTasksStore } from '../stores/tasks'
import AppIcon from '../components/AppIcon.vue'
import ModalDialog from '../components/ModalDialog.vue'
import EmptyState from '../components/EmptyState.vue'
import TaskItem from '../components/TaskItem.vue'

const subjects = useSubjectsStore()
const tasks = useTasksStore()

const statusFilter = ref('open')
const subjectFilter = ref('')
const search = ref('')

const tabs = [
  { key: 'open', label: 'Open' },
  { key: 'done', label: 'Done' },
  { key: 'all', label: 'All' }
]

const filtered = computed(() =>
  tasks.items.filter((t) => {
    if (statusFilter.value === 'open' && t.status === 'done') return false
    if (statusFilter.value === 'done' && t.status !== 'done') return false
    if (subjectFilter.value && t.subjectId !== subjectFilter.value) return false
    if (search.value && !t.title.toLowerCase().includes(search.value.toLowerCase())) return false
    return true
  })
)

const open = ref(false)
const editingId = ref(null)
const blank = () => ({ title: '', subjectId: '', priority: 'medium', status: 'todo', due: '', notes: '' })
const form = reactive(blank())

function openNew() {
  editingId.value = null
  Object.assign(form, blank(), { subjectId: subjectFilter.value })
  open.value = true
}

function openEdit(task) {
  editingId.value = task.id
  Object.assign(form, blank(), task, { subjectId: task.subjectId || '' })
  open.value = true
}

function submit() {
  if (!form.title.trim()) return
  const payload = {
    title: form.title.trim(),
    subjectId: form.subjectId || null,
    priority: form.priority,
    status: form.status,
    due: form.due,
    notes: form.notes
  }
  editingId.value ? tasks.update(editingId.value, payload) : tasks.add(payload)
  open.value = false
}

function remove(task) {
  if (confirm(`Delete "${task.title}"?`)) tasks.remove(task.id)
}
</script>

<template>
  <section>
    <header class="page-head">
      <div>
        <h1>Tasks</h1>
        <p>{{ tasks.pending.length }} open · {{ tasks.doneCount }} done</p>
      </div>
      <button class="btn primary" @click="openNew"><AppIcon name="plus" /> New task</button>
    </header>

    <div class="row wrap filters">
      <div class="tabs">
        <button v-for="t in tabs" :key="t.key" :class="{ active: statusFilter === t.key }" @click="statusFilter = t.key">{{ t.label }}</button>
      </div>
      <select v-model="subjectFilter" aria-label="Filter by subject" class="select">
        <option value="">All subjects</option>
        <option v-for="s in subjects.items" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>
      <input v-model="search" type="search" placeholder="Search tasks" class="search" aria-label="Search tasks" />
    </div>

    <EmptyState
      v-if="!filtered.length"
      :title="tasks.items.length ? 'No tasks match these filters' : 'No tasks yet'"
      :text="tasks.items.length ? 'Try another filter or clear the search.' : 'Break your studies into small tasks you can finish.'"
    >
      <button class="btn primary" @click="openNew">Add a task</button>
    </EmptyState>

    <div class="stack">
      <TaskItem v-for="t in filtered" :key="t.id" :task="t" @edit="openEdit" @remove="remove" />
    </div>

    <ModalDialog v-model="open" :title="editingId ? 'Edit task' : 'New task'">
      <form class="form-grid" @submit.prevent="submit">
        <label class="field full">Title<input v-model="form.title" required maxlength="120" placeholder="What do you need to do?" /></label>
        <label class="field">Subject
          <select v-model="form.subjectId">
            <option value="">No subject</option>
            <option v-for="s in subjects.items" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </label>
        <label class="field">Due date<input v-model="form.due" type="date" /></label>
        <label class="field">Priority
          <select v-model="form.priority">
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </label>
        <label class="field">Status
          <select v-model="form.status">
            <option value="todo">To do</option><option value="doing">In progress</option><option value="done">Done</option>
          </select>
        </label>
        <label class="field full">Notes<textarea v-model="form.notes" maxlength="400" placeholder="Links, chapters, ideas (optional)"></textarea></label>
        <div class="full row" style="justify-content: flex-end">
          <button type="button" class="btn" @click="open = false">Cancel</button>
          <button class="btn primary">{{ editingId ? 'Save changes' : 'Add task' }}</button>
        </div>
      </form>
    </ModalDialog>
  </section>
</template>

<style scoped>
.filters { margin-bottom: 18px; }
.select { width: auto; min-width: 160px; }
.search { width: 220px; max-width: 100%; }
</style>
