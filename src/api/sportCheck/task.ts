import http from "@/api";
/**
 * @name 点检任务
 */
// 列表分页查询
export const task_List = (params: any) => {
  return http.post(`Lub/spotCheckPlan/listPage`, params);
};
// 新增/编辑
export const task_addOrUpdate = (params: any) => {
  return http.post(`Lub/spotCheckPlan/addItemsAndEquipsBindSave`, params);
};
// 获取详情信息
export const task_getInfoById = (params: any) => {
  return http.post(`Lub/spotCheckPlan/info`, params);
};
// 删除
export const task_delete = (params: any) => {
  return http.post(`Lub/spotCheckPlan/delete`, params);
};
