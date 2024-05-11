import http from "@/api";
/**
 * @name 角色管理
 */
//角色列表（不分页）
export const getRoleList = () => {
  return http.post(`Lub/role/RoleList`, {});
};
// 角色下用户列表
export const getUserList = (params: any) => {
  return http.post(`Lub/role/RoleUserList`, params);
};
// 删除角色
export const deleteRoleByIds = (params: any) => {
  return http.post(`Lub/role/deleteByIds`, params);
};
// 删除角色下的用户
export const deleteRoleUser = (params: any) => {
  return http.post(`Lub/role/deleteRoleUser`, params);
};
// 新增或更新角色
export const addOrUpdate = (params: any) => {
  return http.post(`Lub/role/addOrUpdate`, params);
};
// 角色下绑定用户
export const addRoleUser = (params: any) => {
  return http.post(`Lub/role/addRoleUser`, params);
};
// 获取未绑定该角色的用户分页
export const noBindRoleUserPage = (params: any) => {
  return http.post(`Lub/role/noBindRoleUserPage`, params);
};
