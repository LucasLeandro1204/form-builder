    // @ts-ignore
import directives from "./directives";

import App from './App.vue';
import {createApp} from 'vue';

import '@/prototypes';

const app = createApp(App);

directives(app);

app.mount('#app');

import {SchemaForm} from "formvuelate";

import SchemaRow from '@/components/editor/form/SchemaRow.vue';
import SchemaColumn from '@/components/editor/form/SchemaColumn.vue';
import FormText from "@/components/editor/form/FormText.vue";
import FormSelect from "@/components/editor/form/FormSelect.vue";
import FormCheckbox from "@/components/editor/form/FormCheckbox.vue";
import FormRadio from '@/components/editor/form/FormRadio.vue';
import FormLegend from '@/components/editor/form/FormLegend.vue';

app.component("SchemaForm", SchemaForm);
app.component("SchemaRow", SchemaRow);
app.component("SchemaColumn", SchemaColumn);
app.component("FormLegend", FormLegend);
app.component("FormText", FormText);
app.component("FormSelect", FormSelect);
app.component("FormCheckbox", FormCheckbox);
app.component("FormRadio", FormRadio);