<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({ modelValue: Boolean, title: String })
const emit = defineEmits(['update:modelValue'])

const close = () => emit('update:modelValue', false)
const onKey = (e) => e.key === 'Escape' && props.modelValue && close()

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="backdrop" @mousedown.self="close">
        <div class="dialog" role="dialog" aria-modal="true" :aria-label="title">
          <div class="row between head">
            <h2>{{ title }}</h2>
            <button class="btn ghost icon" aria-label="Close" @click="close">✕</button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 16px; background: rgba(5, 3, 12, 0.7); backdrop-filter: blur(3px); }
.dialog { width: min(520px, 100%); max-height: 90vh; overflow: auto; background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6); }
.head { margin-bottom: 18px; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.18s ease; }
.modal-enter-active .dialog, .modal-leave-active .dialog { transition: transform 0.18s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .dialog, .modal-leave-to .dialog { transform: translateY(10px) scale(0.98); }
</style>
