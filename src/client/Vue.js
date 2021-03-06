import Vue from "vue";
import App from "./App";
import * as VueGoogleMaps from "vue2-google-maps";
import axios from 'axios';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_BASE_URL : process.env.DEVELOP_BASE_URL;
console.log(axios.defaults.baseURL);

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_MAP_API_KEY,
    libraries: "places" // necessary for places input
  }
});


new Vue({
  el: "#app",
  render: h => h(App)
});