<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
});
const iconName = computed(() => `#icon-${props.name}`);
const svgClass = computed(() => {
  if (props.name) return `svg-icon icon-${props.name}`;
  return 'svg-icon';
});
</script>

<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{ color: color }">
    <!-- use 元素在 SVG 文档内取得目标节点，并在别的地方复制它们 -->
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<style scoped>
.svg-icon {
  width: 70px;
  height: 70px;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
