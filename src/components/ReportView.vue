<template>
  <div class="report-view">
    <div class="report-controls">
      <label for="granularity" class="control-label">Group by</label>
      <select id="granularity" v-model="granularity" class="period-select">
        <option value="days">Days</option>
        <option value="weeks">Weeks</option>
        <option value="months">Months</option>
      </select>
    </div>

    <div v-if="reportData.periods.length === 0" class="empty">
      No completed entries to report on.
    </div>

    <template v-else>
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <div class="table-wrapper">
        <table class="time-table">
          <thead>
            <tr>
              <th class="project-col">Project</th>
              <th v-for="(label, i) in reportData.periodLabels" :key="i" class="period-col">{{ label }}</th>
              <th class="total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in reportData.projects" :key="project">
              <td class="project-col">
                <span class="dot" :style="{ background: projectColor(projectColorIndex[project]) }"></span>
                {{ project }}
              </td>
              <td v-for="period in reportData.periods" :key="period" class="period-col">
                {{ formatCell(reportData.matrix[project]?.[period]) }}
              </td>
              <td class="total-col">{{ formatCell(reportData.projectTotals[project]) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td class="project-col">Total</td>
              <td v-for="period in reportData.periods" :key="period" class="period-col">
                {{ formatCell(reportData.periodTotals[period]) }}
              </td>
              <td class="total-col">{{ formatCell(reportData.grandTotal) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { projectColor } from '../utils/colors.js'
import { useReports } from '../composables/useReports.js'
import { formatDurationShort } from '../utils/time.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  entries: { type: Object, required: true },
  projectColorIndex: { type: Object, default: () => ({}) },
})

const granularity = ref('days')
const { reportData } = useReports(props.entries, granularity)

const chartCanvas = ref(null)
let chartInstance = null

function formatCell(ms) {
  if (!ms) return '—'
  return formatDurationShort(ms)
}

function buildChartData() {
  const { periods, periodLabels, projects, matrix } = reportData.value
  const datasets = projects.map(project => ({
    label: project,
    data: periods.map(p => {
      const ms = matrix[project]?.[p] || 0
      return Math.round((ms / 3600000) * 100) / 100
    }),
    backgroundColor: projectColor(props.projectColorIndex[project]),
  }))
  return { labels: periodLabels, datasets }
}

function renderChart() {
  if (!chartCanvas.value) return
  const data = buildChartData()
  if (chartInstance) {
    chartInstance.data.labels = data.labels
    chartInstance.data.datasets = data.datasets
    chartInstance.update()
    return
  }
  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          ticks: { color: '#555' },
          grid: { color: '#f0f0f0' },
        },
        y: {
          stacked: true,
          ticks: { color: '#555', callback: v => `${v}h` },
          grid: { color: '#f0f0f0' },
          title: { display: true, text: 'Hours', color: '#888' },
        },
      },
      plugins: {
        legend: { labels: { color: '#333', boxWidth: 12 } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}h`,
          },
        },
      },
    },
  })
}

onMounted(() => nextTick(() => renderChart()))

onUnmounted(() => {
  chartInstance?.destroy()
  chartInstance = null
})

watch(reportData, async () => {
  await nextTick()
  renderChart()
})
</script>

<style scoped>
.report-view {
  padding: 0;
}

.report-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.control-label {
  font-size: 14px;
  color: #888;
}

.period-select {
  background: #fff;
  border: 1px solid #ddd;
  color: #333;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.period-select:focus {
  outline: none;
  border-color: #e44991;
}

.empty {
  color: #999;
  font-size: 14px;
  text-align: center;
  padding: 60px 0;
}

.chart-container {
  height: 300px;
  margin-bottom: 32px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.time-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  white-space: nowrap;
}

.time-table th,
.time-table td {
  padding: 10px 14px;
  text-align: right;
  border-bottom: 1px solid #f0f0f0;
}

.time-table th {
  background: #fafafa;
  color: #888;
  font-weight: 500;
  font-size: 12px;
}

.time-table td {
  color: #333;
  background: #fff;
}

.project-col {
  text-align: left !important;
  min-width: 140px;
}

.period-col {
  min-width: 80px;
}

.total-col {
  font-weight: 600;
  color: #333 !important;
  background: #fafafa !important;
  min-width: 80px;
}

.time-table tbody tr:hover td {
  background: #fafafa;
}

.total-row td {
  background: #fafafa !important;
  color: #333 !important;
  font-weight: 600;
  border-top: 1px solid #e8e8e8;
  border-bottom: none;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  flex-shrink: 0;
}
</style>
