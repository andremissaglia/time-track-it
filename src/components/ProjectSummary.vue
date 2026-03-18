<template>
  <div class="project-summary">
    <h3>Projects</h3>
    <div v-if="!projects.length" class="empty">No projects yet</div>
    <div
      v-for="p in projects"
      :key="p.name"
      class="project-row"
      :class="{ selected: selectedProject === p.name }"
      @click.stop="$emit('select-project', p.name)"
    >
      <span class="color-dot" :style="{ background: projectColor(projectColorIndex[p.name]) }"></span>
      <span class="project-name">{{ p.name }}</span>
      <span class="project-time">{{ formatDurationShort(p.totalMs) }}</span>
      <button class="edit-btn" @click.stop="$emit('edit-project', p.name)" title="Rename project">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button
        class="delete-btn"
        :class="{ confirming: confirmingProject === p.name }"
        @click.stop="onDelete(p.name)"
        :title="confirmingProject === p.name ? 'Click to confirm deletion' : 'Delete project'"
      >
        <svg v-if="confirmingProject !== p.name" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        <span v-else>Delete?</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { projectColor } from '../utils/colors.js'
import { formatDurationShort } from '../utils/time.js'

defineProps({
  projects: { type: Array, default: () => [] },
  selectedProject: { type: String, default: null },
  projectColorIndex: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['delete-project', 'select-project', 'edit-project'])

const confirmingProject = ref(null)
let confirmTimeout = null

function onDelete(name) {
  if (confirmingProject.value === name) {
    clearTimeout(confirmTimeout)
    confirmingProject.value = null
    emit('delete-project', name)
  } else {
    clearTimeout(confirmTimeout)
    confirmingProject.value = name
    confirmTimeout = setTimeout(() => {
      confirmingProject.value = null
    }, 3000)
  }
}

onUnmounted(() => clearTimeout(confirmTimeout))
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
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.1s;
}

.project-row:last-child {
  border-bottom: none;
}

.project-row:hover {
  background: #f8f8f8;
}

.project-row.selected .project-name,
.project-row.selected .project-time {
  font-weight: 700;
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

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ccc;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.edit-btn:hover {
  color: #555;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ccc;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-size: 11px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.delete-btn:hover {
  color: #e54545;
}

.delete-btn.confirming {
  background: #e54545;
  color: #fff;
  padding: 2px 6px;
}
</style>
