<template>
	<div class="file-age-chart-dropdown">
		<NcSelect v-model="selected" :options="options" :input-label="inputLabel"
			:clearable="false" :searchable="false" />
	</div>
</template>

<script>
import { translate as t } from '@nextcloud/l10n'
import NcSelect from '@nextcloud/vue/components/NcSelect'

export default {
	name: 'FileAgeChartDropdown',

	components: { NcSelect },

	props: {
		modelValue: {
			type: String,
			default: 'count',
		},
	},

	emits: ['update:modelValue'],

	computed: {
		inputLabel() {
			return t('diskmap', 'Data')
		},
		options() {
			return [
				{ label: t('diskmap', 'Files count'), value: 'count' },
				{ label: t('diskmap', 'Files size'), value: 'size' },
			]
		},
		selected: {
			get() {
				return this.options.find((o) => o.value === this.modelValue) ?? this.options[0]
			},
			set(option) {
				this.$emit('update:modelValue', option.value)
			},
		},
	},
}
</script>

<style scoped>
.file-age-chart-dropdown {
	display: flex;
	flex-direction: column;
	gap: 2px 0;
}
</style>
