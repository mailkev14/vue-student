import Vue from "vue";
import VueRouter from "vue-router";

import Students from "./views/Students";

Vue.use(VueRouter);

const routes = [
  {
    path: "/students",
    name: "students",
    component: Students
  },
  {
    path: "/pay-now",
    name: "pay_now",
    component: () => import("./views/Fees")
  },
  {
    path: "*",
    redirect: "/students"
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
