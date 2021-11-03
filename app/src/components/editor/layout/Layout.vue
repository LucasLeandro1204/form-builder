<script setup>
import EditorTemplateLayout from "@/components/editor/layout/EditorTemplateLayout.vue";
import {computed, onMounted, provide, ref} from "vue";

const props = defineProps({
  actorRef: {required: true, type: Object}
})

const interactive = ref(true)

provide('interactive', computed(() => interactive.value))
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
@import "./src/scss/abstracts";

:root {
  --placeholder-border-color: #fc5454;
  --placeholder-background-color: rgba(var(--placeholder-border-color), 0.40);
}

.editor-template-layout-inset-block {
  &.interactive-on {
    .draggable-row {
      .draggable-column {
        .draggable-component {

          .component-inset-block {
            background: aliceblue;
            border-radius: rem-calc(8);
          }

          &.pseudo-component {
            background: var(--placeholder-background-color);

            &::before {
              content: 'Drop here to add section';
              display: flex;
              inset: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              align-items: center;
              justify-content: center;
            }

            &::after {
              content: '';
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              @include dashed-border(var(--placeholder-border-color))
            }
          }
        }
      }
    }
  }
}
</style>