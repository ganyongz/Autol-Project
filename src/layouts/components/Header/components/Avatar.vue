<template>
  <el-dropdown trigger="click">
    <div class="avatar">
      <img src="@/assets/images/avatar.png" alt="avatar" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <!-- 个人信息 -->
        <el-dropdown-item @click="openDialog('infoRef')" v-if="false">
          <el-icon><User /></el-icon>{{ $t("header.personalData") }}
        </el-dropdown-item>
        <!-- 修改密码 -->
        <el-dropdown-item @click="openDialog('passwordRef')" v-if="false">
          <el-icon><Edit /></el-icon>{{ $t("header.changePassword") }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          <el-icon><SwitchButton /></el-icon>{{ $t("header.logout") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- infoDialog -->
  <InfoDialog ref="infoRef"></InfoDialog>
  <!-- passwordDialog -->
  <PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { logoutApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { ElMessageBox, ElMessage } from "element-plus";
import InfoDialog from "./InfoDialog.vue";
import PasswordDialog from "./PasswordDialog.vue";
import mittBus from "@/utils/mittBus";

const router = useRouter();
const userStore = useUserStore();
// let loginUrl: any = localStorage.getItem("loginUrl") ? localStorage.getItem("loginUrl") : "/login";
// pinia 存储
let loginUrl: any = userStore.loginUrl ? userStore.loginUrl : "/login";
// 退出登录
const logout = () => {
  ElMessageBox.confirm("您是否确认退出登录?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    // 1.执行退出登录接口
    await logoutApi();

    // 2.清除 Token, 重置用户类型
    userStore.removeToken();
    userStore.setToken("");
    userStore.setUserType(0);

    // 3.重定向到登陆页
    router.replace(loginUrl);
    ElMessage.success("退出登录成功！");
    mittBus.emit("exitMessagePush"); //退出消息推送
  });
};

// 打开修改密码和个人信息弹窗
const infoRef = ref<InstanceType<typeof InfoDialog> | null>(null);
const passwordRef = ref<InstanceType<typeof PasswordDialog> | null>(null);
const openDialog = (ref: string) => {
  if (ref == "infoRef") infoRef.value?.openDialog();
  if (ref == "passwordRef") passwordRef.value?.openDialog();
};
</script>

<style scoped lang="scss">
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
