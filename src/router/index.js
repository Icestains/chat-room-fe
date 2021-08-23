import { createRouter, createWebHistory } from "vue-router";
// import Home from "../views/Home.vue";
import Chat from "../views/Chat.vue";

const routes = [
  {
    path: "/",
    name: "Chat",
    component: Chat,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ "../views/About.vue");
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
