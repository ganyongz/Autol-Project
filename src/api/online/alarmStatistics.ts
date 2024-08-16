import http from "@/api";
/**
 * @name 历史报警统计
 */
// 历史报警事件分页查询
export const alarm_List = (params: any) => {
  return http.post(`Lub/HisAlarmEvent/page`, params);
};
