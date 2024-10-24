import http from "@/api";
/**
 * @name 点检项配置
 */
// 点检项列表分页查询
export const configuration_List = (params: any) => {
  return http.post(`Lub/spotCheckItem/listPage`, params);
};
// 新增/编辑
export const configuration_addOrUpdate = (params: any) => {
  return http.post(`Lub/spotCheckItem/addOrUpdate`, params);
};
// 获取详情信息
export const configuration_getInfoById = (params: any) => {
  return http.post(`Lub/spotCheckItem/info`, params);
};
// 删除
export const configuration_deleteById = (params: any) => {
  return http.post(`Lub/spotCheckItem/deleteById`, params);
};
