<template>
  <fieldset class="field-wrapper radio clear-top">
    <div class="control">
      <div v-if="options && options.length"
           class="field-radio">
        <label class="smart-placeholder ">{{ labelName }}</label>
        <div v-for="(option, idx) in optionsList" :key="idx"
             :class="{'checked': modelValue.toLowerCase() === option.toLowerCase()}"
             class="radio-item">
          <input @input="update(option)"
                 :checked=" modelValue.toLowerCase() === option.toLowerCase()"
                 :name="uuid"
                 v-bind="config"
                 type="radio"
                 class="input radio">
          <label class="custom-radio">
            {{ option }}
          </label>
        </div>
      </div>
      <div v-else class="field-radio">
        <div class="radio-item">
          <input @input="update($event.target.checked)"
                 :name="uuid"
                 :checked="modelValue === initialValue"
                 v-bind="config"
                 type="radio"
                 class="input radio">
          <label class="custom-radio">
            {{ labelName }}
          </label>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script>
import {computed, ref} from "vue";

export default {
  name: 'FormRadio',
  setup(props, context) {
    const initialValue = props.modelValue
    const value = ref(props.modelValue)
    const labelName = computed(() => props.label.capitalize())
    const optionsList = props.options.map(option => option.capitalize())
    const update = (value) => {
      context.emit('update:modelValue', value)
    }
    return {
      update,
      value,
      initialValue,
      labelName,
      optionsList
    }
  },
  props: {
    uuid: {
      type: Number,
      default: 0,
    },
    modelValue: {
      required: true
    },
    model: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => ({
        placeholder: '',
        autocomplete: 'on',
        type: 'text',
        disabled: false,
      })
    },
    validation: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
