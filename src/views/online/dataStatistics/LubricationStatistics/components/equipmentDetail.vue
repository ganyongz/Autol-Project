<template>
  <div class="box" style="background-color: var(--el-fill-color-blank)">
    <!-- border-image: linear-gradient(to right, #ff33cc, #ffcc33) 30 30 round; -->
    <div
      style="
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        height: calc(100vh - 230px);
        margin-right: 10px;
        overflow: hidden;
        border: 1px solid gray;
        box-shadow: 5px 5px 10px rgb(1 10 0 / 50%);
      "
      class="box3"
    >
      <img v-if="imageUrl" style="width: 100%; height: 100%" :src="imageUrl" alt="工艺图" />
      <el-empty v-else description="暂无图片" />
    </div>
    <!-- 右侧卡片 -->
    <div style="min-width: 360px; height: 100%">
      <!-- 1.振动 -->
      <div
        id="box1"
        v-if="useVib == '1'"
        style="
          padding-bottom: 20px;
          margin-bottom: 20px;
          border: 2px solid gray;
          border-radius: 10px;
          box-shadow: 0 0 10px 0 gray;
        "
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            padding: 5px 25px;
            background-color: #0000001f;
            border-bottom: 1px solid #cdd0d6;
            border-radius: 10px 10px 0 0;
          "
        >
          <div style="color: #009688; text-align: left">振动情况：</div>
          <el-button size="small" type="primary" @click="ZDAlarmRecord(cards)">报警记录</el-button>
        </div>
        <div :style="{ height: computedHeight, padding: '20px', 'overflow-y': 'auto' }">
          <div v-if="cards?.VibRealData.length > 0">
            <div v-for="(item, index) in cards?.VibRealData" :key="index">
              <el-popover placement="right" :width="300" trigger="hover">
                <template #reference>
                  <!-- background: linear-gradient(82deg, #59607b 0%, #253350 99%); -->
                  <div style="display: flex; justify-content: space-between">
                    <p style="margin: 5px 0; cursor: pointer">{{ item.pointName }} :</p>
                    <p style="margin: 5px 0; color: #19be6b">{{ item.value }}</p>
                  </div>
                </template>
                <div>
                  <el-button @click="openDialog(item)">基本分析</el-button>
                  <!-- <el-button @click="openDialog('趋势分析')">趋势分析</el-button> -->
                </div>
              </el-popover>
            </div>
          </div>
          <el-empty v-else :image-size="50" description="暂无数据" />
        </div>
      </div>
      <!-- 2.润滑监控 -->
      <div
        v-if="useLub == '1'"
        style="
          padding-bottom: 20px;
          margin-bottom: 20px;
          border: 2px solid gray;
          border-radius: 10px;
          box-shadow: 0 0 10px 0 gray;
        "
      >
        <!-- 标题头 -->
        <div
          style="
            display: flex;
            justify-content: space-between;
            padding: 5px 25px;
            background-color: #0000001f;
            border-bottom: 1px solid #cdd0d6;
            border-radius: 10px 10px 0 0;
          "
        >
          <div style="padding: 5px, 0; margin-bottom: 5px; color: #009688; text-align: left">润滑监控：</div>
          <div>
            <el-icon color="green" v-if="LubIsOnline == 1" :size="23"><Opportunity /></el-icon>
            <el-icon color="gray" v-else :size="23"><Opportunity /></el-icon>
          </div>
        </div>
        <div
          style="
            padding: 10px 25px;
            background-color: var(--el-fill-color-light);
            border-bottom: 1px solid #cdd0d6;
            border-radius: 10px 10px 0 0;
          "
        >
          <div style="display: inline-flex; margin-bottom: 10px">
            <el-button size="small" type="primary" @click="FunSetParameter(cards)">参数</el-button>
            <!-- <el-button size="small" type="primary" @click="FunStatistics(cards)">数据统计</el-button> -->
            <!-- 只有Atl3000才有详情 -->
            <el-button size="small" type="primary" @click="viewDetails()" v-if="cards.PumpStationType == 3">详情</el-button>
            <el-button size="small" type="primary" @click="FunAlarmRecord(cards, 'lubrication')">润滑记录</el-button>
            <el-button size="small" type="primary" @click="FunAlarmRecord(cards, 'alarm')">报警记录</el-button>
            <el-button
              size="small"
              type="primary"
              @click="factorySetting(cards)"
              v-if="cards?.PumpStationType != 3 && (cards?.communicationVersion == 2 || cards?.communicationVersion == 3)"
            >
              恢复出厂设置
            </el-button>
          </div>
          <!-- 非ATL3000操作 -->
          <div v-if="cards.PumpStationType != 3" style="font-size: 12px">
            <span>操作：</span>
            <el-button size="small" @click="kaibeng(cards)">开泵</el-button>
            <el-button size="small" @click="guanbeng(cards)">关泵</el-button>
            <el-button size="small" @click="dongjie(cards)">冻结</el-button>
            <el-button size="small" @click="jiedong(cards)">解冻</el-button>
          </div>
          <!-- ATL3000操作 -->
          <div v-if="cards.PumpStationType == 3" style="margin: 5px 0; font-size: 12px">
            <span>操作：</span>
            <el-button :class="{ active: isActive == '自动' }" size="small" @click="pump_handle('ziDong', cards)">自动</el-button>
            <el-button :class="{ active: isActive == '手动润滑' }" size="small" @click="pump_handle('shouDong', cards)">
              手动润滑
            </el-button>
            <el-button type="warning" size="small" @click="pump_handle('fuWei', cards)">复位</el-button>
            <!-- <el-button type="danger" size="small" @click="pump_handle('tingZhi', cards)"> 停止</el-button> -->
          </div>
        </div>

        <!-- 润滑信息 -->
        <div :style="{ height: computedHeight, padding: '20px', 'overflow-y': 'auto' }">
          <div v-if="cards?.LubRealData.length > 0">
            <div v-for="(item, index) in cards?.LubRealData" :key="index">
              <div style="display: flex; justify-content: space-between">
                <p style="margin: 5px 0">{{ item.name }}</p>
                <p style="margin: 5px 0; color: #19be6b">{{ item.value }}</p>
              </div>
            </div>
          </div>
          <el-empty v-else :image-size="50" description="暂无数据" />
        </div>
      </div>
      <!-- 3.油液 -->
      <div
        style="
          padding-bottom: 20px;
          margin-bottom: 20px;
          border: 2px solid gray;
          border-radius: 10px;
          box-shadow: 0 0 10px 0 gray;
        "
        v-if="useOil == '1'"
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            padding: 7px 25px;
            background-color: #0000001f;
            border-bottom: 1px solid #cdd0d6;
            border-radius: 10px 10px 0 0;
          "
        >
          <div style="color: #009688; text-align: left">油液状态：</div>
          <div>
            <el-button size="small" type="warning" @click="FunToOil(cards)">油液记录</el-button>
            <el-button size="small" type="primary" @click="FunAlarmRecord(cards, 'alarm')">报警记录</el-button>
          </div>
        </div>
        <div :style="{ height: computedHeight, padding: '20px', 'overflow-y': 'auto' }">
          <div v-if="cards?.OilRealData.length > 0">
            <div v-for="(item, index) in cards?.OilRealData" :key="index">
              <div style="display: flex; justify-content: space-between">
                <p style="margin: 5px 0">{{ item.name }}:</p>
                <p style="margin: 5px 0; color: #19be6b">{{ item.value }}</p>
              </div>
            </div>
          </div>
          <el-empty v-else :image-size="50" description="暂无数据" />
        </div>
      </div>
      <el-empty v-if="!(useVib == '1' || useLub == '1' || useOil == '1')" description="暂无数据记录" />
    </div>

    <!-- 基本分析 -->
    <myDialog :title="detailParams.title" ref="myDialog1" draggable width="50%" :before-close="beforeClose1">
      <template #content>
        <analyses v-if="IsShowAdd" ref="addEditRoleRef" :row-data="rowData" :title="detailParams.title" />
      </template>
    </myDialog>
    <!-- start -->
    <!-- 参数设置(单选，递进) -->
    <myDialog title="参数设置" ref="myDialog2" draggable width="30%" :before-close="beforeClose2">
      <template #content>
        <setParameter14
          v-if="IsShowSetTpl"
          ref="setParameterRef"
          :set-parameters="setParameters"
          @close-dialog="beforeClose2"
          title="参数设置"
        />
      </template>
    </myDialog>
    <!-- 参数设置(ATL3000) -->
    <myDialog title="参数设置" ref="myDialog3" draggable width="40%" :before-close="beforeClose3">
      <template #content>
        <setAtl3k
          v-if="ShowSetAtl3k"
          ref="setParameterRef"
          :set-parameters="setParameters"
          @close-dialog="beforeClose3"
          title="参数设置(ATL3000)"
        />
      </template>
    </myDialog>

    <!-- 参数设置(双线) -->
    <myDialog title="参数设置" ref="myDialog4" draggable width="40%" :before-close="beforeClose4">
      <template #content>
        <setParameter2
          v-if="ShowTPL4"
          ref="setParameterRef"
          :set-parameters="setParameters"
          @close-dialog="beforeClose4"
          title="参数设置(双线)"
        />
      </template>
    </myDialog>

    <!-- 参数设置(单点泵) -->
    <myDialog title="参数设置" ref="myDialog5" draggable width="40%" :before-close="beforeClose5">
      <template #content>
        <setParameter5
          v-if="ShowTPL5"
          ref="setParameterRef"
          :set-parameters="setParameters"
          @close-dialog="beforeClose5"
          title="参数设置"
        />
      </template>
    </myDialog>

    <!-- end -->
    <!-- ATL3000 详情 -->
    <myDialog title="ATL3000详情" ref="ATLDialog" draggable width="65%" :before-close="closeDialog2">
      <template #content>
        <ATL3kDetail v-if="IsShowATL3k" ref="ATL3kRef" :part-id="partId" title="ATL3000配置" @close-dialog="closeDialog2" />
      </template>
    </myDialog>
    <!-- ATL3000 手动操作参数设置 -->
    <el-dialog v-model="dialogVisible" title="润滑站点区间" width="500" :before-close="handleClose">
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="起点：" prop="startPoint">
          <el-input v-model="ruleForm.startPoint" />
        </el-form-item>

        <el-form-item label="终点：" prop="endPoint">
          <el-input v-model="ruleForm.endPoint" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ToSet(ruleFormRef)"> 启动 </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="equipmentDetail">
import { ref, reactive, toRefs, onUnmounted, nextTick, onDeactivated, onActivated, onMounted } from "vue";
import { ElMessage, type FormRules, type FormInstance } from "element-plus";
import { equip_partRealData, pump_OperatePump } from "@/api/online/anlageuebersicht";
import { upload_getImageByFileId } from "@/api/modules/upload";
import { useHandleData2 } from "@/hooks/useHandleData";
import myDialog from "@/components/dialog/myDialog.vue";
import analyses from "@/views/online/anlageuebersicht/components/analyses.vue";
// import setParameter from "@/views/online/anlageuebersicht/components/setParameter.vue";
import setParameter2 from "@/views/online/anlageuebersicht/components/setParameter2.vue";
import setParameter14 from "@/views/online/anlageuebersicht/components/setParameter14.vue";
import setParameter5 from "@/views/online/anlageuebersicht/components/setParameter5.vue";
import setAtl3k from "@/views/online/anlageuebersicht/components/setAtl3k.vue";
import ATL3kDetail from "@/views/online/anlageuebersicht/components/ATL3kDetail.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  partId: {
    type: String || Number
  }
});
const { partId } = toRefs(props);
// 获取图片
let imageUrl = ref();
const getImgUrl = async imageFileId => {
  if (imageFileId) {
    const res: any = await upload_getImageByFileId({ fileId: imageFileId });
    let blob = new Blob([res], {
      type: "image/png"
    });
    let url = URL.createObjectURL(blob);
    imageUrl.value = url;
  } else {
    imageUrl.value = null;
  }
};
let computedHeight: any = ref("9rem");
//获取页面卡片
let LubIsOnline = ref();
let useLub = ref();
let useOil = ref();
let useVib = ref();
let cards = ref();
let isActive = ref();
const getCardContent = async () => {
  const res: any = await equip_partRealData({ partId: partId?.value });
  if (res.code == "200") {
    getImgUrl(res.data.imageFileId);
    nextTick(() => {
      LubIsOnline.value = res.data.LubIsOnline;
      useVib.value = res.data.useVib;
      useLub.value = res.data.useLub;
      useOil.value = res.data.useOil;
      cards.value = res.data;
      const hasA = res.data?.useVib == "1" ? true : false;
      const hasB = res.data?.useLub == "1" ? true : false;
      const hasC = res.data?.useOil == "1" ? true : false;

      const isAOnly = hasA && !hasB && !hasC;
      const isBOnly = hasB && !hasA && !hasC;
      const isCOnly = hasC && !hasA && !hasB;
      // computedHeight.value = isAOnly || isBOnly || isCOnly ? "calc(100vh - 330px)" : "9rem";
      if (isAOnly || isCOnly) {
        computedHeight.value = "calc(100vh - 330px)";
      } else if (isBOnly) {
        computedHeight.value = "calc(100vh - 410px)";
      } else {
        computedHeight.value = "calc(50vh - 267px)";
      }
    });
    if (res.data.LubRealData && res.data.LubRealData.length > 0) {
      let arrData = res.data.LubRealData;
      // 使用 find 方法查找 name 为 '状态' 的对象
      const statusObject = arrData.find(obj => obj.name === "运行状态");
      // 获取该对象的 value 值
      isActive.value = statusObject ? statusObject.value : null;
    }
  } else {
    ElMessage.error(res?.message);
  }
};
// open1 - 开始
let rowData = ref();
const myDialog1 = ref();
const IsShowAdd = ref(false);
const beforeClose1 = () => {
  IsShowAdd.value = false;
  myDialog1.value.close();
};
const detailParams = ref({
  title: "新增"
});
// 基本分析
const openDialog = (obj1: any) => {
  router.push({ path: "/online/expertAnalysis/comprehensiveAnalysis/index", query: { pointId: obj1.pointId } });
};
// close1 - 关闭
// 1 报警记录 start
const FunAlarmRecord = (val: any, type: string) => {
  console.log(val.partId, "部件id");
  router.push({
    path: "/online/dataStatistics/LubricationStatistics/LubricationStatistics",
    query: { partId: val.partId, type: type }
  });
};
// 报警记录 end
// 跳转至油液
const FunToOil = (val: any) => {
  console.log(val.partId, "部件id");
  router.push({
    path: "/online/expertAnalysis/oilCorrelation/oilAnalyse",
    query: { partId: val.partId }
  });
};
// 2 振动报警记录 start
const ZDAlarmRecord = (val: any) => {
  router.push({
    path: "/online/dataStatistics/alarmStatistics/index",
    query: { partId: val.partId, nodeType: val.PumpStationType }
  });
};
// 振动报警记录 end
// 参数设置(单线，递进)
const myDialog2 = ref();
const IsShowSetTpl = ref(false);
let setParameters = ref();
const beforeClose2 = () => {
  IsShowSetTpl.value = false;
  myDialog2.value.close();
};
// 参数设置(ATL3000)
const myDialog3 = ref();
const ShowSetAtl3k = ref(false);
const beforeClose3 = () => {
  ShowSetAtl3k.value = false;
  myDialog3.value.close();
};
// （双线泵）
const myDialog4 = ref();
const ShowTPL4 = ref(false);
const beforeClose4 = () => {
  ShowTPL4.value = false;
  myDialog4.value.close();
};
// （单独泵）
const myDialog5 = ref();
const ShowTPL5 = ref(false);
const beforeClose5 = () => {
  ShowTPL5.value = false;
  myDialog5.value.close();
};

// 参数设置
const FunSetParameter = (val: any) => {
  setParameters.value = val;
  if (val?.PumpStationType == 3) {
    // ATL3000泵
    ShowSetAtl3k.value = true;
    myDialog3.value.open();
  } else if (val?.PumpStationType == 2) {
    // 双线
    ShowTPL4.value = true;
    myDialog4.value.open();
  } else if (val?.PumpStationType == 5) {
    // 单点泵
    ShowTPL5.value = true;
    myDialog5.value.open();
  } else {
    // 其他（单线，递进）
    IsShowSetTpl.value = true;
    myDialog2.value.open();
  }
};
// 数据统计 --- 路由跳转
// const FunStatistics = (val: any) => {
//   router.push({
//     path: "/online/dataStatistics/LubricationStatistics/LubricationStatistics",
//     query: {
//       partId: val.partId
//     }
//   });
// };

const factorySetting = async val => {
  await useHandleData2(
    pump_OperatePump,
    {
      gatewaySn: val.GatewaySn,
      pumpStationType: val.PumpStationType,
      plcAddress: val.PlcAddress,
      type: val.PumpStationType == 6 ? 10 : 15
    },
    `确认重置该泵`
  );
};
const kaibeng = async val => {
  await useHandleData2(
    pump_OperatePump,
    { gatewaySn: val.GatewaySn, pumpStationType: val.PumpStationType, plcAddress: val.PlcAddress, type: 1 },
    `确认开启该泵`
  );
};
const guanbeng = async val => {
  await useHandleData2(
    pump_OperatePump,
    { gatewaySn: val.GatewaySn, pumpStationType: val.PumpStationType, plcAddress: val.PlcAddress, type: 2 },
    `确认关闭该泵`
  );
};
const dongjie = async val => {
  await useHandleData2(
    pump_OperatePump,
    { gatewaySn: val.GatewaySn, pumpStationType: val.PumpStationType, plcAddress: val.PlcAddress, type: 3 },
    `确认冻结该泵`
  );
};
const jiedong = async val => {
  await useHandleData2(
    pump_OperatePump,
    { gatewaySn: val.GatewaySn, pumpStationType: val.PumpStationType, plcAddress: val.PlcAddress, type: 4 },
    `确认解冻该泵`
  );
};
// 详情(ATL3000)
const ATLDialog = ref();
const IsShowATL3k = ref(false);
const viewDetails = () => {
  IsShowATL3k.value = true;
  ATLDialog.value.open();
};
const closeDialog2 = () => {
  ATLDialog.value.close();
  IsShowATL3k.value = false;
};
// 泵操作 (ATL3000)
const pump_handle = async (type, val) => {
  if (type === "ziDong") {
    await useHandleData2(
      pump_OperatePump,
      { gatewaySn: val.GatewaySn, pumpStationType: val.PumpStationType, plcAddress: val.PlcAddress, type: 1 },
      `确认此操作`
    );
  } else if (type === "fuWei") {
    await useHandleData2(
      pump_OperatePump,
      { gatewaySn: val.GatewaySn, pumpStationType: val.PumpStationType, plcAddress: val.PlcAddress, type: 3 },
      `确认此操作`
    );
  } else if (type === "tingZhi") {
    await useHandleData2(
      pump_OperatePump,
      { gatewaySn: val.GatewaySn, pumpStationType: val.PumpStationType, plcAddress: val.PlcAddress, type: 11 },
      `确认此操作`
    );
  } else if (type === "shouDong") {
    //手动
    // ToSet();
    paramsDatas.value = val;
    dialogVisible.value = true;
  }
};
const dialogVisible = ref(false);
let ruleFormRef = ref();
interface RuleForm {
  startPoint: string;
  endPoint: string;
}
const ruleForm = reactive<RuleForm>({
  startPoint: "",
  endPoint: ""
});
// 必填校验
const rules = reactive<FormRules<RuleForm>>({
  startPoint: [{ required: true, message: "请输入起点", trigger: "blur" }],
  endPoint: [{ required: true, message: "请输入终点", trigger: "blur" }]
});
// 启动 ATL3000
let paramsDatas = ref();
const ToSet = async (formEl: FormInstance) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      useHandleData2(
        pump_OperatePump,
        {
          startPoint: ruleForm.startPoint,
          endPoint: ruleForm.endPoint,
          gatewaySn: paramsDatas.value.GatewaySn,
          pumpStationType: paramsDatas.value.PumpStationType,
          plcAddress: paramsDatas.value.PlcAddress,
          type: 6
        },
        `确认此操作`
      );
      dialogVisible.value = false;
      paramsDatas.value = {};
      ruleForm.startPoint = "";
      ruleForm.endPoint = "";
    } else {
      console.log("error submit!", fields);
    }
  });
};

const handleClose = () => {
  dialogVisible.value = false;
  paramsDatas.value = {};
  ruleForm.startPoint = "";
  ruleForm.endPoint = "";
};
onMounted(() => {
  startTimer();
}),
  // 缓存页面，再次切回时执行
  onActivated(() => {
    startTimer();
  });
// 切走时执行
onDeactivated(() => {
  stopTimer();
});
let timer;
const startTimer = () => {
  timer = setInterval(() => {
    getCardContent();
  }, 5000);
};
const stopTimer = () => {
  // if (timer) {
  clearInterval(timer);
  timer = null;
  // }
};
// 组件卸载时清除定时器
onUnmounted(() => {
  stopTimer();
});
// 调用
getCardContent();
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  .active {
    color: var(--el-button-hover-text-color);
    background-color: var(--el-button-hover-bg-color);
    border-color: var(--el-button-hover-border-color);
    outline: none;
  }
}
.box3 {
  // background-image: linear-gradient(to right, #ffffff, #ffffff), linear-gradient(to right, red, #578aef);
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  border: 5px solid transparent;
  border-radius: 10px;
}
</style>
