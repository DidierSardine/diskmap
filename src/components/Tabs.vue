<script setup>
import { provide, ref } from 'vue'

const selectedTitle = ref('')
const tabTitles = ref([])

provide('selectedTitle', selectedTitle)
provide('tabTitles', tabTitles)
</script>

<template>
  <div class="tabs">
    <ul class="tabs__header">
      <li 
        v-for="title in tabTitles" 
        :key="title"
        :class="{ active: title === selectedTitle }"
        @click="selectedTitle = title">
        {{ title }}
      </li>
    </ul>
    <slot />
  </div>
</template>

<style scoped>
.tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.tabs__header {
    flex-shrink: 0;
    display: flex;
}

.tabs__header li {
    margin-left: 2px;
    margin-right: 2px;
    padding: 5px 10px;
    border: 1px solid color-mix(in srgb, var(--color-border), #777777); /* color-mix because color-border and primary element light are too close */
    border-radius: 5px;
    background-color: var(--color-primary-element-light);
    cursor: pointer;
}

.tabs__header li:hover {
    background-color: var(--color-primary-element-light-hover);
    border: 1px solid var(--color-primary-element);
}

.tabs__header li.active {
    background-color: var(--color-primary-element);
    color: var(--color-primary-element-text);
}
</style>