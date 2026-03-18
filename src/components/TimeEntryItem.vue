<template>
  <div class="entry-item">
    <div class="entry-info">
      <span
        v-if="entry.project"
        class="project-tag"
        :style="{ background: projectColor(entry.project) }"
      >
        {{ entry.project }}
      </span>
      <span class="entry-desc">{{ displayDescription }}</span>
    </div>
    <div class="entry-meta">
      <span class="entry-time">{{ formatTime(entry.startTime) }} - {{ formatTime(entry.endTime) }}</span>
      <span class="entry-duration">{{ formatDuration(entry.endTime - entry.startTime) }}</span>
      <button class="play-btn" @click="$emit('replay', entry)" title="Resume">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
      </button>
      <button class="edit-btn" @click="$emit('edit', entry)" title="Edit">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
      <button
        class="delete-btn"
        :class="{ confirming }"
        @click="onDelete"
      >
        {{ confirming ? 'Confirm?' : 'Delete' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { projectColor } from '../utils/colors.js'
import { formatDuration, formatTime } from '../utils/time.js'

const props = defineProps({
  entry: Object,
})

const emit = defineEmits(['delete', 'edit', 'replay'])

const confirming = ref(false)
let confirmTimeout = null

const displayDescription = computed(() => {
  return (props.entry.description || '').replace(/#\w+/g, '').trim() || 'No description'
})

function onDelete() {
  if (confirming.value) {
    clearTimeout(confirmTimeout)
    confirming.value = false
    emit('delete', props.entry.id)
  } else {
    confirming.value = true
    confirmTimeout = setTimeout(() => {
      confirming.value = false
    }, 3000)
  }
}

onUnmounted(() => clearTimeout(confirmTimeout))
</script>

<style scoped>
.entry-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;
}

.entry-item:hover {
  background: #fafafa;
}

.entry-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.project-tag {
  font-size: 12px;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  white-space: nowrap;
}

.entry-desc {
  color: #333;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.entry-time {
  color: #999;
  font-size: 13px;
}

.entry-duration {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 14px;
  color: #555;
  min-width: 70px;
  text-align: right;
}

.play-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #aaa;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.play-btn:hover {
  color: #e44991;
  background: #fde8f3;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #aaa;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.edit-btn:hover {
  color: #555;
  background: #eee;
}

.delete-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: #999;
  transition: all 0.2s;
}

.delete-btn:hover {
  border-color: #e54545;
  color: #e54545;
}

.delete-btn.confirming {
  background: #e54545;
  color: #fff;
  border-color: #e54545;
}
</style>
