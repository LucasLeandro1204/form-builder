<script setup>
import EditorTemplateLayout from "@/components/editor/layout/EditorTemplateLayout.vue";
import {computed, onMounted, provide, ref} from "vue";

const props = defineProps({
  actorRef: {required: true, type: Object}
})

const interactive = ref(true)

provide('interactive', computed(() => interactive.value))

onMounted(() => {

})
</script>

<template>
  <div class="editor-template-layout">
    <div class="editor-template-layout-inset-block"
         :class="{'interactive-on': interactive}">
      <EditorTemplateLayout :actor-ref="actorRef"/>
    </div>
  </div>
</template>

<style lang="scss">

.editor-template-layout-inset-block {
  &.interactive-on {
    .draggable-row {
      .draggable-column {
        .draggable-component {
          background: #21a67a;
        }
      }
    }
  }
}
</style>