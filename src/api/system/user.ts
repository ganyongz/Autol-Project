// import { ResPage, User } from "@/api/interface/index"; //类型
import http from "@/api";
/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserListByPage = (params: any) => {
  return http.post(`Lub/UserController/Page`, params);
};
// 删除
export const deleteUserByIds = (params: any) => {
  return http.post(`Lub/UserController/deleteByIds`, params);
};
// 新增&更新
export const addOrUpdateUser = (params: any) => {
  return http.post(`/Lub/UserController/addOrUpdateUser`, params);
};
