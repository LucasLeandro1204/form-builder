<template>
  <h1 class="section-title">{{ labelName }}</h1>
</template>

<script>
import {computed} from "vue";

export default {
  name: 'FormLegend',
  props: {
    model: {
      required: true,
    },
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
