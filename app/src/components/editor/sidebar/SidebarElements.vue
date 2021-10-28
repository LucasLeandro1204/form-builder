<script setup>
import {ref} from "vue";
import SidebarElement from "@/components/editor/sidebar/SidebarElement.vue";

const props = defineProps({
  component: {
    required: true,
    type: Object,
    default: () => ({
      legend: '',
      elements: []
    })
  },
})

const elements = ref(props.component.elements)
const legend = ref(props.component.legend)
</script>

<template>
  <fieldset class="editor-sidebar-element">
    <legend class="editor-sidebar-element-legend">
      {{ legend }}
    </legend>
    <div class="editor-sidebar-element-grid">
      <div v-for="(element, index) in elements" :key="element.id" :id="index"
           class="editor-sidebar-element-grid-item">
        <SidebarElement :element="element"/>
      </div>
    </div>
  </fieldset>
</template>

<style lang="scss">
@import "src/scss/abstracts";

.editor-sidebar-element-legend {
  pointer-events: none;
}
</style>