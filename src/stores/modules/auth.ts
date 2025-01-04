import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
// import { getAuthButtonListApi, getAuthMenuListApi } from "@/api/modules/login";
import { getAuthMenuListApi } from "@/api/modules/login";
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
    // 获取动态菜单(接口)
    async getAuthMenuList() {
      const { data } = await getAuthMenuListApi();
      let data1: any = data;
      let buttonsDatas: any = [];
      this.authMenuList = !!data1 ? data1.map((org: any) => mapTree(org)) : [];
      // console.log("菜单数据", this.authMenuList);
      // 获取按钮权限处理
      if (data1.length > 0) {
        buttonsDatas = flattenArray(data1);
        // console.log(buttonsDatas);
        this.authButtonList = buttonsDatas.reduce((acc, item) => {
          // 检查按钮数组是否为空
          if (item.buttons.length > 0) {
            // 提取按钮名称并转换为字符串数组
            const buttonNames = item.buttons.map(btn => btn.name);
            // 将按钮名称数组分配给对应的名称属性
            acc[item.name] = buttonNames;
          } else {
            // 如果按钮数组为空，分配一个空数组
            acc[item.name] = [];
          }
          return acc;
        }, {});
      } else {
        this.authButtonList = {};
      }
    },
    // Set RouteName
    async setRouteName(name: string) {
      this.routeName = name;
    },
    // Get AuthButtonList
    async getAuthButtonList() {
      // const { data } = await getAuthButtonListApi();
      // this.authButtonList = data;
    }
  }
});
// 判断路由权限 待用
// function extractNames(arr: any) {
//   let names = [];
//   arr.forEach((item: any) => {
//     names.push(item.name); // 添加当前对象的 name
//     if (item.children && item.children.length > 0) {
//       names = names.concat(extractNames(item.children)); // 递归添加子对象的 name
//     }
//   });
//   return names;
// }
// 222
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
    isHide: org.isHide,
    meta: {
      icon: org.icon,
      title: org?.title,
      isLink: "",
      isHide: org.isHide,
      isFull: false,
      isAffix: false,
      isKeepAlive: true
    },
    //判断它是否存在子集，若果存在就进行再次进行遍历操作，知道不存在子集便对其他的元素进行操作
    children: haveChildren ? org.children.map((i: any) => mapTree(i)) : []
  };
}
// 数组扁平化 （多维数组转为一维数组）
const flattenArray = (array: any) => {
  const result: any = [];
  const flatten = (nodes: any) => {
    nodes.forEach((node: any) => {
      result.push(node);
      if (node.children) {
        flatten(node.children);
      }
    });
  };
  flatten(array);
  return result;
};
