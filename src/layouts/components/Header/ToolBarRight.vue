<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <!-- <AssemblySize id="assemblySize" />
      <Language id="language" /> -->
      <SearchMenu id="searchMenu" />
      <ThemeSetting id="themeSetting" />
      <!-- <Message id="message" /> -->
      <el-badge :value="alarmNum" class="item" @click="ToMessage" :style="{ opacity }">
        <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon" style="color: red"></i>
      </el-badge>
      <Fullscreen id="fullscreen" />
    </div>
    <span class="username">{{ username }}</span>
    <Avatar />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { message_getRealTimeAlarmCount } from "@/api/online/message";
import { useUserStore } from "@/stores/modules/user";
// import AssemblySize from "./components/AssemblySize.vue";
// import Language from "./components/Language.vue";
import SearchMenu from "./components/SearchMenu.vue";
import ThemeSetting from "./components/ThemeSetting.vue";
// import Message from "./components/Message.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();
const username = computed(() => userStore.userInfo.realName);
//路由跳转
const ToMessage = () => {
  router.push({ path: "/online/message/messageIndex" });
};
let alarmNum = ref(0);
const getEquipList = async () => {
  let res: any = await message_getRealTimeAlarmCount({ type: 9 });
  if (res.code == "200") {
    alarmNum.value = res.data.alarmNum;
  } else {
    ElMessage.error(res?.message ? res.message : res.error);
  }
};
// 铃铛闪烁
let opacity = ref(1);
const startTimer = () => {
  // 定义一个定时器，并开启
  let timerId1 = setInterval(() => {
    opacity.value -= 0.1;
    if (opacity.value <= 0) opacity.value = 1;
  }, 30);
  // 3秒后关闭定时器
  setTimeout(() => {
    clearInterval(timerId1);
    opacity.value = 1;
  }, 3000);
};
startTimer();
getEquipList();
</script>
<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
    color: var(--el-header-text-color);
  }
}
</style>
