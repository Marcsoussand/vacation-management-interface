import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./style.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.config.errorHandler = (err, _instance, _info) => {
  console.error("[Vue Error]", err);
  router.push({ name: "error" });
};

app.mount("#app");
