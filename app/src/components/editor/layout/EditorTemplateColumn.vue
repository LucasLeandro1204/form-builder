<script setup lang="ts">
import {inject, ref} from "vue";

const props = defineProps<{}>();

const dragstart = () => {
  console.log('PICK_UP')
}

const dragend = () => {
  console.log('DROP')
}


</script>

<template>
  <div
       class="draggable-column"
       draggable="true">
    <div class="column-inset-block">
      <slot/>
    </div>
  </div>
</template>