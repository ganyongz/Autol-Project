import http from "@/api";
/**
 * @name （单个）设备预览
 */
// 设备总览页面卡片内容
export const equip_card = (params: any) => {
  return http.get(`Lub/equip/equipCard`, {}, { params });
};
// 设备详情信息（包含设备基本信息，振动等展示数据）
export const equip_equipInfo = (params: any) => {
  return http.get(`Lub/equip/equipInfoData`, {}, { params });
};

// 泵操作 （1开泵 2关泵  3冻结运行 4 关闭冻结 5读取设置参数(下发指令) 6读取后台参数（下发指令））
export const pump_OperatePump = (params: any) => {
  return http.post(`DataParsing/lubTcp/OperatePump`, params);
};
// 参数设置
export const pump_setPumpParams = (params: any) => {
  return http.post(`DataParsing/lubTcp/setPumpParams`, params);
};

// 读取润滑泵参数信息 type: 1 设置参数 2后台参数
export const pump_getPumpParams = (params: any) => {
  return http.get(`Lub/LubPumpController/getPumpParams`, {}, { params });
};
