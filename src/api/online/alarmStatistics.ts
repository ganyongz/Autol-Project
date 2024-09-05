import http from "@/api";
/**
 * @name 振动报警统计
 */
// 振动报警事件分页查询
export const alarm_List = (params: any) => {
  return http.post(`Lub/HisAlarmEvent/page`, params);
};
// 振动报警趋势
export const alarm_Trend = (params: any) => {
  return http.post(`Lub/HisAlarmEvent/Trend`, params);
};
