import Vue from "vue";
import App from "./App";
import * as VueGoogleMaps from "vue2-google-maps";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';


Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAvSJXbA5BL96GQ_mZfNGhRAGEfHsUJLc0",
    libraries: "places" // necessary for places input
  }
});


new Vue({
  el: "#app",
  render: h => h(App)
});