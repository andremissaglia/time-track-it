<template>
  <div class="autocomplete" v-if="show && suggestions.length">
    <button
      v-for="name in suggestions"
      :key="name"
      class="autocomplete-item"
      @mousedown.prevent="$emit('select', name)"
    >
      <span class="color-dot" :style="{ background: projectColor(name) }"></span>
      {{ name }}
    </button>
  </div>
</template>

<script setup>
import { projectColor } from '../utils/colors.js'

defineProps({
  suggestions: { type: Array, default: () => [] },
  show: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<style scoped>
.autocomplete {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.autocomplete-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
}

.autocomplete-item:hover {
  background: #f5f5f5;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
