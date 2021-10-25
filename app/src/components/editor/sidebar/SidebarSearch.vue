<script setup>
import {icons} from "@/mixins/icons";
const {search} = icons
</script>

<template>
  <div class="search-components">
    <div class="input-control">
      <div class="label-group sr-only">
        <label for="component-input-search">Search Components</label>
      </div>
      <div class="input-group">
        <input type="text" id="component-input-search" placeholder="Search Components"/>
        <img :src="search" class="search-icon" alt="Zoeken"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

.search-components {
  width: 100%;
}

.sr-only {
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  left: 99em;
}

#component-input-search {
  border: solid rem-calc(2) #e5e5e5;
  border-radius: rem-calc(8);
  font-weight: normal;
  font-size: rem-calc(15);
  padding: rem-calc(12) rem-calc(48) rem-calc(12) rem-calc(12);
}

.search-icon {
  $size: rem-calc(16);
  width: $size;
  height: $size;
  opacity: 0.5;
  position: absolute;
  top: 50%;
  right: rem-calc(18);
  transform: translate(0, calc(-50% - #{rem-calc(1)}));
}

.search-components {

  .input-group,
  .label-group,
  .input-control {
    position: relative;
    width: 100%;
  }
}


</style>