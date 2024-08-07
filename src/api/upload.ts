// import { ResPage, User } from "@/api/interface/index"; //类型
import http from "@/api";
/**
 * @name 文件服务
 */
// 上传文件 (支持大文件上传)
export const upload_uploadImage = (params: FormData) => {
  return http.post(`File/uploadImage`, params, { cancel: false });
};
// 删除文件
export const upload_deleteFileById = (params: any) => {
  return http.get(`File/deleteFileById`, {}, { params });
};
// 根据文件id获取图片
export const upload_getImageByFileId = (params: any) => {
  return http.get(`File/getImageByFileId`, {}, { params });
};
