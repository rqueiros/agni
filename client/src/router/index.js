import Vue from "vue";
import VueRouter from "vue-router";
import Store from "../store/index";


import Index from "../pages/index/Index.vue";
import Login from "../pages/login/Login.vue";
import Student from "../pages/student/Student.vue";
import Teacher from "../pages/teacher/Teacher.vue";
import Questionnaire from "../pages/questionnaire/Questionnaire.vue";

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
    path: "/student",
    name: "Student",
    component: Student,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/teacher",
    name: "Teacher",
    component: Teacher,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/questionnaire",
    name: "Questionnaire",
    component: Questionnaire,
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !Store.getters["request/isLogged"])
    next({ name: "Login" });
  else next();
});

export default router;
