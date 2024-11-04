import http from "@/api";
/**
 * @name 仪器维护
 */
// i: 采集器
//采集器列表
export const collector_List = (params: any) => {
  return http.post(`Lub/Collector/List`, params);
};
// 新增采集器
export const collector_addOrUpdate = (params: any) => {
  return http.post(`Lub/Collector/addOrUpdate`, params);
};
// 根据id删除采集器
export const collector_deleteById = (params: any) => {
  return http.get(`Lub/Collector/deleteById`, {}, { params });
};

// i: 传感器
//传感器列表
export const sensor_sensorList = (params: any) => {
  return http.post(`Lub/Collector/sensorList`, params);
};
// 新增传感器
export const sensor_addOrUpdate = (params: any) => {
  return http.post(`Lub/Collector/addOrUpdateSensor`, params);
};
// 根据id删除传感器
export const sensor_deleteBySensorIds = (params: any) => {
  return http.post(`Lub/Collector/deleteBySensorIds`, params);
};
