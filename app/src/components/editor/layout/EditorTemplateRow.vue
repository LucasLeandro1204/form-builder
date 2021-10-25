<script setup lang="ts">
import {inject, ref} from "vue";

const interactive = inject('interactive');

interface Props {
  rowIndex: number
}

const props = defineProps<Props>();

const rowNumber = ref((props.rowIndex + 1))

</script>

<template>
  <div class="draggable-row" draggable="true">
    <span>Row {{ rowNumber }}</span>
    <div v-if="!interactive" class="outset-block top-block"/>
    <div class="row-inset-block">
      <slot/>
    </div>
    <div v-if="!interactive" class="outset-block bottom-block"/>
  </div>
</template>

<style lang="scss">
@import "src/scss/abstracts";

</style>