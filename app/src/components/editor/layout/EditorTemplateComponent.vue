<script setup lang="ts">
import {ref, inject, computed} from "vue";

const interactive = inject('interactive')

interface Component {
  id: number | string;
  placeholder: boolean;
}

interface Props {
  rowIndex: number;
  columnIndex: number;
  componentIndex: number;
  componentProps: Component;
}

const props = withDefaults(defineProps<Props>(), {})

const rowNumber = ref((props.rowIndex + 1))
const columnNumber = ref((props.columnIndex + 1))
const componentNumber = ref((props.componentIndex + 1))
const component = ref(props.componentProps)

const placeholderItem = props.componentProps.placeholder

</script>

<template>
  <div class="draggable-component" draggable="true">
    <div v-if="!interactive" class="outset-block top-block"/>
    <div class="component-inset-block">
      <span>{{component.as}}</span>
    </div>
    <div v-if="!interactive" class="outset-block bottom-block"/>
  </div>
</template>

<style lang="scss">
@import "src/scss/abstracts";

.placeholder-item {
  background: brown;
}

</style>