<script setup>
import { inject, onMounted, ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const selectedTitle = inject('selectedTitle')
const tabTitles = inject('tabTitles')

onMounted(() => {
  tabTitles.value.push(props.title)
  if (!selectedTitle.value) {
    selectedTitle.value = props.title
  }
})
</script>

<template>
  <div v-show="title === selectedTitle" class="tab-content">
    <slot />
  </div>
</template>

<style scoped>
.tab-content {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
}
</style>