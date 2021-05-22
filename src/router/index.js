import Vue from "vue";
import VueRouter from "vue-router";
import EncryptFile from "../views/EncryptFile.vue";
import DecryptFile from "../views/DecryptFile.vue";
import Keys from "../views/Keys.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "EncryptFile",
    component: EncryptFile,
  },
  {
    path: "/decrypt",
    name: "DecryptFile",
    component: DecryptFile,
  },
  {
    path: "/keys",
    name: "Keys",
    component: Keys
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
