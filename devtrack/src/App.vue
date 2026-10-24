<script setup>
import AppSidebar from './components/AppSidebar.vue'
</script>

<template>
  <div class="app">
    <AppSidebar />
    <main class="main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
