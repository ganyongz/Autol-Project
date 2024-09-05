<template>
  <div class="box">
    <div style="width: 65%; height: 100%">
      <div style="width: 70%; height: 70%; margin: 0 auto">
        <!-- <el-image style="width: 100px; height: 100px" :initial-index="4" fit="cover" src="../images/equipment.png" /> -->
        <img style="width: 100%; height: 60%" src="../images/equipment.png" alt="工艺图" />
      </div>
    </div>
    <!-- 右侧卡片 -->
    <div style="flex: 1; height: 100%">
      <!-- 1.振动 -->
      <dv-border-box10 v-if="cards?.VibRealData && cards?.VibRealData.length > 0" style="margin-bottom: 20px">
        <div style="display: flex; justify-content: space-between; padding: 10px 20px 0">
          <div style="padding: 10px 20px 0; color: #009688; text-align: left">轴承振动情况：</div>
          <el-button size="small" type="primary" @click="ZDAlarmRecord(cards)">报警记录</el-button>
        </div>
        <div style="height: 10rem; padding: 20px; overflow-y: auto">
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
      </dv-border-box10>
      <!-- 2.润滑监控 -->
      <dv-border-box10 v-if="cards?.LubRealData && cards?.LubRealData.length > 0">
        <!-- 标题头 -->
        <div style="padding: 10px 20px 0">
          <div style="color: #009688; text-align: left">润滑监控：</div>
          <div>
            <el-button size="small" type="primary" @click="FunSetParameter(cards)">参数</el-button>
            <!-- <el-button size="small" type="primary" @click="FunStatistics(cards)">数据统计</el-button> -->
            <el-popover placement="right" :width="320" trigger="click">
              <template #reference>
                <el-button size="small">操作</el-button>
              </template>
              <!-- 非ATL3000 -->
              <div v-if="cards.PumpStationType != 3">
                <el-button size="small" @click="kaibeng(cards)">开泵</el-button>
                <el-button size="small" @click="guanbeng(cards)">关泵</el-button>
                <el-button size="small" @click="dongjie(cards)">冻结</el-button>
                <el-button size="small" @click="jiedong(cards)">解冻</el-button>
              </div>
              <!-- ATL3000操作 -->
              <div v-if="cards.PumpStationType == 3">
                <el-button size="small" @click="pump_handle('ziDong', cards)">自动</el-button>
                <el-button size="small" @click="pump_handle('shouDong', cards)">手动</el-button>
                <el-button size="small" @click="pump_handle('fuWei', cards)">复位</el-button>
                <el-button size="small" @click="pump_handle('tingZhi', cards)">停止</el-button>
              </div>
            </el-popover>
            <el-button size="small" type="primary" @click="viewDetails()">详情</el-button>
            <el-button size="small" type="primary" @click="FunAlarmRecord(cards, 'lubrication')">润滑记录</el-button>
            <el-button size="small" type="primary" @click="FunAlarmRecord(cards, 'alarm')">报警记录</el-button>
          </div>
        </div>
        <!-- 润滑信息 -->
        <div style="height: 10rem; padding: 20px; overflow-y: auto">
          <div v-for="(item, index) in cards?.LubRealData" :key="index">
            <div style="display: flex; justify-content: space-between">
              <p style="margin: 5px 0">{{ item.name }}</p>
              <p style="margin: 5px 0; color: #19be6b">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </dv-border-box10>
      <!-- 3.油液 -->
      <dv-border-box10 v-if="cards?.OilRealData && cards?.OilRealData.length > 0">
        <!-- <div style="height: 10rem; padding: 20px; overflow-y: auto"> -->
        <div style="display: flex; justify-content: space-between; padding: 10px 20px 0">
          <div style="padding: 10px 20px 0; color: #009688; text-align: left">油液状态：</div>
          <el-button size="small" type="primary" @click="FunAlarmRecord(cards, 'alarm')">报警记录</el-button>
        </div>
        <div style="height: 10rem; padding: 20px; overflow-y: auto">
          <div v-for="(item, index) in cards?.OilRealData" :key="index">
            <div style="display: flex; justify-content: space-between">
              <p style="margin: 5px 0">{{ item.name }}:</p>
              <p style="margin: 5px 0; color: #19be6b">{{ item.value }}</p>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </dv-border-box10>
      <el-empty
        v-if="
          !(
            (cards?.VibRealData && cards?.VibRealData.length > 0) ||
            (cards?.LubRealData && cards?.LubRealData.length > 0) ||
            (cards?.OilRealData && cards?.OilRealData.length > 0)
          )
        "
        description="暂无数据记录"
      />
    </div>

    <!-- 基本分析 -->
    <myDialog :title="detailParams.title" ref="myDialog1" draggable width="50%" :before-close="beforeClose1">
      <template #content>
        <analyses v-if="IsShowAdd" ref="addEditRoleRef" :row-data="rowData" :title="detailParams.title" />
      </template>
    </myDialog>
    <!-- 参数设置(普通泵) -->
    <myDialog title="参数设置" ref="myDialog2" draggable width="30%" :before-close="beforeClose2">
      <template #content>
        <setParameter
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
import { ref, reactive, toRefs, onUnmounted, nextTick } from "vue";
import { ElMessage, type FormRules, type FormInstance } from "element-plus";
import { equip_partRealData, pump_OperatePump } from "@/api/online/anlageuebersicht";
import { useHandleData2 } from "@/hooks/useHandleData";
import myDialog from "@/components/dialog/myDialog.vue";
import analyses from "@/views/online/anlageuebersicht/components/analyses.vue";
import setParameter from "@/views/online/anlageuebersicht/components/setParameter.vue";
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
console.log(partId?.value);
//获取页面卡片
let cards = ref();
const getCardContent = async () => {
  const res: any = await equip_partRealData({ partId: partId?.value });
  if (res.code == "200") {
    nextTick(() => {
      cards.value = res.data;
    });
    // console.log(cards.value, "卡片");
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
// 2 振动报警记录 start
const ZDAlarmRecord = (val: any) => {
  router.push({
    path: "/online/dataStatistics/alarmStatistics/index",
    query: { partId: val.partId, nodeType: val.PumpStationType }
  });
};
// 振动报警记录 end
const myDialog3 = ref();
// 参数设置(普通泵)
const myDialog2 = ref();
const IsShowSetTpl = ref(false);
let setParameters = ref();
// 公用方法
const FunSetParameter = (val: any) => {
  setParameters.value = val;
  if (val?.PumpStationType == 3) {
    // ATL3000
    ShowSetAtl3k.value = true;
    myDialog3.value.open();
  } else {
    // 其他
    IsShowSetTpl.value = true;
    myDialog2.value.open();
  }
};
const beforeClose2 = () => {
  IsShowSetTpl.value = false;
  myDialog2.value.close();
};
// 参数设置(ATL3000)

const ShowSetAtl3k = ref(false);
const beforeClose3 = () => {
  ShowSetAtl3k.value = false;
  myDialog3.value.close();
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
      { gatewaySn: val.GatewaySn, pumpStationType: val.PumpStationType, plcAddress: val.PlcAddress, type: 8 },
      `确认此操作`
    );
  } else if (type === "fuWei") {
    await useHandleData2(
      pump_OperatePump,
      { gatewaySn: val.GatewaySn, pumpStationType: val.PumpStationType, plcAddress: val.PlcAddress, type: 10 },
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
          type: 9
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
// 创建一个定时器引用
let timer: any;
// 设置定时器，每 5 秒请求一次数据
timer = setInterval(getCardContent, 5000);
// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
// 调用
getCardContent();
</script>

<style lang="scss" scoped>
.box {
  display: flex;
}
.aaa {
  background-image: url("@/views/online/dataStatistics/LubricationStatistics/images/borderThree.png");
  background-repeat: round;
}
</style>
