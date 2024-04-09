import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'
import vuetify from './plugins/vuetify'
import VueDOMPurifyHTML from 'vue-dompurify-html';
import commonComponents from './common/commoncomponents';
import router from './router';

const app = createApp(App)

app.use(router)
  .use(vuetify)
  .use(VueDOMPurifyHTML)
  .use(commonComponents)
  .use(router)

app.mount('#app')
