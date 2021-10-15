// @ts-ignore
import directives from "./directives";

import App from './App.vue'
import {createApp} from 'vue'

import '@/prototypes'

const app = createApp(App)

directives(app)

app.mount('#app')
