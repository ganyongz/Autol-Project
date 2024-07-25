<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="普通参数" name="first">
        <div class="realTimeData-box p-20 my-12">
          <div class="mb-12" style="display: flex; align-items: center; justify-content: space-between">
            <div>
              <!-- <img src="../../../assets/images/icons/ic_cs.png" class="mr-1" alt=""> -->
              <span style="color: #409eff">参数修改</span>
            </div>
            <div class="fs-14" style="color: #999999">采集时间：{{ parameterOfApparatus.recordTime }}</div>
          </div>
          <div>
            <div class="mb-16 fs-14">
              休止时间 (P1)：
              <el-input v-model="parameterOfApparatus.cycH" class="parameter-box mr-8" type="text" />时
              <el-input v-model="parameterOfApparatus.cycM" class="parameter-box mx-8" type="text" />分
            </div>

            <div class="mb-16 fs-14">
              休止时间 (P1)：
              <el-input v-model="parameterOfApparatus.cycH" class="parameter-box mr-8" type="text" />天
              <el-input v-model="parameterOfApparatus.cycM" class="parameter-box mx-8" type="text" />时
            </div>
            <div class="mb-16 fs-14">
              润滑时间 (P3)：
              <el-input v-model="parameterOfApparatus.runM" class="parameter-box mr-8" type="text" />分
              <el-input v-model="parameterOfApparatus.runS" class="parameter-box mx-8" type="text" />秒
            </div>
            <div class="mb-16 fs-14">
              温控 (P4)：<el-input v-model="parameterOfApparatus.temperature" class="parameter-box mr-12" type="text" />℃
            </div>
            <div class="mb-8 fs-14">
              信号检测 (P2)：<el-input v-model="parameterOfApparatus.signal" class="parameter-box mr-12" type="text" />
            </div>
            <div style="text-align: right">
              <el-button color="#095C98" type="primary" class="mr-12" @click="getDeviceParam()"> 读取 </el-button>
              <el-button color="#095C98" type="primary" @click="settingUpFun()"> 设置 </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 2 -->
      <el-tab-pane label="高级参数" name="second">
        <div class="realTimeData-box p-20 my-12">
          <div class="mb-12" style="display: flex; align-items: center; justify-content: space-between">
            <div>
              <!-- <img src="../../../assets/images/icons/ic_cs.png" class="mr-1" alt=""> -->
              <span style="color: #409eff">高级参数</span>
            </div>
            <div class="fs-14" style="color: #999999">采集时间：{{ parameterOfApparatus.recordTime }}</div>
          </div>
          <div>
            <div class="mb-16 fs-14">
              0H油压信号输入形式：<el-input v-model="parameterOfApparatus.temperature" class="parameter-box mr-12" type="text" />
            </div>

            <div class="mb-8 fs-14">
              1H故障状态：<el-input v-model="parameterOfApparatus.signal" class="parameter-box mr-12" type="text" />
            </div>

            <div class="mb-8 fs-14">
              2H报警检测：<el-input v-model="parameterOfApparatus.signal" class="parameter-box mr-12" type="text" />
            </div>

            <div class="mb-8 fs-14">
              3H报警检测：<el-input v-model="parameterOfApparatus.signal" class="parameter-box mr-12" type="text" />
            </div>

            <div style="text-align: right">
              <el-button color="#095C98" type="primary" class="mr-12" @click="getDeviceParam()"> 读取 </el-button>
              <el-button color="#095C98" type="primary" @click="settingUpFun()"> 设置 </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const activeName = ref("first");
const handleClick = (tab, event: Event) => {
  console.log(tab, event);
};
// const emit = defineEmits(["closeDialog", "submitForm"]);
// const form = reactive({
//   name: "",
//   region: "",
//   date1: "",
//   date2: ""
// });

// const onSubmit = () => {
//   emit("closeDialog");
// };
// 参数
const parameterOfApparatus = ref({
  cycH: "", // 休止时
  cycM: "", // 休止分
  runM: "", // 润滑分
  runS: "", // 润滑秒
  temperature: null, // 温度
  signal: "", // 信号检测
  recordTime: "" // 采集时间
});
// 读取
const getDeviceParam = () => {
  console.log("aaa");
};
// 设置
const settingUpFun = () => {
  console.log("bbb");
};
</script>
<style scoped lang="scss">
.parameter-box {
  width: 72px;
  height: 28px;
  color: #57c2ff;
  text-align: center;
  background: rgb(87 194 255 / 20%);
  border: 1px solid #22a4ee;
  outline: none;
}
.fs-14 {
  margin-bottom: 10px;
  font-size: 14px;
}
</style>
