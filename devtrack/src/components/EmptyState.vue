<script setup>
defineProps({ title: String, text: String })
</script>

<template>
  <div class="empty">
    <h3>{{ title }}</h3>
    <p class="muted">{{ text }}</p>
    <div class="actions"><slot /></div>
  </div>
</template>

<style scoped>
.empty { text-align: center; padding: 40px 20px; border: 1px dashed var(--border); border-radius: var(--radius); }
.empty h3 { font-size: 1.05rem; margin-bottom: 6px; }
.actions { margin-top: 16px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
</style>
