import http from "@/api";
/**
 * @name 油液分析
 */
// 油液分页查询
export const oil_pageList = (params: any) => {
  return http.get(`Lub/OilDataRecord/page`, {}, { params });
};
// 油液趋势相关（历史数据）
export const oil_hisData = (params: any) => {
  return http.get(`Lub/OilDataRecord/hisData`, {}, { params });
};
