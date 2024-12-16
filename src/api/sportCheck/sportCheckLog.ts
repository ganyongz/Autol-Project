import http from "@/api";
/**
 * @name 点检记录
 */
// 点检记录列表分页查询
export const spotCheckLog_List = (params: any) => {
  return http.post(`Lub/spotCheckLog/listPage`, params);
};
