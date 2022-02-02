<script setup lang="ts">
import {ref, computed, useAttrs, watch} from "vue";
import {COMPONENT_PLACEHOLDER} from "@/constants";

interface Component {
  id: number | string;
  placeholder: boolean;
  type: string;
}

interface Props {
  component: Component;
  layout: any;
}

const props = withDefaults(defineProps<Props>(), {})
const component = ref(props.component)
const isPlaceholderComponent = computed(() => component.value.type === COMPONENT_PLACEHOLDER)
const asComponent = computed(() => component.value.as)
const hoverActive = ref(false)
const addHover = () => hoverActive.value = true
const removeHover = () => hoverActive.value = false

const classlist = ref([
  {'placeholder-component': isPlaceholderComponent},
  {'hover': hoverActive}
])

const mousedown = () => {
  console.log('PICK_UP')
}

const mouseup = () => {
  console.log('DROP')
}

/*
  const layout = props.layout
  const attributes = useAttrs()
  const takePosition = attributes['data-position']
  const position = takePosition.toString().split('-')
*/
</script>

<template>
  <div>
    <div :class="classlist"
         class="draggable-component"
         draggable="true">
      <div class="component-inset-block">
        <div v-if="isPlaceholderComponent">
          <p class="component-position-text">
            {{ `release to add component` }}
          </p>
        </div>
        <div v-else>
          <p class="component-position-text">
            {{ asComponent }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "src/scss/abstracts";
</style>