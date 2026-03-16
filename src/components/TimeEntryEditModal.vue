<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h3>Edit Time Entry</h3>
      <div class="field">
        <label>Description</label>
        <input v-model="desc" type="text" />
      </div>
      <div class="field">
        <label>Start Time</label>
        <input v-model="start" type="datetime-local" />
      </div>
      <div class="field">
        <label>End Time</label>
        <input v-model="end" type="datetime-local" />
      </div>
      <div class="actions">
        <button class="cancel-btn" @click="$emit('close')">Cancel</button>
        <button class="save-btn" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ entry: Object })
const emit = defineEmits(['close', 'save'])

function toLocalISO(ts) {
  const d = new Date(ts)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

const desc = ref(props.entry.description)
const start = ref(toLocalISO(props.entry.startTime))
const end = ref(toLocalISO(props.entry.endTime))

function extractProject(text) {
  const match = text.match(/#(\w+)/)
  return match ? match[1] : ''
}

function save() {
  emit('save', {
    id: props.entry.id,
    description: desc.value,
    project: extractProject(desc.value),
    startTime: new Date(start.value).getTime(),
    endTime: new Date(end.value).getTime(),
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin: 0 0 20px;
  font-size: 18px;
  color: #333;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
}

.field input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.field input:focus {
  border-color: #e44991;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.cancel-btn,
.save-btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.cancel-btn {
  background: #eee;
  color: #555;
}

.save-btn {
  background: #e44991;
  color: #fff;
}
</style>
