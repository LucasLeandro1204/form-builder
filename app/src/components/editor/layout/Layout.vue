<script setup>
import EditorTemplateLayout from "@/components/editor/layout/EditorTemplateLayout.vue";

const props = defineProps({
  actorRef: {required: true, type: Object}
})
</script>

<template>
  <div class="editor-template-layout editor-layout-control">
    <div class="editor-template-layout-inset-block">
      <EditorTemplateLayout :actor-ref="actorRef"/>
    </div>
  </div>
</template>

<style lang="scss">
@import "./src/scss/abstracts";
</style>