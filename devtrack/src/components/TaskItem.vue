<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import { useSubjectsStore } from '../stores/subjects'
import { useTasksStore } from '../stores/tasks'
import { formatDate } from '../utils/date'

const props = defineProps({ task: { type: Object, required: true } })
defineEmits(['edit', 'remove'])

const subjects = useSubjectsStore()
const tasks = useTasksStore()
const subject = computed(() => subjects.byId(props.task.subjectId))
const overdue = computed(() => tasks.isOverdue(props.task))
const done = computed(() => props.task.status === 'done')

const toggle = () => tasks.setStatus(props.task.id, done.value ? 'todo' : 'done')
</script>

<template>
  <div class="list-item task" :class="{ done }">
    <button class="check" :class="{ on: done }" :aria-label="done ? 'Mark as to do' : 'Mark as done'" @click="toggle">
      <AppIcon v-if="done" name="check" :size="14" />
    </button>

    <div class="body">
      <p class="title">{{ task.title }}</p>
      <div class="row wrap meta">
        <span v-if="subject" class="pill" :style="{ color: subject.color }">
          <span class="dot" :style="{ background: subject.color }"></span>{{ subject.name }}
        </span>
        <span class="pill" :class="task.priority">{{ task.priority }}</span>
        <span v-if="task.status === 'doing'" class="pill">In progress</span>
        <span v-if="task.due" class="pill" :class="{ overdue }">{{ overdue ? 'Overdue · ' : 'Due ' }}{{ formatDate(task.due) }}</span>
      </div>
      <p v-if="task.notes" class="small muted notes">{{ task.notes }}</p>
    </div>

    <div class="row">
      <button class="btn ghost icon" aria-label="Edit task" @click="$emit('edit', task)"><AppIcon name="edit" /></button>
      <button class="btn ghost icon danger" aria-label="Delete task" @click="$emit('remove', task)"><AppIcon name="trash" /></button>
    </div>
  </div>
</template>

<style scoped>
.task { align-items: flex-start; }
.body { flex: 1; min-width: 0; }
.title { font-weight: 500; overflow-wrap: anywhere; }
.done .title { text-decoration: line-through; color: var(--muted); }
.meta { margin-top: 6px; }
.notes { margin-top: 6px; }
.check { width: 22px; height: 22px; margin-top: 1px; flex: none; display: grid; place-items: center; border-radius: 7px; border: 2px solid var(--border); background: transparent; color: #fff; cursor: pointer; transition: border-color 0.15s, background 0.15s; }
.check:hover { border-color: var(--primary); }
.check.on { background: var(--primary-strong); border-color: var(--primary-strong); }
</style>
