
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

//import '@coreui/coreui/dist/css/coreui.min.css'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Material from '@primeuix/themes/material';
import './assets/main.css'
import { definePreset } from '@primeuix/themes';


const app = createApp(App)
const pinia = createPinia()


app.use(pinia)
app.use(router)
app.use(PrimeVue,{
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
                darkModeSelector: '.dark',
             
        }
    }
})
app.mount('#app')
