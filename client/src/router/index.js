import Vue from "vue";
import VueRouter from "vue-router";
import Store from '../store/index'

import Index from "../views/Index.vue";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";



Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  }
];


const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !Store.getters.isLogged) next({ name: 'Login' })
  else next()
})

export default router;
