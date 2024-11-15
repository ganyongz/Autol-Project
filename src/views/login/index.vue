<template>
  <div v-if="isShow" class="login-container flx-center" :style="backgroundImageStyle">
    <div class="login-box">
      <SwitchDark class="dark" />
      <!-- <div class="login-left">
        <img class="login-left-img" src="@/assets/images/login_left.png" alt="login" />
      </div> -->
      <div class="login-form">
        <div class="login-logo">
          <!-- <img class="login-icon" src="@/assets/images/logo.svg" alt="" /> -->
          <h2 class="logo-text">{{ logoText }}</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import { onMounted, ref, watch, nextTick } from "vue";
import LoginForm from "./components/LoginForm.vue";
import SwitchDark from "@/components/SwitchDark/index.vue";
import { useUserStore } from "@/stores/modules/user";
import imgSrc from "@/views/login/login.gif";
const userStore = useUserStore();
const backgroundImageStyle = ref({
  backgroundImage: `url(${imgSrc})`
});
let logoText = ref("智慧润滑系统");
let isShow = ref(true);
onMounted(() => {
  nextTick(() => {
    backgroundImageStyle.value.backgroundImage = `url(${userStore.loginBackgroundImage != "" && userStore.loginBackgroundImage != undefined ? userStore.loginBackgroundImage : imgSrc})`;
    logoText.value = userStore.platformName != "" ? userStore.platformName : "智慧润滑系统";
  });
});
watch(
  () => userStore.loginBackgroundImage,
  (newVal, oldVal) => {
    console.log(newVal);
    console.log(newVal, oldVal);
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
