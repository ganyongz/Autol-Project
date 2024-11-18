import http from "@/api";
/**
 * @name 公共服务
 */
// 导出润滑统计
export const export_recordExcel = (params: any) => {
  return http.get2(`Lub/LubRecord/recordExcel`, {}, { params, type: "blobType" });
};
// 导出报警记录
export const export_lubAlarmEventExcel = (params: any) => {
  return http.get2(`Lub/LubAlarm/lubAlarmEventExcel`, {}, { params, type: "blobType" });
};
