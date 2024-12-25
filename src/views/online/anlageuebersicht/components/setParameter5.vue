<template>
  <div>
    <div class="realTimeData-box p-20 my-12">
      <!-- <div class="fs-14" style="color: #999999">采集时间：{{ parameterOfApparatus.DataTime }}</div> -->
      <div>
        <div style="width: 350px; margin: 0 auto">
          <div class="mb-8 fs-14">
            <span class="labelClass">打油时间（月）：</span>
            <el-input v-model="parameterOfApparatus.workTime" @change="inputHandle" class="parameter-box mr-12" type="number" />
          </div>
        </div>
        <div style="text-align: center">
          <el-button color="#095C98" type="primary" class="mr-12" @click="getDeviceParam()"> 读取 </el-button>
          <el-button color="#095C98" type="primary" @click="settingUpFun()" v-if="userType == 1"> 设置 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="setParameter5">
// 参数设置(单点泵)
import { ref, toRefs } from "vue";
import { pump_OperatePump } from "@/api/online/anlageuebersicht";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
const userType = userStore.userType;
const props = defineProps({
  setParameters: {
    type: Object
  },
  messageType: {
    type: Number
  },
  siteId: {
    type: String
  }
});
const { setParameters, messageType, siteId }: any = toRefs(props);
let parameterOfApparatus: any = ref({
  DataTime: "",
  workTime: null
});
// 读取(下发指令)
const getDeviceParam = async () => {
  const res: any = await pump_OperatePump({
    messageType: messageType.value,
    siteId: siteId.value,
    gatewaySn: setParameters.value["GatewaySn"],
    pumpStationType: setParameters?.value.PumpStationType,
    plcAddress: setParameters?.value.PlcAddress,
    communicationVersion: setParameters?.value.communicationVersion, //版本号
    type: 5
  });
  if (res.code == "200") {
    parameterOfApparatus.value = Object.assign(JSON.parse(res.data));
  } else {
    ElMessage.error(res?.error ? res.error : res?.message);
  }
};
const inputHandle = val => {
  let values = [1, 3, 6, 12, 24];
  if (!values.includes(Number(val))) {
    ElMessage.warning("打油时间（月）只能输入1，3，6，12，24");

    return (parameterOfApparatus.value.workTime = null);
  }
};
// 设置
const settingUpFun = async () => {
  if (parameterOfApparatus.value.workTime == "" || parameterOfApparatus.value.workTime == null) {
    ElMessage.warning("请输入打油时间（月）");
    return;
  }
  let result = {};
  let parameters = {
    messageType: messageType.value,
    siteId: siteId.value,
    gatewaySn: setParameters.value["GatewaySn"],
    pumpStationType: setParameters?.value.PumpStationType,
    plcAddress: setParameters?.value.PlcAddress,
    communicationVersion: setParameters?.value.communicationVersion, //版本号
    type: 6
  };
  let variableData = JSON.parse(JSON.stringify(parameterOfApparatus.value));
  delete variableData["DataTime"];
  result = { ...parameters, ...variableData };
  const res: any = await pump_OperatePump(result);
  if (res.code == "200") {
    ElMessage.success(res?.message);
  } else {
    ElMessage.error(res?.message);
  }
};
</script>
<style scoped lang="scss">
.labelClass {
  display: inline-block;
  width: 120px;
  text-align: left;
}
.parameter-box {
  width: 100px;
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
  :deep(.el-input__inner) {
    text-align: center;
  }
}
</style>
