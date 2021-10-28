<script setup>
import {onMounted, ref, watch} from "vue"
import {nanoid} from "nanoid"
import {useActor} from "@xstate/vue";
import {addDataAttributes} from "@/mixins";

const props = defineProps({
  element: {
    type: Object,
    required: true,
    ref: {
      id: 0,
    }
  },
})

const uuid = nanoid(3)
const {state, send} = useActor(props.element.ref)
const current = ref(state.value)

onMounted(() => {
  const draggableElement = document.getElementById(`sidebar-element-${uuid}`)

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
     :id="`sidebar-element-${uuid}`"
     :class="element.as"
     :data-type="element.as.toLowerCase()">
    <img :src="element.icon"
         class="editor-element-icon"
         :class="element.as.toLowerCase()"
         alt=""/>
    <span class="option-text">{{ element.label }}</span>
  </a>
</template>

<style lang="scss" scoped>
@import "./src/scss/abstracts";

.editor-sidebar-element .editor-sidebar-element-option {
  --deltaX: 1em;
  --deltaY: 1em;
  transform: translate(calc(var(--deltaX) * 1px), calc(var(--deltaY) * 1px)), translateZ(0);
  transition: transform 0.25s cubic-bezier(0.7, 0, 0.3, 1);
  cursor: grab;
  z-index: 199;
  height: rem-calc(50);

  // Performance optimizations
  outline: 1px solid transparent;
  -webkit-backface-visibility: hidden;
  will-change: transform;
  contain: layout;

  .editor-element-icon {
    $size: rem-calc(20);
    width: $size;
    height: $size;
  }

  &::after {
    content: '';
    inset: 0;
    position: absolute;
    border: solid rem-calc(2) transparent;
    width: 105%;
    height: 105%;
    left: -2.5%;
    top: -2.5%;
    border-radius: rem-calc(6);
    transition: border linear 60ms;
  }

  &[data-state~="dragging"] {
    //transform: translate(calc(var(--deltaX) * 1px), calc(var(--deltaY) * 1px)) scale(0.9) rotate(-10deg);
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
    //transform: translate(calc(var(--deltaX) * 1px), calc(var(--deltaY) * 1px)) scale(0);
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


//[data-state="dropped"] {
//  .file {
//    transform: translate(calc(var(--draggingX) * 1px), calc(var(--draggingY) * 1px)) scale(0);
//  }
//}
</style>