import http from "@/api";
/**
 * @name 报警策略
 */
// 阈值报警策略分页查询
export const getThresholdList = (params: any) => {
  return http.post(`Lub/Threshold/page`, params);
};
// 更新，添加
export const Threshold_addOrUpdate = (params: any) => {
  return http.post(`Lub/Threshold/addOrUpdate`, params);
};
// 删除
export const Threshold_delete = (params: any) => {
  return http.post(`Lub/Threshold/deleteByIds`, params);
};
