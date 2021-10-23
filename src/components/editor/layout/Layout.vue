<script setup>
import {computed, watch} from "vue";
import {useActor} from "@xstate/vue";

const props = defineProps({
  actorRef: {required: true, type: Object}
})

const {state, send} = useActor(props.actorRef)

const layout = computed(() => state.value.context.layout)

watch(state, (state) => {
  console.log(state.value, state.context)
})

</script>

<template>
  <div class="editor-main-layout">
    <div id="schema-layout">

      <div v-for="(row, index) in layout" :key="index"
           :data-position="index"
           class="draggable draggable-row">


        <div v-for="(column, idx) in row.children" :key="idx"
             :data-position="`${index}-${idx}`"
             class="draggable draggable-column">


          <div v-for="(component, i) in column.children" :key="i"
               :data-position="`${index}-${idx}-${i}`"
               class="draggable draggable-component">

            <p class="text">
              Component
            </p>

          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style lang="scss">
#schema-layout {
  height: 100%;
  width: 100%;
  background: #FFFFFF;
}

.editor-main-layout {
  padding: 20px;
  max-width: 100%;
  position: relative;
  min-height: 100vh;
  overflow: scroll;
}

.text {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
}

.draggable-column {
  border: dashed 2px #21a67a;
  display: flex;
  position: relative;
  z-index: 49;

  > .text {
    position: absolute;
    border-radius: 50%;
    left: 50%;
    top: 14px;
    transform: translate(-50%, 0);
  }
}

.draggable-row {
  border: dashed 1px #30a1e7;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 99;
}

.draggable-component {
  height: 100%;
  border: dotted 2px #ff6363;
  z-index: 199;

  > .text {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    font-size: 1.2em;
  }
}

.draggable-component,
.draggable-column,
.draggable-row {
  position: relative;
  overflow: hidden;
  padding: 20px;
  width: 100%;
}

.draggable-component {
  padding: 20px;
  height: 80px;
}
</style>