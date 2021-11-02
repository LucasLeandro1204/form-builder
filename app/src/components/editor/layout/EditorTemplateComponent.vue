<script setup lang="ts">
import {ref, inject, computed} from "vue";
import {PSEUDO_COMPONENT, DROP_ZONE} from '@/constants';
import {isEqual} from "lodash";

const interactive = inject('interactive')

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
</script>

<template>
  <div class="draggable-component" draggable="true"
       :class="{'pseudo-component': component.type === PSEUDO_COMPONENT}">
    <div v-if="!interactive" class="outset-block top-block"/>
    <div class="component-inset-block">
      <span>{{ component.type }}</span>
    </div>
    <div v-if="!interactive" class="outset-block bottom-block"/>
  </div>
</template>

<style lang="scss">
@import "src/scss/abstracts";


</style>