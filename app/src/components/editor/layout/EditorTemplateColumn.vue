<script setup lang="ts">
import {inject, ref} from "vue";

const props = defineProps<{
  rowIndex: number;
  columnIndex: number;
}>();

const rowIndex = ref(props.rowIndex)
const columnIndex = ref(props.columnIndex)

const interactive = inject('interactive')

</script>

<template>
  <div class="draggable-column" draggable="true">
    <div v-if="!interactive" class="outset-block right-block"/>
    <div class="column-inset-block">
      <slot/>
    </div>
    <div v-if="!interactive" class="outset-block left-block"/>
  </div>
</template>