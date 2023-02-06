import { createSSRApp } from "vue";
import * as Pinia from "pinia";
import App from "./App.vue";
import { appPlugin } from "./common/index";
import tmui from "./tmui";

export function createApp() {
    const app = createSSRApp(App);
    app.use(Pinia.createPinia()).use(appPlugin).use(tmui);
    return { app, Pinia };
}
