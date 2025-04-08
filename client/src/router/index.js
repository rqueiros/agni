import Vue from "vue";
import VueRouter from "vue-router";
import Store from "../store/index";


import Index from "../pages/index/Index.vue";
import Login from "../pages/login/Login.vue";
import Student from "../pages/student/Student.vue";
import Teacher from "../pages/teacher/Teacher.vue";
import Questionnaire from "../pages/questionnaire/Questionnaire.vue";
import EvaluationV1 from "../pages/evaluation/EvaluationV1.vue";
import EvaluationV2 from "../pages/evaluation/EvaluationV2.vue";
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
  },
  {
    path: "/evaluation_v1",
    name: "EvaluationV1",
    component: EvaluationV1,
  },
  {
    path: "/evaluation_v2",
    name: "EvaluationV2",
    component: EvaluationV2,
  },
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
