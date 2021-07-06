import {
  createRouter,
  //createWebHistory,
  createWebHashHistory,
} from "vue-router";
import Home from '../views/Home.vue'
import Auth from "../views/auth/Auth.vue";
import NotFoundComponent from "../views/NotFoundComponent.vue";
import store from '../store';
import { computed } from 'vue'
const logged = computed(() => store.getters.logged)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      defaultLayout: true,
    },
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
    meta: {
      defaultLayout: false,
    },
  },
  {
    path: "/businesses",
    name: "Businesses",
    meta: {
      defaultLayout: true,
    },
    props: true,
    component: () =>
      import(/* webpackChunkName: "businesses" */ "../views/Businesses.vue"),
  },
  {
    path: "/results",
    name: "Results",
    meta: {
      defaultLayout: true,
    },
    component: () =>
      import(/* webpackChunkName: "results" */ "../views/Results.vue"),
  },
  { path: "/:pathMatch(.*)", component: NotFoundComponent },
];


const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== "Auth" && !logged.value) next({ name: "Auth" });
  else next();
});
export default router
