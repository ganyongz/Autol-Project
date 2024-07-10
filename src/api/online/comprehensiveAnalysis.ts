import http from "@/api";
/**
 * @name 趋势图
 */
// 趋势图
export const Diagram_trendChart = (params: any) => {
  return http.post(`Lub/Diagram/trendChart`, params);
};
// 获取图谱信息
export const Diagram_professionalAtlas = (params: any) => {
  return http.post(`Lub/Diagram/professionalAtlas`, params);
};
