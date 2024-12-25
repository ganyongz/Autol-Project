<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <!-- <AssemblySize id="assemblySize" />
      <Language id="language" /> -->
      <SearchMenu id="searchMenu" />
      <ThemeSetting id="themeSetting" />
      <!-- <Message id="message" /> -->
      <el-badge :value="alarmNum" class="item" @click="ToMessage" :style="{ opacity }">
        <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon" :style="`${alarmNum > 0 ? 'color:red' : 'color:#303133'}`"></i>
      </el-badge>
      <Fullscreen id="fullscreen" />
    </div>
    <span class="username">{{ username }}</span>
    <Avatar />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { ElNotification } from "element-plus";
import { message_getRealTimeAlarmCount } from "@/api/online/message";
import { useUserStore } from "@/stores/modules/user";
// import AssemblySize from "./components/AssemblySize.vue";
// import Language from "./components/Language.vue";
import SearchMenu from "./components/SearchMenu.vue";
import ThemeSetting from "./components/ThemeSetting.vue";
// import Message from "./components/Message.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";
import Speech from "speak-tts";
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
  if (res?.code == "200") {
    alarmNum.value = res.data.alarmNum;
  } else {
    // ElMessage.error(res?.message);
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
  // 5秒后关闭定时器
  setTimeout(() => {
    clearInterval(timerId1);
    opacity.value = 1;
  }, 5000);
};
// websocket start
let URL = `${userStore.webSocketPath}`;
let socketUrl: any = URL; // socket地址
let websocket: any = null; // websocket 实例
let heartTime: any = null; // 心跳定时器实例
let socketHeart: number = 0; // 心跳次数
let HeartTimeOut: number = 50000; // 心跳超时时间
let socketError: number = 0; // 错误次数

// 初始化socket
const initWebSocket = (url: any) => {
  let token = userStore.token;
  let userType: any = userStore.userType;
  const subprotocol = `?userType=${userType}&token=${token}`;
  // 初始化 websocket
  websocket = new WebSocket(url + subprotocol);
  websocketOnOpen();
  websocketOnMessage(); //接收数据
  websocketOnError();
  websocketClose();
  sendSocketHeart();
};
onMounted(() => {
  // 初始化websocket
  initWebSocket(socketUrl);
});
// socket 连接成功
const websocketOnOpen = () => {
  websocket.onopen = function () {
    console.log("连接成功");
    resetHeart();
  };
};
// socket 连接失败
const websocketOnError = () => {
  websocket.onerror = function (e: any) {
    console.log("连接 websocket 失败", e);
  };
};
// socket 断开链接
const websocketClose = () => {
  websocket.onclose = function (e: any) {
    console.log("断开连接", e);
  };
};
// 创建通知
const notify = msg => {
  const notice = ElNotification({
    title: "提示",
    message: msg,
    type: "warning",
    duration: 10000,
    onClick: () => {
      ToMessage();
      notice.close(); // 点击通知后关闭
    }
  });
};
// socket 接收数据
const websocketOnMessage = () => {
  websocket.onmessage = function (e: any) {
    if (e.data === "PONG") {
      resetHeart();
      return;
    }
    let msg = JSON.parse(e.data);
    startTimer();
    notify(msg.message);
    if (msg.message) {
      getEquipList();
      speak(msg.message);
    }
    // test(msg); // 测试数据
  };
};
// socket 重置心跳
const resetHeart = () => {
  socketHeart = 0;
  socketError = 0;
  clearInterval(heartTime);
  sendSocketHeart();
};

// socket心跳发送
const sendSocketHeart = () => {
  heartTime = setInterval(() => {
    // 如果连接正常则发送心跳
    if (websocket.readyState == 1) {
      // if (socketHeart <= 30) {
      // console.log("心跳发送：", socketHeart);
      websocket.send("PING");
      // websocket.send(
      //   JSON.stringify({
      //     type: "spot_check_log"
      //   })
      // );
      socketHeart = socketHeart + 1;
    } else {
      // 重连
      reconnect();
    }
  }, HeartTimeOut);
};

// socket重连
const reconnect = () => {
  if (socketError <= 2) {
    clearInterval(heartTime);
    initWebSocket(socketUrl);
    socketError = socketError + 1;
    // console.log("socket重连", socketError);
  } else {
    // console.log("重试次数已用完的逻辑", socketError);
    clearInterval(heartTime);
  }
};

// 测试收到消息传递
// const test = (msg: any) => {
// console.log(msg, "测试收到消息传递");
// switch (msg.type) {
//   case 'PING': //加入会议
//     mitts.emit('PING', msg)
//     break;
// }
// };
// websocket end

// 语音播报 start
// 创建 Speech 实例
const speech = new Speech();
// 检查浏览器是否支持语音播报
if (speech.hasBrowserSupport()) {
  console.log("浏览器支持语音播报");
} else {
  console.log("浏览器不支持语音播报");
}

// 定义播放语音的方法
const speak = (msg: any) => {
  speech
    .init({
      volume: 1, // 音量
      lang: "zh-CN", // 语言
      rate: 1, // 语速
      pitch: 1, // 音调
      voice: "Microsoft Huihui - Chinese (Simplified, PRC)" // 语音
    })
    .then(() => {
      speech.speak({
        text: msg // 要播放的文本
      });
    })
    .catch(e => {
      console.error("语音播报发生错误:", e);
    });
};
// 语音播报 end
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
