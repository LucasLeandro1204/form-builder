<script setup>
import {computed} from "vue";
import {useActor} from "@xstate/vue";
import SidebarComponentGroup from "@/components/editor/sidebar/SidebarElements.vue";
import SidebarSearch from "@/components/editor/sidebar/SidebarSearch.vue";

const props = defineProps({
  actorRef: {required: true, type: Object}
})

const {state, send} = useActor(props.actorRef)
const components = computed(() => state.value.context.components)
</script>

<template>
  <aside class="editor-layout-sidebar">
    <section class="edtior-layout-section">
      <SidebarSearch/>
    </section>
    <section v-for="(component, idx) in components" :key="idx" class="edtior-layout-section">
      <SidebarComponentGroup :component="component"/>
    </section>
  </aside>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

$element-border-radius: rem-calc(6);
$element-background-color: #FFFFFF;
$element-border-color: #dadada;
$element-border-size: rem-calc(2);

.editor-layout-sidebar {
  position: relative;
  width: auto;
  max-width: rem-calc(320);
  background: #FFFFFF;
  height: 100%;
  min-height: 100vh;
  padding: 0 rem-calc(14) rem-calc(14) rem-calc(12);
  box-shadow: rem-calc(6) 0 rem-calc(6) rem-calc(-6) #d3cfcf;

  .edtior-layout-section {
    display: flex;
    margin: rem-calc(18) 0;
  }
}

.editor-sidebar-element {
  all: unset;
  width: 100%;
  margin: rem-calc(8) 0;

  .option-text {

  }

  .editor-element-icon {

  }

  .editor-sidebar-element-legend {
    color: #575757;
    margin: 0 0 rem-calc(12) 0;
    font-weight: 500;
    text-transform: capitalize;
  }

  .editor-sidebar-element-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: rem-calc(12);

    .editor-sidebar-element-grid-item {
      height: rem-calc(49);
      position: relative;
      display: flex;
      border-radius: $element-border-radius;
      @include dashed-background($element-border-radius);
    }

    .editor-sidebar-element-option {
      border-radius: $element-border-radius;
      padding: rem-calc(7) rem-calc(8);
      display: flex;
      justify-content: space-around;
      user-select: none;
      width: 100%;
      background: $element-background-color;
      border: solid calc(#{$element-border-size} / 2) rgba($element-border-color, 0.5);
      text-transform: capitalize;
      font-weight: 500;
      align-items: center;
      text-align: center;
      cursor: grab;

      > * {
        pointer-events: none;
      }
    }
  }
}
</style>