/* eslint-disable simple-import-sort/imports */
import TDesign from 'tdesign-vue-next';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { store } from './store';
import svgIcon from './assets/svg-icons/index.vue';
import 'tdesign-vue-next/es/style/index.css';
import '@/style/index.less';
import './permission';
import 'virtual:svg-icons-register';

const app = createApp(App);
app.component('SvgIcon', svgIcon);
app.use(TDesign);
app.use(store);
app.use(router);

app.mount('#app');
