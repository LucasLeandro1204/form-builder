<script setup lang="ts">
import {ref, inject} from "vue";

const interactive = inject('interactive')

interface Component {
  id: number | string;
}

interface Props {
  componentProps: Component;
  rowIndex: number;
  columnIndex: number;
  componentIndex: number;
}

const props = withDefaults(defineProps<Props>(), {})

const rowNumber = ref((props.rowIndex + 1))
const columnNumber = ref((props.columnIndex + 1))
const componentNumber = ref((props.componentIndex + 1))
const component = ref(props.componentProps)

</script>

<template>
  <div class="draggable-component" draggable="true">
    <div v-if="!interactive" class="outset-block top-block"/>
    <div class="component-inset-block">
      <span>Component {{ componentNumber }}</span>
    </div>
    <div v-if="!interactive" class="outset-block bottom-block"/>
  </div>
</template>