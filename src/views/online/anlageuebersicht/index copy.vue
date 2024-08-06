<template>
  <div class="contentBox">
    <!-- 设备预览（单个设备） -->
    <el-container>
      <el-header style="display: flex; align-items: center; justify-content: space-between">
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
      <el-main style="display: flex">
        <div style="align-items: center; width: 60%; height: calc(100% - 20px); overflow-y: auto">
          <el-space style="flex-wrap: nowrap; justify-content: flex-start">
            <el-card v-for="i in cardOptions" :key="i" class="box-card">
              <template #header>
                <div class="card-header" style="display: flex; justify-content: space-between">
                  <!-- 设备名称 -->
                  <span>{{ i.title }}</span>
                  <el-popover ref="popover" placement="right" title="位移" :width="200" trigger="hover" content="10vm">
                    <template #reference>
                      <el-icon style="cursor: pointer"><InfoFilled /></el-icon>
                    </template>
                  </el-popover>
                </div>
              </template>
              <!-- 1.振动 -->
              <div style="color: #009688; text-align: left">轴承振动情况：</div>
              <div v-for="(item, index) in i.zhendongOptions" :key="index">
                <el-popover placement="right" :width="300" trigger="hover">
                  <template #reference>
                    <div style="display: flex; justify-content: space-between">
                      <p style="margin: 5px 0; cursor: pointer">{{ item.name }} :</p>
                      <p style="margin: 5px 0; color: #19be6b">{{ item.value }}</p>
                    </div>
                  </template>
                  <div>
                    <el-button @click="openDialog('基本分析')">基本分析</el-button>
                    <!-- <el-button @click="openDialog('趋势分析')">趋势分析</el-button> -->
                  </div>
                </el-popover>
              </div>
              <!-- 2.润滑监控 -->
              <el-divider />
              <div class="lubClass" v-if="cards?.length && cards[0]?.LubRealData.length > 0">
                <!-- 1 -->
                <div style="display: flex; justify-content: space-between">
                  <div style="color: #009688; text-align: left">润滑监控：</div>
                  <div>
                    <el-button type="primary" @click="FunSetParameter(cards[0])">参数</el-button>
                    <el-button type="primary" @click="FunStatistics(cards[0])">数据统计</el-button>
                    <el-popover placement="right" :width="320" trigger="click">
                      <template #reference>
                        <el-button>操作</el-button>
                      </template>
                      <div>
                        <el-button @click="kaibeng(cards[0])">开泵</el-button>
                        <el-button @click="guanbeng(cards[0])">关泵</el-button>
                        <el-button @click="dongjie(cards[0])">冻结</el-button>
                        <el-button @click="jiedong(cards[0])">解冻</el-button>
                      </div>
                    </el-popover>
                    <el-button type="primary" @click="viewDetails(cards[0])">详情</el-button>
                  </div>
                </div>
                <!-- 2 -->
                <div style="max-height: 200px; overflow-y: auto">
                  <div v-for="(item, index) in cards[0]?.LubRealData" :key="index">
                    <div style="display: flex; justify-content: space-between">
                      <p style="margin: 5px 0">{{ item.name }}</p>
                      <p style="margin: 5px 0; color: #19be6b">{{ item.value }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 分割线 -->
              <el-divider />
              <!-- 3.油液 -->
              <div style="color: #009688; text-align: left">油液状态：</div>
              <div v-for="(item, index) in i.oilState" :key="index">
                <div style="display: flex; justify-content: space-between">
                  <p style="margin: 5px 0">{{ item.name }}:</p>
                  <p style="margin: 5px 0; color: #19be6b">{{ item.num }}</p>
                </div>
              </div>
            </el-card>
          </el-space>
        </div>
        <div style="display: flex; flex: 1; align-items: center; justify-content: center; height: calc(100% - 10px)">
          <img class="equipmentImg" src="@/views/online/anlageuebersicht/images/FengJi.jpg" alt="图片" />
        </div>
      </el-main>
    </el-container>
    <myDialog :title="detailParams.title" ref="myDialog1" draggable width="50%" :before-close="beforeClose1">
      <template #content>
        <analyses v-if="IsShowAdd" ref="addEditRoleRef" :row-data="rowData" :title="detailParams.title" />
      </template>
    </myDialog>
    <!-- 参数设置 -->
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
    <!-- ATL3000 详情 -->
    <myDialog title="ATL3000详情" ref="ATLDialog" draggable width="65%" :before-close="closeDialog2">
      <template #content>
        <ATL3kDetail v-if="IsShowATL3k" ref="ATL3kRef" :part-id="partId" title="ATL3000配置" @close-dialog="closeDialog2" />
      </template>
    </myDialog>
  </div>
</template>

<script lang="ts" setup name="anlageuebersicht">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useHandleData2 } from "@/hooks/useHandleData";
import { getLocationTree } from "@/api/system/functionPosition";
import { equip_card, pump_OperatePump } from "@/api/online/anlageuebersicht";
import myDialog from "@/components/dialog/myDialog.vue";
import analyses from "@/views/online/anlageuebersicht/components/analyses.vue";
import setParameter from "@/views/online/anlageuebersicht/components/setParameter.vue";
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
let cardOptions = [
  {
    title: "变桨输出端",
    zhendongOptions: [
      { name: "振动测点1", value: "0.008mm/s" },
      { name: "振动测点2", value: "0.01mm/s" }
    ],
    pump: [
      { name: "打油次数", num: "108" },
      { name: "温度", num: "38℃" },
      { name: "打油状态", num: "正常" },
      { name: "润滑时间", num: "1分10秒" }
    ],
    // 油液状态
    oilState: [
      { name: "温度", num: "40℃" },
      { name: "动力粘度", num: "200cp" },
      { name: "密度", num: "1000kg/m³" },
      { name: "介电常数", num: "5" },
      { name: "水活性", num: "1aw" },
      { name: "含水量", num: "500ppm" }
    ]
  },
  {
    title: "主轴承输出端",
    zhendongOptions: [
      { name: "振动测点1", value: "0.008mm/s" },
      { name: "振动测点2", value: "0.01mm/s" }
    ],
    pump: [
      { name: "打油次数", num: "108" },
      { name: "温度", num: "38℃" },
      { name: "打油状态", num: "正常" },
      { name: "润滑时间", num: "1分10秒" }
    ],
    // 油液状态
    oilState: [
      { name: "温度", num: "40℃" },
      { name: "动力粘度", num: "200cp" },
      { name: "密度", num: "1000kg/m³" },
      { name: "介电常数", num: "5" },
      { name: "水活性", num: "1aw" },
      { name: "含水量", num: "500ppm" }
    ]
  },
  {
    title: "偏航输出端",
    zhendongOptions: [
      { name: "振动测点1", value: "0.008mm/s" },
      { name: "振动测点2", value: "0.01mm/s" }
    ],
    pump: [
      { name: "打油次数", num: "108" },
      { name: "温度", num: "38℃" },
      { name: "打油状态", num: "正常" },
      { name: "润滑时间", num: "1分10秒" }
    ],
    // 油液状态
    oilState: [
      { name: "温度", num: "40℃" },
      { name: "动力粘度", num: "200cp" },
      { name: "密度", num: "1000kg/m³" },
      { name: "介电常数", num: "5" },
      { name: "水活性", num: "1aw" },
      { name: "含水量", num: "500ppm" }
    ]
  },
  {
    title: "齿轮箱输出端",
    zhendongOptions: [
      { name: "振动测点1", value: "0.008mm/s" },
      { name: "振动测点2", value: "0.01mm/s" }
    ],
    pump: [
      { name: "打油次数", num: "108" },
      { name: "温度", num: "38℃" },
      { name: "打油状态", num: "正常" },
      { name: "润滑时间", num: "1分10秒" }
    ],
    // 油液状态
    oilState: [
      { name: "温度", num: "40℃" },
      { name: "动力粘度", num: "200cp" },
      { name: "密度", num: "1000kg/m³" },
      { name: "介电常数", num: "5" },
      { name: "水活性", num: "1aw" },
      { name: "含水量", num: "500ppm" }
    ]
  },
  {
    title: "发电机输出端",
    zhendongOptions: [
      { name: "振动测点1", value: "0.008mm/s" },
      { name: "振动测点2", value: "0.01mm/s" }
    ],
    pump: [
      { name: "打油次数", num: "108" },
      { name: "温度", num: "38℃" },
      { name: "打油状态", num: "正常" },
      { name: "润滑时间", num: "1分10秒" }
    ],
    // 油液状态
    oilState: [
      { name: "温度", num: "40℃" },
      { name: "动力粘度", num: "200cp" },
      { name: "密度", num: "1000kg/m³" },
      { name: "介电常数", num: "5" },
      { name: "水活性", num: "1aw" },
      { name: "含水量", num: "500ppm" }
    ]
  }
];
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
// 参数设置
const myDialog2 = ref();
const IsShowSetTpl = ref(false);
let setParameters = ref();
const FunSetParameter = (val: any) => {
  setParameters.value = val;
  IsShowSetTpl.value = true;
  myDialog2.value.open();
};
const beforeClose2 = () => {
  IsShowSetTpl.value = false;
  myDialog2.value.close();
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
  margin: 10px;
}
.lubClass > ::-webkit-scrollbar {
  display: none;
}
</style>
