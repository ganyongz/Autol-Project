import http from "@/api";
/**
 * @name （单个）设备预览
 */
// 设备总览页面卡片内容
export const equip_card = (params: any) => {
  return http.get(`Lub/equip/equipCard`, {}, { params, loading: false });
};
// 设备详情信息（包含设备基本信息，振动等展示数据）
export const equip_equipInfo = (params: any) => {
  return http.get(`Lub/equip/equipInfoData`, {}, { params });
};

// 泵操作 （1开泵 2关泵  3冻结运行 4 关闭冻结 5读取设置参数(下发指令) 6读取后台参数（下发指令）7 Atl3000设备读取设置参数命令） 8 Atl3000自动命令  9 Atl3000手动  10 Atl3000复位 11 Atl3000停止
export const pump_OperatePump = (params: any) => {
  return http.post(`DataParsing/lubTcp/OperatePump`, params);
};
// 读取润滑泵参数信息 type: 1 设置参数（普通参数设置） 2后台参数（高级参数设置）
export const pump_getPumpParams = (params: any) => {
  return http.get(`Lub/LubPumpController/getPumpParams`, {}, { params });
};
// 参数设置 （type 同读取润滑泵参数）
export const pump_setPumpParams = (params: any) => {
  return http.post(`DataParsing/lubTcp/setPumpParams`, params);
};

// 润滑泵润滑记录 分页查询
export const lub_LubRecordByPage = (params: any) => {
  return http.get(`Lub/LubRecord/page`, {}, { params });
};
// 润滑统计
export const lub_lubStatistics = (params: any) => {
  return http.get(`Lub/LubRecord/lubStatistics`, {}, { params });
};
// 润滑（图谱）
export const lub_lubTrend = (params: any) => {
  return http.get(`Lub/LubRecord/lubTrend`, {}, { params });
};

// 润滑泵报警记录 分页查询
export const lub_HisAlarmEventByPage = (params: any) => {
  return http.post(`Lub/HisAlarmEvent/page`, {}, { params });
};

// 润滑报警事件 分页查询 (功能位置-报警策略)
export const lub_lubAlarmEventPage = (params: any) => {
  return http.get(`Lub/LubAlarm/lubAlarmEventPage`, {}, { params });
};
// 近30日润滑报警趋势
export const lub_lubAlarmTrend = (params: any) => {
  return http.get(`Lub/LubAlarm/lubAlarmTrend`, {}, { params });
};
// ---------- 改版的部件详情 ------------
// 获取部件下实时数据信息
export const equip_partRealData = (params: any) => {
  return http.get(`Lub/equipPart/partRealData`, {}, { params, loading: false });
};
