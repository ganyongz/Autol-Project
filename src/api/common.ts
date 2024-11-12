import http from "@/api";
/**
 * @name 公共服务
 */
// 导出润滑统计
export const export_recordExcel = (params: any) => {
  return http.get(`Lub/LubRecord/recordExcel`, params);
};
