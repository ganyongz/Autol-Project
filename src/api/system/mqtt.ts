import http from "@/api";
/**
 * @name MQTT
 */
// A: MQTT服务
//MQTT服务列表
export const MqttServer_List = (params: any) => {
  return http.post(`Lub/MqttServer/List`, params);
};
// 新增MQTT服务
export const MqttServer_addOrUpdate = (params: any) => {
  return http.post(`Lub/MqttServer/addOrUpdate`, params);
};
// 根据id删除MQTT服务
export const MqttServer_deleteById = (params: any) => {
  return http.get(`Lub/MqttServer/deleteById`, {}, { params });
};

// B: Topic
//Topic列表
export const MqttServer_TopicList = (params: any) => {
  return http.post(`Lub/MqttServer/TopicList`, params);
};
// 新增Topic
export const MqttServer_addOrUpdateTopic = (params: any) => {
  return http.post(`Lub/MqttServer/addOrUpdateTopic`, params);
};
// 根据id删除Topic
export const MqttServer_deleteTopicIds = (params: any) => {
  return http.post(`Lub/MqttServer/deleteTopicIds`, params);
};
// 重置mqtt连接
export const MqttServer_resetConnect = (params: any) => {
  return http.get(`DataParsing/MQTT/resetConnect`, {}, { params });
};
// C： plc通道数据源管理
//列表(分页)
export const plc_getList = (params: any) => {
  return http.post(`Lub/PlcChannel/getPlcChannelPage`, params);
};
//新增，编辑
export const plc_addOrUpdate = (params: any) => {
  return http.post(`Lub/PlcChannel/addOrUpdate`, params);
};
//删除
export const plc_deleteById = (params: any) => {
  return http.get(`Lub/PlcChannel/deleteById`, {}, { params });
};
//批量删除
export const plc_deleteByIds = (params: any) => {
  return http.post(`Lub/PlcChannel/deleteByIds`, params);
};
