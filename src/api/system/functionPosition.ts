import http from "@/api";
/**
 * @name 功能位置
 */
//树结构安装位置
export const getLocationTree = (params: any) => {
  return http.get(`Lub/location/Tree`, {}, { params });
};
// 更新或添加安装位置
export const locationAddOrUpdate = (params: any) => {
  return http.post(`Lub/location/addOrUpdate`, params);
};
// 删除位置，并同步删除子集以及设备
export const deleteById = (params: any) => {
  return http.post(`Lub/location/deleteById`, {}, { params });
};

// ii:设备
// 更新或添加设备
export const equip_addOrUpdate = (params: any) => {
  return http.post(`Lub/equip/addOrUpdate`, params);
};
// 删除设备，并同步删除子集
export const equip_deleteById = (params: any) => {
  return http.post(`Lub/equip/deleteById`, {}, { params });
};
// 设备详情
export const equip_equipInfo = (params: any) => {
  return http.get(`Lub/equip/equipInfo`, {}, { params });
};
// 设备下部件列表 未使用 ----？？
export const equip_findPartList = (params: any) => {
  return http.get(`Lub/equip/findPartList`, {}, { params });
};

// iii:部件
// 更新或添加部件
export const equipPart_addOrUpdate = (params: any) => {
  return http.post(`Lub/equipPart/addOrUpdate`, params);
};
// 部件详情
export const equipPart_findById = (params: any) => {
  return http.get(`Lub/equipPart/findById`, {}, { params });
};
// 部件删除
export const equipPart_deleteById = (params: any) => {
  return http.get(`Lub/equipPart/deleteById`, params);
};
// 该部件下的测点列表
export const equipPart_findPointList = (params: any) => {
  return http.get(`Lub/equipPart/findPointList`, {}, { params });
};

// iiii:测点
// 删除部件，同步删除部件下测点
export const equipPoint_deleteById = (params: any) => {
  return http.get(`Lub/equipPoint/deleteById`, {}, { params });
};
// 更新或添加测点
export const equipPoint_addOrUpdate = (params: any) => {
  return http.post(`Lub/equipPoint/addOrUpdate`, params);
};
// 获取测点详情
export const equipPoint_findById = (params: any) => {
  return http.get(`Lub/equipPoint/findById`, {}, { params });
};
// 绑定数据测点
export const equipPoint_bindServerPointId = (params: any) => {
  return http.post(`Lub/equipPoint/bindServerPointId`, params);
};
// 解绑数据测点
export const equipPoint_unbindingServerPointId = (params: any) => {
  return http.get(`Lub/equipPoint/unbindingServerPointId`, {}, { params });
};
// iiiii: 测点绑定阈值报警策略
// 测点下阈值报警策略列表
export const equipPoint_pointThresholdTactics = (params: any) => {
  return http.get(`Lub/equipPoint/pointThresholdTactics`, {}, { params });
};
// 通过模板绑定阈值报警策略
export const equipPoint_bindThresholdTacticsByTemplate = (params: any) => {
  return http.get(`Lub/equipPoint/bindThresholdTacticsByTemplate`, {}, { params });
};
// 绑定自定义阈值报警策略
export const equipPoint_bindThresholdTacticsByCustomize = (params: any) => {
  return http.post(`Lub/equipPoint/bindThresholdTacticsByCustomize`, params);
};
// 删除阈值报警策略
export const equipPoint_deleteThresholdTactics = (params: any) => {
  return http.get(`Lub/equipPoint/deleteThresholdTactics`, {}, { params });
};
// 更新阈值报警策略
export const equipPoint_updateThresholdTactics = (params: any) => {
  return http.post(`Lub/equipPoint/updateThresholdTactics`, params);
};
// 三、ATL300泵相关
// ATL3000配置接口
export const atl_addAtl3000BoxConfig = (params: any) => {
  return http.post(`Lub/equipPart/addAtl3000BoxConfig`, params);
};
// ATL3000终端点号列表
export const atl_Atl3000BoxConfigList = (params: any) => {
  return http.post(`Lub/equipPart/Atl3000BoxConfigList`, {}, { params });
};
// ATL3000删除
export const atl_deleteAtl3000BoxConfig = (params: any) => {
  return http.get(`Lub/equipPart/deleteAtl3000BoxConfig`, {}, { params });
};
// ATL3000详情
export const atl_atl3000Detail = (params: any) => {
  return http.get(`Lub/equipPart/atl3000Detail`, {}, { params });
};
