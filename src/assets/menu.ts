// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
// RouteRecordRaw
// import HomeView from "@/src/views/platform/port/index.vue";
// D:\Autol-Project\src\views\platform\port\index.vue
// 导入其他视图组件...

// 使用接口定义路由
const routes: any = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: "HomeView",
  //   meta: { title: "首页" }
  // },
  {
    path: "/platform/port/index",
    name: "cockpit",
    component: "/platform/port/index",
    meta: {
      icon: "Histogram",
      title: "数据大屏",
      isLink: "",
      isHide: true,
      isFull: true,
      isAffix: false,
      isKeepAlive: true
    }
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: AboutView,
  //   meta: { title: '关于' }
  // },
  // 定义其他路由...
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
