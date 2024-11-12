import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "geeker-user",
  state: (): UserState => ({
    token: "",
    Tenant: "",
    userType: 0,
    userInfo: { realName: "" },
    loginBackgroundImage: "",
    platformName: "",
    loginUrl: ""
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // 移除token
    removeToken() {
      this.token = "";
    },
    setUserType(userType: any) {
      this.userType = userType;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    },
    // set Tenant 租户Id
    setTenant(Tenant: string) {
      this.Tenant = Tenant;
    },
    // 移除 Tenant
    removeTenant() {
      this.Tenant = "";
    },
    // set loginBackgroundImage 登录背景图
    setBgImage(loginBackgroundImage: string) {
      this.loginBackgroundImage = loginBackgroundImage;
    },
    // 移除 loginBackgroundImage
    removeBgImage() {
      this.loginBackgroundImage = "";
    },
    // set platformName 租户平台名称
    setPlatformName(platformName: string) {
      this.platformName = platformName;
    },
    // 移除 platformName
    removePlatformName() {
      this.platformName = "";
    },
    // set loginUrl 租户登录地址
    setLoginUrl(loginUrl: string) {
      this.loginUrl = loginUrl;
    },
    // 移除 loginUrl
    removeLoginUrl() {
      this.loginUrl = "";
    }
  },
  persist: piniaPersistConfig("geeker-user")
});
