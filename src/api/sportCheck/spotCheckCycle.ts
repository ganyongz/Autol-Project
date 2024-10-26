import http from "@/api";
/**
 * @name 点检巡检周期
 */
// 列表分页查询
export const spotCheckCycle_List = (params: any) => {
  return http.post(`Lub/spotCheckCycle/listPage`, params);
};
// 新增/编辑
export const spotCheckCycle_addOrUpdate = (params: any) => {
  return http.post(`Lub/spotCheckCycle/addOrUpdate`, params);
};
// 获取详情信息
export const spotCheckCycle_getInfoById = (params: any) => {
  return http.post(`Lub/spotCheckCycle/info`, params);
};
// 删除
export const spotCheckCycle_deleteById = (params: any) => {
  return http.post(`Lub/spotCheckCycle/deleteById`, params);
};
