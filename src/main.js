import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "./plugins/materialize"


import excel from "vue-excel-export";

Vue.use(excel);
import VueCurrencyFilter from "vue-currency-filter";



Vue.use(VueCurrencyFilter, {
    symbol: "C$",
    thousandsSeparator: ",",
    fractionCount: 2,
    fractionSeparator: ".",
    symbolPosition: "front",
    symbolSpacing: true,
});

Vue.use(require("vue-moment"));
Vue.config.productionTip = false;
axios.defaults.baseURL = "http://localhost:63038/";
new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");