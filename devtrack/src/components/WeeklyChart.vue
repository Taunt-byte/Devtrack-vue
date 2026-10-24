<script setup>
import { computed } from 'vue'
import { formatMinutes } from '../utils/date'

const props = defineProps({ days: { type: Array, required: true } })
const max = computed(() => Math.max(60, ...props.days.map((d) => d.minutes)))
</script>

<template>
  <div class="chart" role="img" aria-label="Minutes studied in the last 7 days">
    <div v-for="day in days" :key="day.date" class="col" :title="`${day.label}: ${formatMinutes(day.minutes)}`">
      <span class="amount">{{ day.minutes ? Math.round(day.minutes) : '' }}</span>
      <div class="track">
        <div class="bar" :class="{ today: day.isToday }" :style="{ height: (day.minutes / max) * 100 + '%' }"></div>
      </div>
      <span class="day" :class="{ today: day.isToday }">{{ day.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.chart { display: flex; gap: 12px; height: 190px; align-items: stretch; }
.col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; }
.track { flex: 1; width: 100%; display: flex; align-items: flex-end; background: var(--bg); border-radius: 8px; overflow: hidden; }
.bar { width: 100%; min-height: 0; background: linear-gradient(180deg, #a78bfa, #6d28d9); border-radius: 8px 8px 0 0; transition: height 0.5s ease; }
.bar.today { background: linear-gradient(180deg, #e9d5ff, #8b5cf6); box-shadow: 0 0 18px rgba(167, 139, 250, 0.45); }
.amount { font-size: 0.72rem; color: var(--muted); height: 1em; }
.day { font-size: 0.8rem; color: var(--muted); }
.day.today { color: var(--accent); font-weight: 600; }
</style>
