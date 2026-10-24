<script setup>
import { computed } from 'vue'

const props = defineProps({ progress: { type: Number, default: 0 }, size: { type: Number, default: 280 }, stroke: { type: Number, default: 12 } })
const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value * (1 - Math.min(1, Math.max(0, props.progress))))
</script>

<template>
  <div class="ring" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <defs>
        <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#c4b5fd" />
          <stop offset="100%" stop-color="#7c3aed" />
        </linearGradient>
      </defs>
      <circle :cx="size / 2" :cy="size / 2" :r="radius" fill="none" stroke="#1d1835" :stroke-width="stroke" />
      <circle
        :cx="size / 2" :cy="size / 2" :r="radius" fill="none" stroke="url(#ringGradient)"
        :stroke-width="stroke" stroke-linecap="round"
        :stroke-dasharray="circumference" :stroke-dashoffset="offset"
        :transform="`rotate(-90 ${size / 2} ${size / 2})`" class="arc"
      />
    </svg>
    <div class="inner"><slot /></div>
  </div>
</template>

<style scoped>
.ring { position: relative; filter: drop-shadow(0 0 28px rgba(139, 92, 246, 0.35)); max-width: 100%; }
.ring svg { max-width: 100%; height: auto; }
.arc { transition: stroke-dashoffset 0.4s linear; }
.inner { position: absolute; inset: 0; display: grid; place-content: center; text-align: center; }
</style>
