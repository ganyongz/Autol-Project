import http from "@/api";
/**
 * @name 系统配置
 */
//获取配置项
export const config_getConfig = (params: any) => {
  return http.get(`Lub/SystemConfig/getConfig`, params);
};
// 保存配置项
export const config_setConfig = (params: any) => {
  return http.post(`Lub/SystemConfig/setConfig`, params);
};
// 获取配置内容
export const config_getValue = (params: any) => {
  return http.get(`Lub/SystemConfig/getValue`, params);
};
// 刷新 Redis 缓存
export const Redis_flushRedisCache = (params: any) => {
  return http.get(`Lub/RedisCacheController/flushRedisCache`, params);
};
