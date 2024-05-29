import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getAuthButtonListApi, getAuthMenuListApi } from "@/api/modules/login";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils";

export const useAuthStore = defineStore({
  id: "geeker-auth",
  state: (): AuthState => ({
    // 按钮权限列表
    authButtonList: {},
    // 菜单权限列表
    authMenuList: [],
    // 当前页面的 router name，用来做按钮权限筛选
    routeName: ""
  }),
  getters: {
    // 按钮权限列表
    authButtonListGet: state => state.authButtonList,
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: state => state.authMenuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: state => getFlatMenuList(state.authMenuList),
    // 递归处理后的所有面包屑导航列表
    breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList)
  },
  actions: {
    // Get AuthButtonList
    async getAuthButtonList() {
      const { data } = await getAuthButtonListApi();
      this.authButtonList = data;
    },
    // Get AuthMenuList ------> 获取菜单
    async getAuthMenuList() {
      const { data } = await getAuthMenuListApi();
      let data1: any = data;
      this.authMenuList = !!data1 ? data1.map((org: any) => mapTree(org)) : [];
      // this.authMenuList = data;
      console.log("菜单数据", this.authMenuList);
    },
    // Set RouteName
    async setRouteName(name: string) {
      this.routeName = name;
    }
  }
});
// 菜单数据递归
function mapTree(org: any) {
  const haveChildren = Array.isArray(org.children) && org.children.length > 0;
  return {
    //分别将我们查询出来的值做出改变他的key
    buttons: org.buttons,
    path: org.url,
    name: org.name,
    component: org.url,
    redirect: org.redirect,
    meta: {
      icon: org.icon,
      title: org?.title,
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true
    },
    //判断它是否存在子集，若果存在就进行再次进行遍历操作，知道不存在子集便对其他的元素进行操作
    children: haveChildren ? org.children.map((i: any) => mapTree(i)) : []
  };
}
