<script setup>
import EditorTemplateLayout from "@/components/editor/layout/EditorTemplateLayout.vue";
import {useActor} from "@xstate/vue";
import {computed, ref, watch} from "vue";
import Sort from "@/components/editor/Sort.vue";

const props = defineProps({
  actorRef: {required: true, type: Object}
})

const {state, send} = useActor(props.actorRef)


const current = ref(state.value)
const layout = computed(() => state.value.context.layout)
const context = computed(() => state.value.context)

watch(state, (state) => {
  if (state.changed) {
    current.value = state.value
  }
})

const delay = computed(() => state.value.context.delay)
</script>

<template>
  <div class="editor-template-layout editor-layout-control">
    <div class="editor-template-layout-inset-block">
      <EditorTemplateLayout :actor-ref="actorRef"/>
    </div>
    <div class="editor-template-layout-options">
      <div>
        <h4>Debounce Duration</h4>
        <p>{{ delay / 1000}}s</p>
      </div>
      <div>
        <input type="range" @input="send({type:'DELAY.UPDATE', value: $event.target.value})" :value="delay" step="100" min="0" max="3000"/>
      </div>
    </div>
    <div class="mx-w">
      <Sort class="mx-w"/>
    </div>
  </div>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

.mx-w {
  width: 100%;
}
.editor-template-layout-options {
  margin: 3rem;
}
</style>