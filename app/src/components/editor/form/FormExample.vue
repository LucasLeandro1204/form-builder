<template>
  <StandaloneForm :title="form.header.title"
                  :header-text="form.headerText">
    <FormComponent :schema="schema"
                   @submit="onSubmit"
                   @keydown="onFormKeydown($event)"
                   v-bind="form.options">
      <template #afterForm="{ validation }">
        <PrimaryButton :text="form.button.text"
                       :validation="validation.meta"
                       :aria-disabled="!validation.meta.valid"/>
      </template>
    </FormComponent>
  </StandaloneForm>
</template>

<script setup>
import {reactive, ref} from "vue"
import {useSchemaForm, SchemaFormFactory} from "formvuelate"
import {fakeApiRequest, onFormKeydown, stringify} from "@/mixins"

import StandaloneForm from "@/components/form/StandaloneForm.vue"
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import VeeValidatePlugin from "@formvuelate/plugin-vee-validate"

import {initialValues, layoutArraySchema, validationObjectSchema} from "@/validation/registerUserSchema"
import {configure} from "vee-validate"

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
})

import {setLocale} from 'yup'
import {nl} from 'yup-locales'

setLocale(nl)

const FormComponent = SchemaFormFactory([VeeValidatePlugin({})])

const schema = ref(layoutArraySchema)
const validationSchema = ref(validationObjectSchema)
const formData = ref(initialValues)
const {formModel} = useSchemaForm(formData)

const form = reactive({
  header: {
    title: `Nieuw Account Aanmaken`,
    text: `Voeg een nieuwe gebruiker toe aan het Yoot-netwerk.`,
  },
  button: {
    text: `Account Aanmaken`,
  },
  options: {
    preventModelCleanupOnSchemaChange: false,
    schemaRowClasses: stringify(['custom-class', 'another-custom-class']),
    validationSchema: validationSchema,
  }
})

const onSubmit = async () => {
  await fakeApiRequest()
}
</script>

<style lang="scss">
.schema-row {
  display: flex;
}

.schema-col {
  width: 100%;
}
</style>
