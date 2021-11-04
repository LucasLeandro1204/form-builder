<script setup lang="ts">
const props = defineProps<{
  rowIndex: number
}>();
</script>

<template>
  <div class="draggable-row" draggable="true">
    <div class="row-inset-block">
      <slot/>
    </div>
  </div>
</template>

<style lang="scss">
@import "src/scss/abstracts";

</style>