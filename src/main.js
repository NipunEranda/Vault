import { createApp } from 'vue'
import './assets/css/main.css';
import App from './App.vue'
import router from "./router";

import LoadingBar from './components/loadingBar.vue';
import Modal from './components/Modal.vue';

const app = createApp(App);

app.component("LoadingBar", LoadingBar).component("Modal", Modal).use(router).mount('#app');