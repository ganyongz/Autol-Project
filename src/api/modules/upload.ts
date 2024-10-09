import { Upload } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 文件上传模块
 */
// // 图片上传
// export const uploadImg = (params: FormData) => {
//   return http.post<Upload.ResFileUrl>(PORT1 + `/file/upload/img`, params, { cancel: false });
// };
// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT1 + `/file/upload/video`, params, { cancel: false });
};
// 上传文件 (支持大文件上传)
export const uploadImg = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(`File/uploadImage`, params, { cancel: false });
};
// 根据文件id获取图片
export const upload_getImageByFileId = (params: any) => {
  return http.viewImg(`File/getImageByFileId`, {}, { params, loading: false });
};
// 删除文件
export const upload_deleteFileById = (params: any) => {
  return http.get(`File/deleteFileById`, {}, { params });
};
