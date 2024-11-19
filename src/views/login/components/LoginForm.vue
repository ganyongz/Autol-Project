<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="userName">
      <el-input v-model="loginForm.userName" placeholder="用户名：admin / user">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="密码" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-checkbox v-model="rememberPassword" label="记住密码" />
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)"> 重置 </el-button>
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { getTimeState } from "@/utils";
import { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { loginApi1 } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import { ElForm, ElMessage } from "element-plus";
// import md5 from "md5";
let rememberPassword = ref(true);
const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  userName: "",
  password: ""
});

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    if (rememberPassword.value) {
      localStorage.setItem("userName", loginForm.userName);
      localStorage.setItem("password", loginForm.password);
    } else {
      localStorage.removeItem("userName");
      localStorage.removeItem("password");
    }
    try {
      // 1.执行登录接口
      const data: any = await loginApi1({ ...loginForm });
      if (data.code == 200) {
        userStore.setToken(data.data.token);
        userStore.setUserType(data.data.userType);
        userStore.setUserInfo(data.data.userInfo);
        // 2.添加动态路由
        await initDynamicRouter();
        // 3.清空 tabs、keepAlive 数据
        await tabsStore.setTabs([]);
        await keepAliveStore.setKeepAliveName([]);

        // 4.跳转到首页
        setTimeout(() => {
          router.push(HOME_URL);
          ElNotification({
            title: getTimeState(),
            message: "欢迎登录 Autol 管理系统",
            type: "success",
            duration: 2000
          });
        }, 100);
      } else {
        ElMessage.error(data.message);
      }
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  const storedUsername = localStorage.getItem("userName");
  const storedPassword = localStorage.getItem("password");
  if (storedUsername && storedPassword) {
    loginForm.userName = storedUsername;
    loginForm.password = storedPassword;
  }
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
