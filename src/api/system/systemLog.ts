import http from "@/api";
/**
 * @name SystemLog
 */
// 系统日志
export const SystemLog_logPage = (params: any) => {
  return http.get(`Lub/SystemLog/logPage`, params);
};
