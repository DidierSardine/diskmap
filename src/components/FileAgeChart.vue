<template>
  <Chart id="file-age-chart" :type="variant" :key="variant" :options="chartOptions" :data="chartData" />
</template>

<script>
import { Chart } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PieController, ArcElement } from 'chart.js'
import { cssVar, palette } from '../utils/colors.js'
import { translate as t } from '@nextcloud/l10n'
import { fetchFileAges } from '../services/api.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PieController, ArcElement)

export default {
  name: 'FileAgeChart',
  components: { Chart },
  data() {
    return {
      chartData: {
        labels: [t('diskmap', '≤ 1 yr'), t('diskmap', '1-3 yrs'), t('diskmap', '3-6 yrs'), t('diskmap', '6-10 yrs'), t('diskmap', '> 10 yrs')],
        datasets: [{
          label: t('diskmap', 'Files count'),
          data: [0, 0, 0, 0, 0],
          backgroundColor: cssVar('--color-primary-element'),
          borderColor: cssVar('--color-primary-hover'),
          borderWidth: 3,
          borderRadius: 8,
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
      }
    }
  },
  props: {
    scope: { type: String, required: true },
    identifier: { type: [String, Number], required: true },
    type: { type: String, required: true }, // Graph type: percentages-count; percentages-size; count; size
    variant: { type: String, default: 'bar'},
    metric: { type: String, default: 'count' },
    activeCategory: { type: String, default: null}
  },
  async mounted() {
    await this.reload()
  },
  watch: {
    activeCategory() {
      this.reload()
    },
  },
  methods: {
    async reload() {
      try {
        const dataset = await this.getDataset()
        this.chartData = this.prepareChartData(dataset)
        this.chartOptions = this.prepareChartOptions()
      } catch (e) {
        console.error('[diskmap] file-ages load failed', e)
      }
    },
    async getDataset() {
      const data = await fetchFileAges(this.scope, this.identifier, this.activeCategory)
      const sum = data.buckets.reduce((a, b) => a + b, 0)
      const sumSizes = data.sizes.reduce((a, b) => a + b, 0)
      const percentages = sum ? data.buckets.map(e => e / sum * 100) : data.buckets.map(() => 0)
      const percentagesSizes = sumSizes ? data.sizes.map(e => e / sumSizes * 100) : data.sizes.map(() => 0)
      if (this.type === 'percentages-count') {
        return percentages
      } else if (this.type === 'percentages-size') {
        return percentagesSizes
      } else if (this.type === 'count') {
        return data.buckets
      } else {
        return data.sizes.map(e => e / 1024 / 1024 ) // MB
      }
    },
    prepareChartData(dataset) {
      if (this.type.includes('percentages')) {
        return {
          labels: [t('diskmap', '≤ 1 yr'), t('diskmap', '1-3 yrs'), t('diskmap', '3-6 yrs'), t('diskmap', '6-10 yrs'), t('diskmap', '> 10 yrs')],
          datasets: [{
            label: t('diskmap', 'Files percentages'),
            data: dataset,
            backgroundColor: palette(cssVar('--color-primary-element'), 5, 'lighter').reverse(),
          }]
        }
      } else {
        return {
          labels: [t('diskmap', '≤ 1 yr'), t('diskmap', '1-3 yrs'), t('diskmap', '3-6 yrs'), t('diskmap', '6-10 yrs'), t('diskmap', '> 10 yrs')],
          datasets: [{
            label: this.type === 'count' ? t('diskmap', 'Files count') : t('diskmap', 'Files size'),
            data: dataset,
            backgroundColor: cssVar('--color-primary-element'),
            borderColor: cssVar('--color-primary-hover'),
            borderWidth: 3,
            borderRadius: 8,
          }]
        }
      }
    },

    prepareChartOptions() {
      if (this.type === 'count') {
        return {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
        }
      } else if (this.type === 'size') {
        return {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            tooltip: {
              callbacks: {
                label: (ttItem) => `${ttItem.label}: ${parseFloat(ttItem.parsed.x.toFixed(2))} MB`
              }
            }
          }
        }
      } else if (this.type.includes('percentages')) {
        return {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (ttItem) => `${ttItem.label}: ${parseFloat(ttItem.parsed.toFixed(2))}%`
              }
            }
          }
        }
      }
    }
  }
}
</script>