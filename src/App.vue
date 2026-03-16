<template>
  <div class="app">
    <header class="header">
      <h1 class="logo">Time Track It</h1>
      <ImportExport @export="exportData" @import="onImport" />
    </header>

    <TimerBar
      :isRunning="timer.isRunning.value"
      :elapsed="timer.elapsed.value"
      :modelDescription="timer.description.value"
      :modelProject="timer.project.value"
      :filterProjects="projectData.filterProjects"
      @start="onStart"
      @stop="onStop"
      @update:description="onDescUpdate"
      @update:project="onProjectUpdate"
    />

    <div class="main-layout">
      <TimeEntryList
        :groupedEntries="entryData.groupedEntries.value"
        @delete="entryData.deleteEntry"
        @edit="openEdit"
      />
      <ProjectSummary :projects="projectData.projects.value" />
    </div>

    <TimeEntryEditModal
      v-if="editingEntry"
      :entry="editingEntry"
      @close="editingEntry = null"
      @save="onSaveEdit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TimerBar from './components/TimerBar.vue'
import TimeEntryList from './components/TimeEntryList.vue'
import TimeEntryEditModal from './components/TimeEntryEditModal.vue'
import ProjectSummary from './components/ProjectSummary.vue'
import ImportExport from './components/ImportExport.vue'
import { useTimer } from './composables/useTimer.js'
import { useTimeEntries } from './composables/useTimeEntries.js'
import { useProjects } from './composables/useProjects.js'

const entryData = useTimeEntries()
const timer = useTimer(() => entryData.loadEntries())
const projectData = useProjects(entryData.entries)

const editingEntry = ref(null)

onMounted(() => entryData.loadEntries())

function onStart() {
  timer.start()
}

function onStop() {
  timer.stop()
}

function onDescUpdate(val) {
  timer.description.value = val
  timer.updateActiveTimer()
}

function onProjectUpdate(val) {
  timer.project.value = val
  timer.updateActiveTimer()
}

function openEdit(entry) {
  editingEntry.value = { ...entry }
}

async function onSaveEdit({ id, ...changes }) {
  await entryData.updateEntry(id, changes)
  editingEntry.value = null
}

const { exportData } = entryData

async function onImport(jsonStr) {
  try {
    await entryData.importData(jsonStr)
  } catch (e) {
    console.error('Import failed:', e)
  }
}
</script>

<style scoped>
.app {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: #e44991;
  margin: 0;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
}
</style>
