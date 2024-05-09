import http from "@/api";
/**
 * @name 动态菜单
 */
//获取菜单列表
export const getMenuList = () => {
  return http.post(`Lub/menu/menuList`, {});
};
// 新增&更新（菜单，按钮）
export const addOrUpdate = (params: any) => {
  return http.post(`Lub/menu/addOrUpdate`, params);
};
// 删除菜单，支持批量删除
export const deleteByIds = (params: any) => {
  return http.post(`Lub/menu/deleteByIds`, params);
};
