import http from "@/api";
/**
 * @name 数据大屏
 */
// 获取数据
export const screen_CockpitStatistics = (params: any) => {
  return http.get(`Lub/Cockpit/CockpitStatistics`, params);
};
// 奥特驾驶舱统计在线测点数量
export const screen_CockpitOnlinePointStatistics = (params: any) => {
  return http.get(`Lub/Cockpit/CockpitOnlinePointStatistics`, params);
};
// ----------- 行业驾驶舱 -------------
// 行业驾驶舱下拉框列表
export const industry_industryCockpitDropDown = (params: any) => {
  return http.get(`Lub/Cockpit/industryCockpitDropDown`, params);
};
// 行业驾驶舱设备列表
export const industry_industryCockpitEquipList = (params: any) => {
  return http.get(`Lub/Cockpit/industryCockpitEquipList`, {}, { params });
};
// 报警部件列表
export const industry_industryCockpitAlarmPart = (params: any) => {
  return http.get(`Lub/Cockpit/industryCockpitAlarmPart`, {}, { params });
};
