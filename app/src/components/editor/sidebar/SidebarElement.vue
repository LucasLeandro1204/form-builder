<script setup>
import {onMounted, ref, watch} from "vue"
import {nanoid} from "nanoid"
import {useActor} from "@xstate/vue";
import {addDataAttributes} from "@/mixins";

const props = defineProps({
  element: {
    type: Object,
    required: true,
    ref: {}
  },
})

const uuid = nanoid(3)
const {state, send} = useActor(props.element.ref)
const current = ref(state.value)

onMounted(() => {
  const draggableElement = document.getElementById(`draggable-${uuid}`)

  watch(state, (currentState) => {
    if (currentState.changed) {
      current.value = currentState.value
      addDataAttributes([draggableElement], currentState.value)
    }
  })

  draggableElement.addEventListener("pointerdown", (event) => send(event))
  draggableElement.addEventListener("pointerup", (event) => send(event))
})
</script>

<template>
  <a class="editor-sidebar-element-option block-outset"
     :id="`draggable-${uuid}`"
     :class="element.text"
     :data-type="element.text.toLowerCase()">
    <img :src="element.icon"
         class="editor-element-icon"
         :class="element.text.toLowerCase()"
         alt=""/>
    <span class="option-text">{{ element.text }}</span>
  </a>
</template>

<style lang="scss" scoped>
@import "./src/scss/abstracts/index";


.editor-sidebar-element .editor-sidebar-element-option {
  --draggingX: 0;
  --draggingY: 0;
  transform: translate(calc(var(--draggingX) * 1px), calc(var(--draggingY) * 1px));
  transition: transform 0.25s cubic-bezier(0.7, 0, 0.3, 1);
  cursor: grab;
  z-index: 199;

  .editor-element-icon {
    $size: rem-calc(20);
    width: $size;
    height: $size;
  }

  &::after {
    content: '';
    inset: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    border: solid rem-calc(1) transparent;
    border-radius: rem-calc(4);
    transition: border linear 60ms;
  }

  &[data-state~="dragging"] {
    transform: translate(calc(var(--draggingX) * 1px), calc(var(--draggingY) * 1px)) scale(0.9) rotate(-10deg);
    transition: none;
    cursor: grabbing;

    .editor-element-icon {
    }

    * {
      pointer-events: none;
    }

    &::after {
      border-color: #457bb7;
    }
  }

  &[data-state="dropped"] {
    transform: translate(calc(var(--draggingX) * 1px), calc(var(--draggingY) * 1px)) scale(0);
  }

  &[data-state~="dragging"],
  &[data-state~="dropped"] {
    z-index: 299;
  }
}

//[data-state~="dragging"] {
//  cursor: grabbing;
//
//  .editor-sidebar-element-option,
//  .editor-sidebar-element-option * {
//    pointer-events: none;
//  }
//
//  .editor-sidebar-element-grid > .editor-sidebar-element-grid-item > .editor-sidebar-element-option {
//    &[data-state~="dragging"] {
//
//    }
//  }
//}


[data-state="dropped"] {
  .file {
    transform: translate(calc(var(--draggingX) * 1px), calc(var(--draggingY) * 1px)) scale(0);
  }
}
</style>