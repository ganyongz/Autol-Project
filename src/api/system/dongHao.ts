import http from "@/api";
/**
 * @name 平台数据同步
 */
// 分页查询东昊仪器
export const move_Page = (params: any) => {
  return http.get(`Lub/DHInstrument/Page`, {}, { params });
};
// 根据id修改仪器采样周期
export const move_updateCycleById = (params: any) => {
  return http.get(`Lub/DHInstrument/updateCycleById`, {}, { params });
};

// 根据数据源 批量修改仪器采样周期  (暂时未用)
export const move_updateByServiceSource = (params: any) => {
  return http.get(`Lub/DHInstrument/updateByServiceSource`, {}, { params });
};
// 同步东昊仪器列表
export const move_syncInstrumentList = (params: any) => {
  return http.get(`Lub/DHInstrument/syncInstrumentList`, {}, { params });
};
