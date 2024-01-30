import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import vuetify from './plugins/vuetify'
import VueDOMPurifyHTML from 'vue-dompurify-html';

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(VueDOMPurifyHTML)

app.mount('#app')
