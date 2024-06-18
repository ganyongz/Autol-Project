import http from "@/api";
/**
 * @name 总览
 */
export const Overview_List = (params: any) => {
  return http.get(`Lub/location/equipmentOverview`, params);
};
