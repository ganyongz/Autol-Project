import http from "@/api";
/**
 * @name 趋势图
 */
// 趋势图
export const Diagram_trendChart = (params: any) => {
  return http.get(`Lub/Diagram/trendChart`, params);
};
// 获取图谱信息 1波形 2频谱 3包络图 4倒频谱 5细化谱 6自相关 7短时FFT分析 8功率谱 9阶次分析
export const Diagram_professionalAtlas = (params: any) => {
  return http.post(`Lub/Diagram/professionalAtlas`, params);
};
