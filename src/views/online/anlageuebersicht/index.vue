<template>
  <div class="contentBox">
    <!-- 设备预览（单个设备） -->
    <el-container>
      <el-header style="display: flex; align-items: center; justify-content: space-between">
        <el-icon @click="comeBackCompany" style="margin-left: 10px; cursor: pointer"><ArrowLeftBold /></el-icon>
        <div>xxxx设备</div>
        <div style="display: flex">
          <p style="margin-right: 20px">综合分析：<span style="color: aqua">良好</span></p>
          <p>智能诊断：<span style="color: aqua">正常</span></p>
        </div>
      </el-header>
      <el-main style="display: flex">
        <div style="width: 60%; height: calc(100% - 20px); overflow-x: auto; text-align: center">
          <el-space wrap style="justify-content: flex-start">
            <el-card v-for="i in 5" :key="i" class="box-card">
              <template #header>
                <div class="card-header" style="display: flex; justify-content: space-between">
                  <span>轴承输出端</span>
                  <el-popover ref="popover" placement="right" title="位移" :width="200" trigger="hover" content="10vm">
                    <template #reference>
                      <el-icon style="cursor: pointer"><InfoFilled /></el-icon>
                    </template>
                  </el-popover>
                </div>
              </template>
              <div style="color: #009688; text-align: left">轴承振动情况：</div>
              <div v-for="o in 2" :key="o">
                <el-popover placement="right" :width="300" trigger="hover">
                  <template #reference>
                    <div style="display: flex; justify-content: space-between">
                      <p style="cursor: pointer">{{ "振动测点 " + o }} :</p>
                      <p style="color: #19be6b">0.08mm/s</p>
                    </div>
                  </template>
                  <div>
                    <el-button @click="openDialog('基本分析')">基本分析</el-button>
                    <el-button @click="openDialog('趋势分析')">趋势分析</el-button>
                  </div>
                </el-popover>
              </div>
              <!-- 润滑监控 -->
              <el-divider />
              <div style="display: flex; justify-content: space-between">
                <div style="color: #009688; text-align: left">润滑监控：</div>
                <div>
                  <el-button size="small" type="primary" @click="FunSetParameter">参数</el-button>
                  <el-button size="small" type="primary" @click="FunStatistics">数据统计</el-button>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between">
                  <p>打油次数:</p>
                  <p style="color: #19be6b">108</p>
                </div>
                <div style="display: flex; justify-content: space-between">
                  <p>温度:</p>
                  <p style="color: #19be6b">38℃</p>
                </div>
                <div style="display: flex; justify-content: space-between">
                  <p>打油状态:</p>
                  <p style="color: #19be6b">正常</p>
                </div>
                <div style="display: flex; justify-content: space-between">
                  <p>润滑时间:</p>
                  <p style="color: #19be6b">1分10秒</p>
                </div>
              </div>

              <!-- 分割线 -->
              <el-divider />
              <div style="color: #009688; text-align: left">油液状态：</div>
              <div>
                <div style="display: flex; justify-content: space-between">
                  <p>温度:</p>
                  <p style="color: #19be6b">32℃</p>
                </div>
                <div style="display: flex; justify-content: space-between">
                  <p>水分:</p>
                  <p style="color: #19be6b">2</p>
                </div>
                <div style="display: flex; justify-content: space-between">
                  <p>FE含量:</p>
                  <p style="color: #19be6b">60%</p>
                </div>
              </div>
            </el-card>
          </el-space>
        </div>
        <div style="flex: 1; height: calc(100% - 10px)">
          <img width="100%" height="100%" src="@/views/online/anlageuebersicht/images/FengJi.jpg" alt="图片" />
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
        <setParameter v-if="IsShowSetTpl" ref="setParameterRef" @close-dialog="beforeClose2" title="参数设置" />
      </template>
    </myDialog>
    <!-- 数据统计 -->
    <myDialog title="数据统计" ref="myDialog3" draggable width="90%" :before-close="beforeClose3">
      <template #content>
        <dataStatistics v-if="IsShowDataTpl" ref="setParameterRef" @close-dialog="beforeClose3" title="数据统计" />
      </template>
    </myDialog>
  </div>
</template>

<script lang="ts" setup name="anlageuebersicht">
import { ref } from "vue";
// import { ElMessage } from "element-plus";
// import { equip_card, equip_equipInfo } from "@/api/online/anlageuebersicht";
import myDialog from "@/components/dialog/myDialog.vue";
import analyses from "@/views/online/anlageuebersicht/components/analyses.vue";
import setParameter from "@/views/online/anlageuebersicht/components/setParameter.vue";
import dataStatistics from "@/views/online/anlageuebersicht/components/dataStatistics.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const comeBackCompany = () => {
  router.back();
};
// open ------ 开始
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
  detailParams.value.title = title;
  IsShowAdd.value = true;
  rowData.value = {};
  myDialog1.value.open();
};
// close------ 关闭
// 参数设置
const myDialog2 = ref();
const IsShowSetTpl = ref(false);
const FunSetParameter = () => {
  IsShowSetTpl.value = true;
  myDialog2.value.open();
};
const beforeClose2 = () => {
  IsShowSetTpl.value = false;
  myDialog2.value.close();
};
// 数据统计
const myDialog3 = ref();
const IsShowDataTpl = ref(false);
const FunStatistics = () => {
  IsShowDataTpl.value = true;
  myDialog3.value.open();
};
const beforeClose3 = () => {
  IsShowDataTpl.value = false;
  myDialog3.value.close();
};
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
  width: calc(33.333% - 20px);
}

@media (width <= 1680px) {
  :deep(.el-space__item) {
    width: calc(50% - 20px);
    margin-bottom: 10px;
  }
}

@media (width <= 768px) {
  :deep(.el-space__item) {
    width: 100%;
    margin-bottom: 10px;
  }
}
.box-card {
  margin: 10px;
}
</style>
