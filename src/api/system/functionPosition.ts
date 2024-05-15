import http from "@/api";
/**
 * @name 功能位置
 */
//树结构安装位置
export const getLocationTree = () => {
  return http.get(`Lub/location/LocationTree`, {});
};
// 更新或添加安装位置
export const locationAddOrUpdate = (params: any) => {
  return http.post(`Lub/location/addOrUpdate`, params);
};
// 删除位置，并同步删除子集以及设备
export const deleteById = (params: any) => {
  return http.post(`Lub/location/deleteById`, {}, { params });
};
