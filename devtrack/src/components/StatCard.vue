<script setup>
defineProps({ label: String, value: [String, Number], hint: String })
</script>

<template>
  <div class="stat">
    <span class="label">{{ label }}</span>
    <strong class="value">{{ value }}</strong>
    <span class="hint" v-if="hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.stat { padding: 4px 0 4px 16px; border-left: 3px solid var(--primary); display: flex; flex-direction: column; }
.label { color: var(--muted); font-size: 0.85rem; }
.value { font-family: var(--font-display); font-size: 1.7rem; font-weight: 600; line-height: 1.3; }
.hint { color: var(--muted); font-size: 0.8rem; }
</style>
