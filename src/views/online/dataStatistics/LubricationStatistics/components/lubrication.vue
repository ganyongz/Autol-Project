<template>
  <div class="d-flex flex-column">
    <!-- 1 -->
    <!-- {{ pumpStationType }} -->
    <div class="mb-5" style="margin-bottom: 10px">
      <span>日期: </span>
      <el-date-picker
        style="margin-right: 10px"
        v-model="dateRange"
        type="datetimerange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD HH:mm:ss"
      ></el-date-picker>
      <span v-if="!(pumpStationType == 1 || pumpStationType == 4 || pumpStationType == 5)">润滑点号: </span>
      <el-input
        v-if="!(pumpStationType == 1 || pumpStationType == 4 || pumpStationType == 5)"
        v-model.number="lubPoint"
        style="width: 140px; margin-right: 10px"
        onkeyup="value=value.replace(/[^\d]/g,'')"
        placeholder="请输入整数点位号"
      />
      <el-select
        v-model="status"
        placeholder="请选择状态"
        style="width: 140px; margin-right: 10px"
        v-if="!(pumpStationType == 1 || pumpStationType == 4 || pumpStationType == 5)"
      >
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="searchFun">查询</el-button>
      <el-button type="primary" :icon="Download" plain @click="downloadFile">导出润滑记录</el-button>
    </div>
    <!-- 2 -->
    <div class="d-flex">
      <div class="flex-1 mr-3">
        <div class="gird-box">
          <!-- 日 -->
          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">日</div>
              {{ day.lubCount }}
            </div>
            <div class="mt-2 content-text">今日润滑次数(次)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">日</div>
              {{ day.runS }}
            </div>
            <div class="mt-2 content-text">今日润滑时长(秒)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">日</div>
              {{ day.flowCount }}
            </div>
            <div class="mt-2 content-text">今日润滑油量(ml)</div>
          </div>
          <!-- 周 -->
          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">周</div>
              {{ week.lubCount }}
            </div>
            <div class="mt-2 content-text">本周润滑次数(次)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">周</div>
              {{ week.runS }}
            </div>
            <div class="mt-2 content-text">本周润滑时长(秒)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">周</div>
              {{ week.flowCount }}
            </div>
            <div class="mt-2 content-text">本周润滑油量(ml)</div>
          </div>
          <!-- 月 -->
          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-yellow mr-1">月</div>
              {{ month.lubCount }}
            </div>
            <div class="mt-2 content-text">本月润滑次数(次)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-yellow mr-1">月</div>
              {{ month.runS }}
            </div>
            <div class="mt-2 content-text">本月润滑时长(秒)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-yellow mr-1">月</div>
              {{ month.flowCount }}
            </div>
            <div class="mt-2 content-text">本月润滑油量(ml)</div>
          </div>
          <!-- end -->
        </div>
      </div>
      <div class="flex-1 w-0">
        <div id="main" ref="myChart" class="wh-100" style="height: 300px" />
      </div>
    </div>
    <!-- 3 -->
    <div>
      <el-table
        :data="tableData"
        height="500px"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        empty-text="暂无数据"
      >
        <el-table-column type="index" label="#" width="55" />
        <el-table-column prop="startTime" show-overflow-tooltip label="日期" />
        <!-- <el-table-column prop="endTime" show-overflow-tooltip label="关泵时间" /> -->

        <el-table-column
          prop="pulse_1"
          show-overflow-tooltip
          label="1#分配器脉冲"
          v-if="pumpStationType == 1 || pumpStationType == 4 || pumpStationType == 5"
        />
        <el-table-column
          prop="pulse_2"
          show-overflow-tooltip
          label="2#分配器脉冲"
          v-if="pumpStationType == 1 || pumpStationType == 4 || pumpStationType == 5"
        />
        <el-table-column
          prop="pulse_3"
          show-overflow-tooltip
          label="3#分配器脉冲"
          v-if="pumpStationType == 1 || pumpStationType == 4 || pumpStationType == 5"
        />
        <el-table-column
          prop="pulse_4"
          show-overflow-tooltip
          label="4#分配器脉冲"
          v-if="pumpStationType == 1 || pumpStationType == 4 || pumpStationType == 5"
        />

        <!-- <el-table-column prop="lubCount" show-overflow-tooltip label="润滑次数" /> -->
        <el-table-column
          prop="lubPoint"
          show-overflow-tooltip
          label="润滑点号"
          v-if="!(pumpStationType == 1 || pumpStationType == 4 || pumpStationType == 5)"
        />
        <el-table-column prop="runTime" show-overflow-tooltip label="润滑时长(s)" />
        <el-table-column prop="lubFlow" show-overflow-tooltip label="润滑油量(ml)" />
        <el-table-column prop="forewardTime" show-overflow-tooltip label="正传时间" v-if="pumpStationType == 2" />
        <el-table-column prop="reversalTime" show-overflow-tooltip label="反转时间" v-if="pumpStationType == 2" />
        <el-table-column prop="status" show-overflow-tooltip label="润滑状态">
          <template #default="scope">
            <!-- 0 正常 1故障  2堵塞  4油量不足  8通信失败 -->
            <el-tag v-if="scope.row.status == 1" type="danger" disable-transitions>故障</el-tag>
            <el-tag v-else-if="scope.row.status == 2" type="danger" disable-transitions>堵塞</el-tag>
            <el-tag v-else-if="scope.row.status == 4" type="danger" disable-transitions>油量不足</el-tag>
            <el-tag v-else-if="scope.row.status == 8" type="danger" disable-transitions>通信失败</el-tag>
            <el-tag v-else type="success" disable-transitions>正常</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="lubrication">
// 润滑记录
import * as echarts from "echarts";
import { onMounted, ref, toRefs } from "vue";
import { lub_LubRecordByPage, lub_lubStatistics, lub_lubTrend } from "@/api/online/anlageuebersicht";
import { ElMessage, ElMessageBox } from "element-plus";
import { Download } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";
import { export_recordExcel } from "@/api/common";
import dayjs from "dayjs";
const props = defineProps({
  partId: {
    type: String
  },
  pumpStationType: {
    type: Number
  }
});
const { partId, pumpStationType } = toRefs(props);
// console.log(pumpStationType?.value, "pumpStationType---");
// 状态筛选
let status = ref("");
let statusOptions = [
  {
    value: "",
    label: "全部"
  },
  {
    value: "0",
    label: "正常"
  },
  {
    value: "1",
    label: "故障"
  },
  {
    value: "2",
    label: "堵塞"
  },
  {
    value: "4",
    label: "油量不足"
  },
  {
    value: "8",
    label: "通讯失败"
  }
];
// 润滑统计
let lubPoint = ref<number>();
let week = ref({
  lubCount: 0,
  flowCount: 0,
  runS: 0
});
let month = ref({
  lubCount: 0,
  flowCount: 0,
  runS: 0
});
let day = ref({
  lubCount: 0,
  flowCount: 0,
  runS: 0
});
// 数据统计
const getlubStatistics = async () => {
  let params = {
    lubPoint: lubPoint.value,
    partId: partId?.value
  };
  const res: any = await lub_lubStatistics(params);
  if (res.code == "200") {
    day.value = res.data.day;
    month.value = res.data.month;
    week.value = res.data.week;
  } else {
    ElMessage.error(res?.message);
  }
};
// 获取润滑记录列表
const getLubRecord = async () => {
  let params = {
    startTime: dateRange.value.length > 0 ? dateRange.value[0] : "",
    endTime: dateRange.value.length > 0 ? dateRange.value[1] : "",
    partId: partId?.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    lubPoint: lubPoint.value,
    status: status.value
  };
  const res: any = await lub_LubRecordByPage(params);
  if (res.code == "200") {
    tableData.value = res.data.data;
    total.value = res.data.count;
  } else {
    ElMessage.error(res?.message);
  }
};

let startOfWeek = ref();
let endOfWeek = ref();
// 使用 ref 创建响应式数据，用于绑定到 el-date-picker
let dateRange: any = ref([]);
const searchFun = () => {
  getLubRecord();
  getlubStatistics();
  getlubTrend();
};
// 趋势图数据
let data1 = ref();
let data2 = ref();
let data3 = ref();
const getlubTrend = async () => {
  let params = {
    // partId: 130,
    partId: partId?.value,
    startTime: dateRange.value[0],
    endTime: dateRange.value[1],
    lubPoint: lubPoint.value,
    status: status.value
  };
  const res: any = await lub_lubTrend(params);
  if (res.code === 200) {
    let data = res.data;
    if (data.length > 0) {
      data1.value = data.map((item: any) => item.lubFlow);
      data2.value = data.map((item: any) => item.status);
      data3.value = data.map((item: any) => item.time);
    } else {
      data1.value = [];
      data2.value = [];
      data3.value = [];
    }
  } else {
    ElMessage.error(res?.message);
  }
};
// 基于准备好的dom，初始化echarts实例
onMounted(async () => {
  startOfWeek.value = dayjs().format("YYYY-MM-DD 00:00:00");
  endOfWeek.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
  dateRange.value[0] = startOfWeek.value;
  dateRange.value[1] = endOfWeek.value;
  if (partId?.value) {
    // 调用
    getlubStatistics();
    getLubRecord();
  }
  await getlubTrend();
  let option = {
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ],
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        let result = params[0].name + "<br/>";
        params.forEach(function (item) {
          if (item.seriesName == "状态") {
            result += item.marker + item.seriesName + ": " + (item.value == 1 ? "启动" : "停止") + "<br/>";
          } else {
            result += item.marker + item.seriesName + ": " + item.value + "<br/>";
          }
        });
        return result;
      }
    },
    legend: {
      data: ["状态", "润滑油量"]
    },
    xAxis: {
      type: "category",
      data: data3.value
      // data: ["08:15:48", "10:15:48", "12:15:48", "14:15:48"]
    },
    yAxis: [
      {
        type: "value",
        name: "状态",
        min: 0,
        max: 2,
        interval: 1,
        axisLabel: {
          formatter: function (value: Number) {
            if (value === 0) {
              return "停用";
            } else if (value === 1) {
              return "启用";
            }
          }
        }
      },
      {
        type: "value",
        name: "润滑油量:ml",
        position: "right",
        axisLabel: {
          formatter: "{value}"
        }
      }
    ],
    series: [
      {
        name: "状态",
        type: "line",
        yAxisIndex: 0,
        smooth: false,
        data: data2.value
        // data: [1, 1, 0, 1] // 这里的数据代表状态，0代表停止，1代表启用
      },
      {
        name: "润滑油量",
        type: "bar",
        yAxisIndex: 1,
        data: data1.value,
        barWidth: 5 //柱状条宽
        //data: [80, 70, 60, 50] // 这里的数据代表润滑油量，单位根据实际情况设置
      }
    ]
  };
  let myChart = echarts.init(document.getElementById("main"));
  option && myChart.setOption(option);
});
// table 列表
let tableData = ref([]);
// 分页
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getLubRecord();
};
const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getLubRecord();
};
// 导出润滑记录列表
const downloadFile = async () => {
  let params = {
    startTime: dateRange.value.length > 0 ? dateRange.value[0] : "",
    endTime: dateRange.value.length > 0 ? dateRange.value[1] : "",
    partId: partId?.value,
    lubPoint: lubPoint.value,
    status: status.value
  };
  if (tableData.value.length > 0) {
    ElMessageBox.confirm("确认导出润滑记录?", "温馨提示", { type: "warning" }).then(() =>
      useDownload(export_recordExcel, "润滑记录列表", params)
    );
  } else {
    ElMessage.warning("没有可以导出的数据");
  }
};
</script>

<style lang="scss" scoped>
.d-flex {
  display: flex;
}
.flex-column {
  flex-direction: column;
}

// 卡片
.gird-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 6px;
  .grid-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border: 1px solid rgb(114 128 131 / 20%);
    .content-text {
      font-size: 12px;
      color: #c1c1c1;
    }
  }
  .align-items-center {
    align-items: center;
    font-size: 20px;
    .date-card {
      width: 16px;
      height: 16px;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      border-radius: 2px;
    }
    .data-card-blue {
      background-color: #409eff;
    }
    .data-card-yellow {
      background-color: #ac40ff;
    }
    .bgColor-month {
      background-color: red;
    }
  }
}
.flex-1 {
  flex: 1;
}

// 分页
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>
