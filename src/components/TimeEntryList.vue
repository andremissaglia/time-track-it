<template>
  <div class="entry-list">
    <div v-if="!groupedEntries.length" class="empty-state">
      No time entries yet. Start tracking!
    </div>
    <div v-for="group in groupedEntries" :key="group.date" class="day-group">
      <div class="day-header">
        <span class="day-label">{{ formatDayLabel(group.date) }}</span>
        <span class="day-total">{{ dayTotal(group.entries) }}</span>
      </div>
      <TimeEntryItem
        v-for="entry in group.entries"
        :key="entry.id"
        :entry="entry"
        @delete="$emit('delete', $event)"
        @edit="$emit('edit', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import TimeEntryItem from './TimeEntryItem.vue'
import { formatDayLabel, formatDuration } from '../utils/time.js'

defineProps({
  groupedEntries: { type: Array, default: () => [] },
})

defineEmits(['delete', 'edit'])

function dayTotal(entries) {
  const total = entries.reduce((sum, e) => sum + (e.endTime - e.startTime), 0)
  return formatDuration(total)
}
</script>

<style scoped>
.entry-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.empty-state {
  padding: 48px 24px;
  text-align: center;
  color: #999;
  font-size: 15px;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #f8f8f8;
  border-bottom: 1px solid #eee;
}

.day-label {
  font-weight: 600;
  font-size: 13px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day-total {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: #888;
}
</style>
