<template>
  <div class="project-summary">
    <h3>Projects</h3>
    <div v-if="!projects.length" class="empty">No projects yet</div>
    <div v-for="p in projects" :key="p.name" class="project-row">
      <span class="color-dot" :style="{ background: projectColor(p.name) }"></span>
      <span class="project-name">{{ p.name }}</span>
      <span class="project-time">{{ formatDurationShort(p.totalMs) }}</span>
    </div>
  </div>
</template>

<script setup>
import { projectColor } from '../utils/colors.js'
import { formatDurationShort } from '../utils/time.js'

defineProps({
  projects: { type: Array, default: () => [] },
})
</script>

<style scoped>
.project-summary {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.project-summary h3 {
  margin: 0 0 16px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #555;
}

.empty {
  color: #999;
  font-size: 14px;
}

.project-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.project-row:last-child {
  border-bottom: none;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.project-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.project-time {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: #888;
}
</style>
