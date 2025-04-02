import { createApp } from 'vue';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import router from './router';

// Add icons to the library
library.add(faArrowsRotate);

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(router).mount('#app');
