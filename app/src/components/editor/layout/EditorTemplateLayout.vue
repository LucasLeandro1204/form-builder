<script setup lang="ts">
import {computed, ref, watch, onMounted, useAttrs} from "vue";
import {ActorRef} from "xstate";
import {useActor} from "@xstate/vue";

import Row from "@/components/editor/layout/EditorTemplateRow.vue";
import Column from "@/components/editor/layout/EditorTemplateColumn.vue";
import Component from "@/components/editor/layout/EditorTemplateComponent.vue";

const props = defineProps<{
  actorRef: ActorRef<any>;
}>()

const {state, send} = useActor(props.actorRef)

const current = ref(state.value)
const layout = computed(() => state.value.context.layout)

watch(state, (state) => {
  if (state.changed) {
    current.value = state.value
  }
})
</script>

<template>
  <Row v-for="(row, index) in layout"
       :key="row.id"
       :data-position="index"
       :row-index="index"
       ref="rows">
    <Column v-for="(column, idx) in row.children"
            :key="column.id"
            :data-position="`${index}-${idx}`"
            :row-index="index"
            :column-index="idx"
            ref="columns">
      <div v-if="column.children && column.children.length">
        <Component v-for="(component, i) in column.children"
                   :key="component.id"
                   :data-position="`${index}-${idx}-${i}`"
                   :component-props="component"
                   :row-index="index"
                   :column-index="idx"
                   :component-index="i"
                   ref="components"/>
      </div>
    </Column>
  </Row>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

$red: rgb(234, 26, 26);

.editor-template-layout {
  position: relative;

  .editor-template-layout-inset-block {
    height: 100%;
    max-width: 100%;
    margin: 0 rem-calc(48);
    background: #FFFFFF;
  }
}

.draggable-row {
  .row-inset-block {
    border-radius: rem-calc(12);
  }

  .draggable-column {
    .draggable-component {
      min-height: rem-calc(80);
      position: relative;

      .component-inset-block {
        border-radius: rem-calc(8);
        width: 100%;

      }
    }
  }
}

.row-inset-block,
.column-inset-block,
.component-inset-block {
  overflow: hidden;
  width: 100%;

  > div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.draggable-row {
  z-index: 49;
  background: #457bb7;
  display: flex;
  flex-direction: column;
}

.draggable-column {
  z-index: 99;
  display: flex;
  flex-direction: column;
  background: repeating-linear-gradient(
          90deg, #0a284b4f, transparent rem-calc(4));
  padding-top: 0;
  padding-bottom: 0;
}

.draggable-component {
  position: relative;
  overflow: hidden;
  width: 100%;

  .component-inset-block {
    padding: rem-calc(50);
    background: aliceblue;
    border-radius: rem-calc(8);
  }

  &.placeholder-component {
    .component-inset-block {
      background: #0101014a;
    }
  }

}

.draggable-column {
  padding: 0 rem-calc(24);
}

.draggable-row {
  padding: rem-calc(24) 0;

}

.draggable-column,
.draggable-row {
  position: relative;
  overflow: hidden;
  width: 100%;

  > span {
    padding: rem-calc(18);
    font-weight: 500;
    pointer-events: none;
  }

  .component-inset-block,
  .row-inset-block {
    position: relative;
  }

  .row-inset-block {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
  }

  .column-inset-block {
    width: 100%;
    height: 100%;

    > div {
      display: flex;
      flex-direction: column;
      position: relative;
      align-items: center;
      height: 100%;

      .draggable-component {
        display: flex;
        flex-direction: column;
        position: relative;
        align-items: center;
        height: 100%;
      }
    }
  }

  .component-inset-block {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: black;
    text-align: center;
  }
}

.nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.draggable-row {
  cursor: move;

  &:hover {
    background: $red;
  }

  .draggable-column {
    cursor: move;

    &:hover {
      .draggable-component {
        &:hover {
          background: $red;
        }

        .component-inset-block {
          background: white;

          * {
            color: black;
          }
        }
      }
    }
  }
}


.draggable-component {
  cursor: move;
}

.draggable-column {
  padding: 0 rem-calc(24);

  .column-inset-block {
    .draggable-component {
      padding: rem-calc(24) 0;
    }
  }

  .component-inset-block {
    .component-position-text {
      text-align: center;
      color: #f6eded;
      font-weight: 900;
      font-size: rem-calc(16);
      letter-spacing: em-calc(0.8);

      &:first-letter {
        text-transform: uppercase;
      }
    }
  }
}

</style>