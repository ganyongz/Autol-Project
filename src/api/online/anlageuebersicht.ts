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
// （新版）泵操作 ***********************
/**
  V1
  单线 
  if (pumpStationType == 1) {
  1开泵 2关泵  3冻结 4 解冻 5读取设置参数 6读取后台参数 7设置参数 8设置后台参数
  //双线
  else if (pumpStationType == 2) {
  // 1开泵 2关泵  3冻结 4 解冻 5读取设置参数 6读取后台参数 7设置参数 8设置后台参数
  ATL3000
  if (pumpStationType == 3)
  ATL300   1自动  3复位   4设置参数  5读取参数  6 手动润滑
  递进
  else if (pumpStationType == 4) {
  // 1开泵 2关泵  3冻结 4 解冻 5读取设置参数 6读取后台参数 7设置参数 8设置后台参数
  单点泵
  // pumpStationType == 5   1开泵 2关泵  3 冻结 4 解冻 5读取设置参数 6设置参数 

V2
 单线
if (pumpStationType == 1) {
1开泵 2关泵  3 冻结 4 解冻 5读取设置参数 6读取后台参数 7设置参数 8设置后台参数 9设置上传频次 10恢复出厂设置
//双线
else if (pumpStationType == 2) {
// 1开泵 2关泵  3冻结 4 解冻 5读取参数 6设置参数 9设置上传频次
递进
else if (pumpStationType == 4) {
// 1开泵 2关泵  3冻结 4 解冻 5读取设置参数 6读取后台参数 7设置参数 8设置后台参数 9设置上传频次 10恢复出厂设置
单点泵
// pumpStationType == 5   1开泵 2关泵  3 冻结 4 解冻 5读取设置参数 6设置参数  9设置上传频次 10恢复出厂设置

 版本V1时，均无上传频次和回复出场设置
 版本V2时，除ATL3000均有上传频次和回复出场设置
 */
// 参数设置
export const pump_OperatePump = (params: any) => {
  return http.post(`DataParsing/lubTcp/sendCommand`, params);
};

// 读取润参数信息 type: 1 设置参数（普通参数设置） 2后台参数（高级参数设置）
export const pump_getPumpParams = (params: any) => {
  return http.get(`Lub/LubPumpController/getPumpParams`, {}, { params });
};
// 根据id获取详情(部件详情获取图片用)
export const equip_getImageById = (params: any) => {
  return http.get(`Lub/equipPart/findById`, {}, { params });
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
  return http.post(`Lub/HisAlarmEvent/page`, params);
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
