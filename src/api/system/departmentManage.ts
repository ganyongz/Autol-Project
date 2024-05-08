import http from "@/api";
/**
 * @name 部门管理模块
 */
// 部门列表
// export const getUserListByPage = (params: any) => {
//   return http.post(`Lub/UserController/Page`, params);
// };
// 部门结构树
export const getDepartTree = () => {
  return http.post(`Lub/dept/tree`);
};
// 删除
export const deleteDepartById = (params: any) => {
  return http.post(`Lub/dept/deleteById`, {}, { params });
};
// 新增&更新
export const addOrUpdateUser = (params: any) => {
  return http.post(`/Lub/dept/addOrUpdate`, params);
};
