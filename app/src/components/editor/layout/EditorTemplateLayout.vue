<script setup lang="ts">
import {computed, onBeforeUpdate, onMounted, ref, unref, watch} from "vue";
import {useActor} from "@xstate/vue";
import {ActorRef} from "xstate";

const props = defineProps<{
  actorRef: ActorRef<any>;
}>()

import Row from "@/components/editor/layout/EditorTemplateRow.vue";
import Column from "@/components/editor/layout/EditorTemplateColumn.vue";
import Component from "@/components/editor/layout/EditorTemplateComponent.vue";

const {state, send} = useActor(props.actorRef)

const current = ref(state.value)
const layout = computed(() => state.value.context.layout)

watch(state, (state) => {
  if (state.changed) {
    current.value = state.value
    console.log('@detect-change', state.value, state.context)
  }
})

// const rect = el => el.getBoundingClientRect();
//
// const rectCenter = el => {
//   const elRect = rect(el);
//   return [elRect.left + elRect.width / 2, elRect.top + elRect.height / 2];
// };
//
const rows = ref([])
const columns = ref([])
const components = ref([])

const log = (event: any) => {
  console.log('log', event)
}
</script>

<template>
  <Row v-for="(row, index) in layout"
       :key="index"
       :data-position="index"
       :row-index="index"
       :id="`row-${row.id}`"
       ref="rows">
    <Column v-for="(column, idx) in row.children" :key="idx"
            :data-position="`${index}-${idx}`"
            :row-index="index"
            :column-index="idx"
            :id="`column-${column.id}`"
            ref="columns">
      <Component v-for="(component, i) in column.children" :key="i"
                 :data-position="`${index}-${idx}-${i}`"
                 :component-props="component"
                 :index="i"
                 :row-index="index"
                 :column-index="idx"
                 :component-index="i"
                 :id="`component-${component.id}`"
                 ref="components"/>
    </Column>
  </Row>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

.pen-strokes-vector {
  width: 100%;
  height: 100%;
}

.editor-template-layout {
  position: relative;
  overflow: hidden;

  .editor-template-layout-inset-block {
    max-width: 100%;
    position: relative;
    min-height: 100vh;
    background: #FFFFFF;
    margin: 0 20px;
  }

  .draggable-row {

    .draggable-column {


      .draggable-component {

      }
    }
  }
}

.draggable-row {
  z-index: 49;

  display: flex;
  flex-direction: column;


  .row-inset-block {

  }
}

.draggable-column {
  z-index: 99;
  position: relative;
  display: flex;
  flex-direction: column;

  .column-inset-block {

  }
}

.draggable-component {
  z-index: 199;

  .component-inset-block {

  }
}

.draggable-component,
.draggable-column,
.draggable-row {
  position: relative;
  overflow: hidden;
  width: 100%;

  > span {
    padding: 18px;
    font-weight: 500;
  }

  .component-inset-block,
  .column-inset-block,
  .row-inset-block {
    overflow: hidden;
    position: relative;

    span {

    }
  }


  .row-inset-block {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
  }

  .column-inset-block {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .draggable-component {
      &:nth-child(n+2) {
        padding-top: rem-calc(12);
      }
    }
  }

  .component-inset-block {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    color: black;
    padding: 32px;
    text-align: center;
    overflow: hidden;
  }
}


.outset-block {
  border: solid rem-calc(1) #0d4586;

  &.top-block,
  &.bottom-block {
    height: rem-calc(24);
    width: 100%;
  }

  &.right-block,
  &.left-block {
    height: 100%;
    width: rem-calc(24);
  }

  &.top-block {
  }

  &.right-block {

  }

  &.bottom-block {
  }

  &.left-block {
  }
}
</style>