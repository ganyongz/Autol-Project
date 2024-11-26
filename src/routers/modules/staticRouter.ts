import { RouteRecordRaw } from "vue-router";
import { HOME_URL, LOGIN_URL } from "@/config";

/**
 * staticRouter (静态路由 , 路由白名单)
 */
export const staticRouter: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: HOME_URL
  },
  {
    path: LOGIN_URL,
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录"
    }
  },
  {
    path: "/layout",
    name: "layout",
    component: () => import("@/layouts/index.vue"),
    // component: () => import("@/layouts/indexAsync.vue"),
    redirect: HOME_URL,
    children: []
  },

  {
    path: "/platform/port/index",
    name: "cockpit",
    component: () => import("@/views/platform/port/index.vue"),
    children: [],
    meta: {
      title: "港口驾驶舱"
    }
  },
  {
    path: "/platform/port/windPower",
    name: "windPower",
    component: () => import("@/views/platform/port/windPower.vue"),
    children: [],
    meta: {
      title: "风电驾驶舱"
    }
  },
  {
    path: "/platform/port/diggings",
    name: "diggings",
    component: () => import("@/views/platform/port/diggings.vue"),
    children: [],
    meta: {
      title: "矿山驾驶舱"
    }
  }
];

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/components/ErrorMessage/403.vue"),
    meta: {
      title: "403页面"
    }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/components/ErrorMessage/404.vue"),
    meta: {
      title: "404页面"
    }
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/components/ErrorMessage/500.vue"),
    meta: {
      title: "500页面"
    }
  },
  // Resolve refresh page, route warnings
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/components/ErrorMessage/404.vue")
  }
];
