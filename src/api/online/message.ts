import http from "@/api";
/**
 * @name 报警消息
 */
// 获取实时报警数量
export const message_getRealTimeAlarmCount = (params: any) => {
  return http.get(`Lub/RealTimeAlarms/getRealTimeAlarmCount`, {}, { params });
};
// 获取实时报警列表 type 1振动 2润滑 3油液
export const message_getRealTimeAlarm = (params: any) => {
  return http.get(`Lub/RealTimeAlarms/getRealTimeAlarm`, {}, { params });
};
// 报警消息标为已读
export const message_setIsDispose1 = (params: any) => {
  return http.post(`Lub/RealTimeAlarms/setIsDispose1`, params);
};
