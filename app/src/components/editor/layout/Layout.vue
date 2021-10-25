<script setup>
import EditorTemplateLayout from "@/components/editor/layout/EditorTemplateLayout.vue";
import {computed, provide, ref} from "vue";

const props = defineProps({
  actorRef: {required: true, type: Object}
})

const interactive = ref(false)

provide('interactive', computed(() => interactive.value))

</script>

<template>
  <div class="editor-template-layout">
    <div class="editor-template-layout-inset-block">
      <EditorTemplateLayout :actor-ref="actorRef"/>
    </div>
  </div>
</template>

<style lang="scss">

</style>