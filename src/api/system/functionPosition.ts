import http from "@/api";
/**
 * @name 功能位置
 */
//树结构安装位置
export const getLocationTree = (params: any) => {
  return http.get(`Lub/location/Tree`, {}, { params });
};
// 更新或添加安装位置
export const locationAddOrUpdate = (params: any) => {
  return http.post(`Lub/location/addOrUpdate`, params);
};
// 删除位置，并同步删除子集以及设备
export const deleteById = (params: any) => {
  return http.post(`Lub/location/deleteById`, {}, { params });
};
// ii:设备
// 更新或添加设备
export const equip_addOrUpdate = (params: any) => {
  return http.post(`Lub/equip/addOrUpdate`, params);
};
// 删除位置，并同步删除子集以及设备
export const equip_deleteById = (params: any) => {
  return http.post(`Lub/equip/deleteById`, {}, { params });
};
// 设备详情
export const equip_equipInfo = (params: any) => {
  return http.get(`Lub/equip/equipInfo`, {}, { params });
};
// 设备下部件列表
export const equip_findPartList = (params: any) => {
  return http.get(`Lub/equip/findPartList`, {}, { params });
};
