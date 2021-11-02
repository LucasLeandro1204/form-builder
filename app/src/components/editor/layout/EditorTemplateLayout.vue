<script setup lang="ts">
import {computed, onBeforeUpdate, onMounted, ref, unref, watch} from "vue";
import {useActor} from "@xstate/vue";
import {ActorRef} from "xstate";
import {addDataAttributes} from '@/mixins'

const props = defineProps<{
  actorRef: ActorRef<any>;
}>()

import Row from "@/components/editor/layout/EditorTemplateRow.vue";
import Column from "@/components/editor/layout/EditorTemplateColumn.vue";
import Component from "@/components/editor/layout/EditorTemplateComponent.vue";
import {PSEUDO_COMPONENT} from "@/constants";

const {state, send} = useActor(props.actorRef)

const current = ref(state.value)
const layout = computed(() => state.value.context.layout)

onMounted(() => {
  watch(state, (state) => {
    if (state.changed) {
      current.value = state.value
      addDataAttributes(
          [document.querySelector('#app')],
          `${state.toStrings()}`.split(',')
      )
      // console.log(state.value, state.context)
    }
  })
})


const rows = ref([])
const columns = ref([])
const components = ref([])

</script>

<template>
  <Row v-for="(row, index) in layout"
       :key="index"
       :data-position="index"
       :row-index="index"
       ref="rows">
    <div v-if="row.children && row.children.length">
      <Column v-for="(column, idx) in row.children" :key="idx"
              :data-position="`${index}-${idx}`"
              :row-index="index"
              :column-index="idx"
              ref="columns">
        <div v-if="column.children && column.children.length">
          <Component v-for="(component, i) in column.children" :key="i"
                     :data-position="`${index}-${idx}-${i}`"
                     :component-props="component"
                     :index="i"
                     :row-index="index"
                     :column-index="idx"
                     :component-index="i"
                     ref="components"/>
        </div>
      </Column>
    </div>
    <div v-else>
      <h1>Empty :o</h1>
    </div>
  </Row>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

.pen-strokes-vector {
  width: 100%;
  height: 100%;
}

.row-inset-block,
.column-inset-block,
.component-inset-block {
  > div {
    width: 100%;
  }
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
  background: #457bb7;
  display: flex;
  flex-direction: column;


  .row-inset-block {


  }
}

.draggable-column {
  z-index: 99;
  display: flex;
  flex-direction: column;
  background: rgba(241, 235, 123, 0.13);

  //> * {
  //  pointer-events: none;
  //}

  .column-inset-block {

  }
}

.draggable-component {
  //z-index: 199;

  .component-inset-block {

  }
}

.draggable-component,
.draggable-column,
.draggable-row {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: rem-calc(24);

  > span {
    padding: 18px;
    font-weight: 500;
    pointer-events: none;
  }

  .component-inset-block,
  .column-inset-block,
  .row-inset-block {
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
        //padding-top: rem-calc(12);
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
    //overflow: hidden;
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