import http from "@/api";
/**
 * @name 维修记录
 */
//获取千叶水泥维修记录表（分页）
export const repair_listPage = (params: any) => {
  return http.post(`Lub/repairRecordQy/listPage`, params);
};
// 新增
export const repair_addOrUpdate = (params: any) => {
  return http.post(`Lub/repairRecordQy/addOrUpdate`, params);
};
// 删除
export const repair_deleteById = (params: any) => {
  return http.post(`Lub/repairRecordQy/deleteById`, params);
};
// 详情
export const repair_info = (params: any) => {
  return http.post(`Lub/repairRecordQy/info`, params);
};
