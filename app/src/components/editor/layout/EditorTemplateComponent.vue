<script setup lang="ts">
import {ref, inject, computed, useAttrs} from "vue";
import {COMPONENT_PLACEHOLDER} from "@/constants";

interface Component {
  id: number | string;
  placeholder: boolean;
  type: string;
}

interface Props {
  rowIndex: number;
  columnIndex: number;
  componentIndex: number;
  componentProps: Component;
}

const props = withDefaults(defineProps<Props>(), {})

const component = ref(props.componentProps)

const attributes = useAttrs()
const position = attributes['data-position']
const positionArray = `${position}`.split('-')
const positionDepth: number = positionArray.length

const message = computed(() => {
  // todo: use {layout} from {context}
  // todo: condtion: if {component} is the only child of its {parent}
  switch (positionDepth) {
    case 1:
      return `release to add {futureComponentType} within a new column within a new row`
    case 2:
      return 'release to add component within a column'
    case 3:
      return 'release to add component to this column'
  }
})

const isPlaceholderComponent = computed(
    () => component.value.type === COMPONENT_PLACEHOLDER)
</script>

<template>
  <div class="draggable-component" draggable="true"
       :class="{'placeholder-component': isPlaceholderComponent}">
    <div class="component-inset-block">
      <div v-if="isPlaceholderComponent">
        <p class="component-position-text">
          {{ message }}
        </p>
      </div>
      <div v-else>
        <span>{{ component }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "src/scss/abstracts";


</style>