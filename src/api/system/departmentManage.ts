import http from "@/api";
/**
 * @name 部门管理模块
 */
// 部门下用户分页查询
export const getDeptUserPage = (params: any) => {
  return http.post(`Lub/dept/deptUserPage`, params);
};
// 部门下删除用户
export const deptDeleteUser = (params: any) => {
  return http.post(`Lub/dept/deptDeleteUser`, params);
};
// 部门下新增用户
export const deptAddUser = (params: any) => {
  return http.post(`Lub/dept/deptAddUser`, params);
};

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
