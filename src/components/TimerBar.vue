<template>
  <div class="timer-bar">
    <div class="input-wrapper">
      <input
        ref="inputEl"
        v-model="description"
        @input="onInput"
        @blur="showAutocomplete = false"
        @keydown.enter="toggle"
        placeholder="What are you working on? Use #project"
        class="timer-input"
      />
      <ProjectAutocomplete
        :suggestions="suggestions"
        :show="showAutocomplete"
        @select="onSelectProject"
      />
    </div>
    <div class="timer-display" :class="{ running: isRunning }">
      {{ formatDuration(elapsed) }}
    </div>
    <button
      class="timer-btn"
      :class="isRunning ? 'stop' : 'start'"
      @click="toggle"
    >
      {{ isRunning ? 'Stop' : 'Start' }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ProjectAutocomplete from './ProjectAutocomplete.vue'
import { formatDuration } from '../utils/time.js'

const props = defineProps({
  isRunning: Boolean,
  elapsed: Number,
  modelDescription: String,
  modelProject: String,
  filterProjects: Function,
})

const emit = defineEmits(['start', 'stop', 'update:description', 'update:project'])

const inputEl = ref(null)
const showAutocomplete = ref(false)
const suggestions = ref([])
const hashtagQuery = ref('')

const description = ref(props.modelDescription || '')
const project = ref(props.modelProject || '')

watch(() => props.modelDescription, (v) => { description.value = v })
watch(() => props.modelProject, (v) => { project.value = v })

function extractProject(text) {
  const match = text.match(/#(\w+)/)
  return match ? match[1] : ''
}

function onInput() {
  const val = description.value
  project.value = extractProject(val)
  emit('update:description', val)
  emit('update:project', project.value)

  // Check for active hashtag typing
  const cursorPos = inputEl.value?.selectionStart || val.length
  const before = val.slice(0, cursorPos)
  const hashMatch = before.match(/#(\w*)$/)
  if (hashMatch && props.filterProjects) {
    hashtagQuery.value = hashMatch[1]
    suggestions.value = props.filterProjects(hashMatch[1])
    showAutocomplete.value = suggestions.value.length > 0
  } else {
    showAutocomplete.value = false
  }
}

function onSelectProject(name) {
  const val = description.value
  const cursorPos = inputEl.value?.selectionStart || val.length
  const before = val.slice(0, cursorPos)
  const after = val.slice(cursorPos)
  const replaced = before.replace(/#\w*$/, `#${name}`)
  description.value = replaced + after
  project.value = name
  showAutocomplete.value = false
  emit('update:description', description.value)
  emit('update:project', name)
  inputEl.value?.focus()
}

function toggle() {
  if (props.isRunning) {
    emit('stop')
  } else {
    emit('start')
  }
}
</script>

<style scoped>
.timer-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.timer-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 8px 0;
  background: transparent;
  color: #333;
}

.timer-input::placeholder {
  color: #aaa;
}

.timer-display {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 20px;
  color: #999;
  min-width: 100px;
  text-align: center;
}

.timer-display.running {
  color: #e44991;
}

.timer-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: opacity 0.2s;
}

.timer-btn:hover {
  opacity: 0.85;
}

.timer-btn.start {
  background: #4bc96b;
  color: #fff;
}

.timer-btn.stop {
  background: #e54545;
  color: #fff;
}
</style>
