<template>
  <div class="contentBox" v-cloak>
    <!-- 设备预览（单个设备） -->
    <el-container>
      <el-header style="display: flex; align-items: center; justify-content: space-between" v-cloak>
        <div>
          <el-icon @click="comeBackCompany" style="margin-left: 10px; cursor: pointer"><ArrowLeftBold /></el-icon>
          <el-tree-select
            v-model="selectVal"
            :data="selectDatas"
            :render-after-expand="false"
            node-key="id"
            :props="defaultProps"
            style="width: 240px"
            clearable
            @change="changeVal"
          />
        </div>
        <div>xxxx设备</div>
        <div style="display: flex">
          <p style="margin-right: 20px">综合分析：<span style="color: aqua">良好</span></p>
          <p>智能诊断：<span style="color: aqua">正常</span></p>
        </div>
      </el-header>
      <el-main style="display: flex" v-cloak>
        <div style="align-items: center; width: 100%; height: calc(100% - 20px); overflow-y: auto" v-cloak>
          <el-space style="flex-wrap: nowrap; justify-content: flex-start">
            <el-card v-for="outItem in cards" :key="outItem" class="box-card" :style="{ height: bodyHeight - 350 + 'px' }">
              <template #header>
                <div class="card-header" style="display: flex; justify-content: space-between">
                  <!-- 设备名称(顶部标题) -->
                  <span>{{ outItem.partName }}</span>
                  <!-- 暂时注释(勿删) -->
                  <!-- <el-popover ref="popover" placement="right" title="位移" :width="200" trigger="hover" content="10vm">
                    <template #reference>
                      <el-icon style="cursor: pointer"><InfoFilled /></el-icon>
                    </template>
                  </el-popover> -->
                </div>
              </template>
              <!-- 1.振动 -->
              <div v-if="outItem.VibRealData && outItem.VibRealData.length > 0">
                <div style="color: #009688; text-align: left">轴承振动情况：</div>
                <div v-for="(item, index) in outItem.VibRealData" :key="index">
                  <el-popover placement="right" :width="300" trigger="hover">
                    <template #reference>
                      <div style="display: flex; justify-content: space-between">
                        <p style="margin: 5px 0; cursor: pointer">{{ item.pointName }} :</p>
                        <p style="margin: 5px 0; color: #19be6b">{{ item.value }}</p>
                      </div>
                    </template>
                    <div>
                      <el-button @click="openDialog('基本分析')">基本分析</el-button>
                      <!-- <el-button @click="openDialog('趋势分析')">趋势分析</el-button> -->
                    </div>
                  </el-popover>
                </div>
              </div>
              <el-divider
                v-if="
                  outItem.VibRealData && outItem.VibRealData.length > 0 && outItem?.LubRealData && outItem?.LubRealData.length > 0
                "
              />
              <!-- 2.润滑监控 -->
              <div class="lubClass" v-if="outItem?.LubRealData && outItem?.LubRealData.length > 0">
                <!-- 1 -->
                <div style="display: flex; justify-content: space-between">
                  <div style="color: #009688; text-align: left">润滑监控：</div>
                  <div>
                    <el-button type="primary" @click="FunSetParameter(outItem)">参数</el-button>
                    <el-button type="primary" @click="FunStatistics(outItem)">数据统计</el-button>
                    <el-popover placement="right" :width="320" trigger="click">
                      <template #reference>
                        <el-button>操作</el-button>
                      </template>
                      <!-- 非ATL3000 -->
                      <div v-if="outItem.PumpStationType != 3">
                        handle
                        <el-button @click="kaibeng(outItem)">开泵</el-button>
                        <el-button @click="guanbeng(outItem)">关泵</el-button>
                        <el-button @click="dongjie(outItem)">冻结</el-button>
                        <el-button @click="jiedong(outItem)">解冻</el-button>
                      </div>
                      <!-- ATL3000操作 -->
                      <div v-if="outItem.PumpStationType == 3">
                        <el-button @click="pump_handle('ziDong', outItem)">自动</el-button>
                        <el-button @click="pump_handle('shouDong', outItem)">手动</el-button>
                        <el-button @click="pump_handle('fuWei', outItem)">复位</el-button>
                        <el-button @click="pump_handle('tingZhi', outItem)">停止</el-button>
                      </div>
                    </el-popover>
                    <el-button type="primary" @click="viewDetails(outItem)">详情</el-button>
                  </div>
                </div>
                <!-- 2 -->
                <div style="overflow-y: auto">
                  <div v-for="(item, index) in outItem?.LubRealData" :key="index">
                    <div style="display: flex; justify-content: space-between">
                      <p style="margin: 5px 0">{{ item.name }}</p>
                      <p style="margin: 5px 0; color: #19be6b">{{ item.value }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <el-divider
                v-if="
                  outItem?.LubRealData && outItem?.LubRealData.length > 0 && outItem.OilRealData && outItem.OilRealData.length > 0
                "
              />
              <!-- 3.油液 -->
              <div v-if="outItem.OilRealData && outItem.OilRealData.length > 0">
                <div style="color: #009688; text-align: left">油液状态：</div>
                <div v-for="(item, index) in outItem.OilRealData" :key="index">
                  <div style="display: flex; justify-content: space-between">
                    <p style="margin: 5px 0">{{ item.name }}:</p>
                    <p style="margin: 5px 0; color: #19be6b">{{ item.value }}</p>
                  </div>
                </div>
              </div>
            </el-card>
          </el-space>
        </div>
        <!-- 右侧图 -->
        <!-- <div style="display: flex; flex: 1; align-items: center; justify-content: center; height: calc(100% - 10px)">
          <img class="equipmentImg" src="@/views/online/anlageuebersicht/images/FengJi.jpg" alt="图片" />
        </div> -->
      </el-main>
    </el-container>
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
    <myDialog title="参数设置" ref="myDialog3" draggable width="30%" :before-close="beforeClose3">
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

<script lang="ts" setup name="anlageuebersicht">
// 设备总览
import { ref, onMounted, onDeactivated, onActivated, reactive } from "vue";
import { ElMessage, type FormRules, type FormInstance } from "element-plus";
import { useHandleData2 } from "@/hooks/useHandleData";
import { getLocationTree } from "@/api/system/functionPosition";
import { equip_card, pump_OperatePump } from "@/api/online/anlageuebersicht";
import myDialog from "@/components/dialog/myDialog.vue";
import analyses from "@/views/online/anlageuebersicht/components/analyses.vue";
import setParameter from "@/views/online/anlageuebersicht/components/setParameter.vue";
import setAtl3k from "@/views/online/anlageuebersicht/components/setAtl3k.vue";
import ATL3kDetail from "@/views/online/anlageuebersicht/components/ATL3kDetail.vue";
// import dataStatistics from "@/views/online/anlageuebersicht/components/dataStatistics.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const comeBackCompany = () => {
  router.back();
};
const defaultProps = {
  children: "children",
  label: "name",
  id: "id"
};
let selectVal = ref();
let selectDatas: any = ref([]);
// 切换设备
const changeVal = (val: any) => {
  equip_id.value = val;
  getCardContent();
};
// 获取菜单列表
const getEquipListFun = async () => {
  let res: any = await getLocationTree({ type: 2, range: 9 });
  if (res.code == "200") {
    selectDatas.value = res.data as any;
  } else {
    ElMessage.error(res?.mssage);
  }
};
getEquipListFun();

// open - 开始
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
const openDialog = (title: string) => {
  console.log(title);
  //路由跳转
  router.push("/online/expertAnalysis/comprehensiveAnalysis/index");
};
// close - 关闭
// 参数设置(普通泵)
const myDialog2 = ref();
const IsShowSetTpl = ref(false);
let setParameters = ref();
// 公用方法
const FunSetParameter = (val: any) => {
  console.log(val, "9999");
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
const myDialog3 = ref();
const ShowSetAtl3k = ref(false);
const beforeClose3 = () => {
  ShowSetAtl3k.value = false;
  myDialog3.value.close();
};
// 数据统计
const FunStatistics = (val: any) => {
  //路由跳转
  router.push({
    path: "/online/dataStatistics/LubricationStatistics/LubricationStatistics",
    query: {
      partId: val.partId
    }
  });
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
//获取页面卡片
let cards = ref();
let equip_id = ref("834ff0707e2b4133ae982f4e7b6d2232");
const getCardContent = async () => {
  const res: any = await equip_card({ equipId: equip_id.value });
  if (res.code == "200") {
    cards.value = res.data;
    // console.log(cards.value, "卡片");
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 详情(ATL3000)
let partId = ref();
const ATLDialog = ref();
const IsShowATL3k = ref(false);
const viewDetails = (val: any) => {
  console.log(val);
  partId.value = val?.partId;
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
let bodyHeight = ref(500);
let intervalId = ref(); //定时器
onMounted(() => {
  // 获取body的窗口高度
  bodyHeight.value = document.body.clientHeight;
});
onActivated(() => {
  // 当组件挂载后开始定时器
  intervalId.value = setInterval(() => {
    // 调用获取数据的接口方法
    getCardContent();
  }, 5000);
});
onDeactivated(() => {
  // 当组件卸载前清除定时器
  clearInterval(intervalId.value);
});
getCardContent();
</script>
<style scoped lang="scss">
.contentBox {
  box-sizing: border-box;
  width: 100%;
  height: calc(100%);
  padding: 20px;
  overflow-x: hidden;
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}
.el-container.is-vertical {
  height: 100%;
}
:deep(.el-space__item) {
  width: calc(34% - 20px);
  min-width: 465px;
  height: 100%;

  // width: 464px;
}
.equipmentImg {
  background-size: contain;
}

@media (width <= 1440px) {
  :deep(.el-space__item) {
    width: calc(50% - 20px);
    min-width: 465px;
    height: 100%;
    margin-bottom: 10px;
  }
  .equipmentImg {
    width: 100%;
  }
}

@media (width <= 768px) {
  :deep(.el-space__item) {
    width: 100%;
    min-width: 400px;
    height: 100%;
    margin-bottom: 10px;
  }
  .equipmentImg {
    // width: 80%;
  }
}
.box-card {
  // height: var(bodyHeight);
  margin: 10px;

  // border: 1px solid red;
}
.lubClass > ::-webkit-scrollbar {
  display: none;
}
[v-cloak] {
  display: none !important;
}
</style>
