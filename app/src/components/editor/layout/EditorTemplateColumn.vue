<script setup lang="ts">
import {inject, ref} from "vue";

const props = defineProps<{
  rowIndex: number;
  columnIndex: number;
}>();

</script>

<template>
  <div class="draggable-column" draggable="true">
    <div class="column-inset-block">
      <slot/>
    </div>
  </div>
</template>