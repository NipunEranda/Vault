import { createWebHashHistory, createRouter } from "vue-router";
import Index from "../pages/Index.vue";
import Home from "../pages/Home.vue";

// Layouts
import InitLayout from '../layouts/init.vue';
import DefaultLayout from '../layouts/default.vue';

import { run } from "../utils";

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    meta: {
      layout: InitLayout
    }
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      layout: DefaultLayout
    }
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const config = await run("READ_CONFIG");
  if (config) {
    const connectionURL = JSON.parse(config).connectionURL;
    if (to.path == "/" && connectionURL != null) return "/home";
    if (to.path != "/" && connectionURL == null) return "/";
  }
  return true;
});

export default router;