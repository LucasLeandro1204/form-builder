<template>
  <label v-bind="$attrs"
         class="smart-placeholder">
    <span class="label-text">
      {{ labelName }}
    </span>
  </label>
</template>

<script>
import {computed} from "vue";

export default {
  name: 'FormLabel',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const labelName = computed(() => props.label.capitalize())

    return {
      labelName,
    }
  }
}
</script>
