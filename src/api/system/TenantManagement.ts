import http from "@/api";
/**
 * @name 租户管理 & 售后服务
 */
// 租户管理分页查询
export const Tenant_List = (params: any) => {
  return http.get(`Lub/Tenant/Page`, params);
};
// 更新，添加
export const Tenant_addOrUpdate = (params: any) => {
  return http.post(`Lub/Tenant/addOrUpdate`, params);
};
// 删除
export const Tenant_delete = (params: any) => {
  return http.get(`Lub/Tenant/delete`, {}, { params });
};
// 保存租户关联设备数据
export const Tenant_saveTenantLocation = (params: any) => {
  return http.post(`Lub/Tenant/saveTenantLocation`, params);
};
// 租户获取关联设备数据
export const Tenant_getLocationListByTenantId = (params: any) => {
  return http.get(`Lub/Tenant/getLocationListByTenantId`, {}, { params });
};
/**
 * @name 售后服务
 */
// 上传售后文件
export const afterSales_fileUpload = (params: any) => {
  return http.post(`Lub/OperationalDoc/fileUpload`, params);
};
// 下载售后文件
export const afterSales_download = (params: any) => {
  return http.get2(`Lub/OperationalDoc/download`, {}, { params });
};
// 预览文件
export const afterSales_preview = (params: any) => {
  return http.get2(`Lub/OperationalDoc/preview`, {}, { params });
};
// 根据当前登录用户获取售后文档信息
export const afterSales_Info = (params: any) => {
  return http.get(`Lub/OperationalDoc/Info`, {}, { params });
};
