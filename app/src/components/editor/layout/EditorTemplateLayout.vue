<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
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


onMounted(() => {

  // const rows = document.querySelectorAll('.draggable-row')
  // const columns = document.querySelectorAll('.draggable-column')
  // const components = document.querySelectorAll('.draggable-component')
  //
  // const draggableList = [...rows, ...columns, ...components]
  // console.log(draggableList)
  //
  //
  // // Loop through each nested sortable element
  // for (let i = 0; i < draggableList.length; i++) {
  //   console.log(draggableList[i])
  // }
})
</script>

<template>
  <Row v-for="(row, index) in layout"
       :key="row.id"
       :data-position="index">
    <Column v-for="(column, idx) in row.children"
            :key="column.id"
            :data-position="`${index}-${idx}`">
      <Component v-for="(component, i) in column.children"
                 :key="component.id"
                 :layout="layout"
                 :data-position="`${index}-${idx}-${i}`"
                 :component="component"/>
    </Column>
  </Row>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

.list-enter-active,
.list-leave-active {
  transition: all 0.1s ease;
  opacity: 1;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.point {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  text-transform: capitalize;
  font-weight: 600;
}

$red: rgba(255, 142, 202, 0.56);

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
    //border-radius: rem-calc(12);
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
  outline: none;

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
  outline: none;

  .component-inset-block {
    padding: rem-calc(50);
    background: aliceblue;
    border-radius: rem-calc(8);
  }

  &.placeholder-component {
    .component-inset-block {
      background: #0101014a;

      .component-position-text {
        color: #FFFFFF;
      }
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
  outline: none;

  > span {
    padding: rem-calc(18);
    text-shadow: 1px 0 0 currentColor;
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

  .draggable-column {
    cursor: move;

    .draggable-component {
      &.hover {
        background: $red;
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
      //color: #f6eded;
      //text-shadow: 1px 0 0 currentColor;
      //font-size: rem-calc(16);
      //letter-spacing: em-calc(0.8);

      &:first-letter {
        text-transform: uppercase;
      }
    }
  }
}

</style>