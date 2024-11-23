import http from "@/api";
/**
 * @name MQTT
 */
// 服务监控
//列表
export const service_serviceList = (params: any) => {
  return http.get(`Lub/systemService/serviceList`, {}, { params });
};
//新增
export const service_addService = (params: any) => {
  return http.post(`Lub/systemService/addService`, params);
};
//编辑
export const service_updateService = (params: any) => {
  return http.post(`Lub/systemService/updateService`, params);
};
//删除
export const service_deleteServiceById = (params: any) => {
  return http.get(`Lub/systemService/deleteServiceById`, {}, { params });
};
//启动服务
export const service_startService = (params: any) => {
  return http.get(`Lub/systemService/startService`, {}, { params });
};
//停止服务
export const service_stopService = (params: any) => {
  return http.get(`Lub/systemService/stopService`, {}, { params });
};
