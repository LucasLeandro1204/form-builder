// @ts-ignore
import directives from "./directives";

import App from './App.vue'
import {createApp} from 'vue'

import '@/prototypes'

const app = createApp(App)

directives(app)

app.mount('#app')

import { inspect } from '@xstate/inspect';

inspect({
    url: 'https://statecharts.io/inspect',
    iframe: false
});