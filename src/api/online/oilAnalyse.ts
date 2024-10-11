import http from "@/api";
/**
 * @name 油液分析
 */
// 油液分页查询
export const oil_pageList = (params: any) => {
  return http.get(`Lub/OilDataRecord/page`, {}, { params });
};
// 油液趋势
export const oil_Trend = (params: any) => {
  return http.get(`Lub/HisAlarmEvent/Trend`, {}, { params });
};
