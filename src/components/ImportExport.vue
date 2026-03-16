<template>
  <div class="import-export">
    <button class="btn export-btn" @click="$emit('export')">Export JSON</button>
    <label class="btn import-btn">
      Import JSON
      <input type="file" accept=".json" @change="onFileChange" hidden />
    </label>
  </div>
</template>

<script setup>
const emit = defineEmits(['export', 'import'])

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => emit('import', reader.result)
  reader.readAsText(file)
  e.target.value = ''
}
</script>

<style scoped>
.import-export {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #ddd;
  background: #fff;
  color: #555;
  transition: all 0.2s;
}

.btn:hover {
  border-color: #bbb;
  background: #f8f8f8;
}

.import-btn {
  display: inline-flex;
  align-items: center;
}
</style>
