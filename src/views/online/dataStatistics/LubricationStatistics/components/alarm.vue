<template>
  <div class="box">
    <p>近30日趋势统计</p>
    <div id="main2" ref="chartContainer" style="width: 100vw; height: 300px"></div>
    <!-- 表格条件搜索 -->
    <div class="flex flex-wrap gap-4 items-center" style="margin-bottom: 10px">
      <el-date-picker
        v-model="dateRange"
        type="datetimerange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD HH:mm:ss"
      ></el-date-picker>
      <el-button type="primary" @click="searchFun" style="margin-left: 10px">查询</el-button>
      <el-button type="primary" :icon="Download" plain @click="downloadFile">导出报警记录</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" height="500px">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="partName" label="部件名称" />
      <el-table-column prop="alarmMsg" label="报警信息" />
      <el-table-column prop="alarmStartTime" label="报警开始时间" />
      <el-table-column prop="alarmEndTime" label="报警结束时间" />
    </el-table>
    <!-- <el-empty v-if="tableData.length == 0" description="暂无数据" /> -->
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
</template>

<script setup lang="ts" name="alarm">
// 报警记录
import * as echarts from "echarts";
import { onMounted, ref, toRefs } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Download } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";
import { lub_lubAlarmEventPage, lub_lubAlarmTrend } from "@/api/online/anlageuebersicht";
import { export_lubAlarmEventExcel } from "@/api/common";
import dayjs from "dayjs";
const props = defineProps({
  partId: {
    type: String
  }
});
const { partId } = toRefs(props);
console.log(partId?.value);
// 使用 ref 创建响应式数据，用于绑定到 el-date-picker
const dateRange: any = ref([]);
// 获取报警记录
const getHisAlarm = async () => {
  let params = {
    partId: partId?.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    startTime: dateRange.value[0],
    endTime: dateRange.value[1]
  };
  const res: any = await lub_lubAlarmEventPage(params);
  if (res.code == "200") {
    tableData.value = res.data.records;
    total.value = res.data.total;
  } else {
    ElMessage.error(res?.message);
  }
};

const chartContainer = ref();

const searchFun = () => {
  getHisAlarm();
};
// 准备日期数据
let times = ref<any>([]);

// 准备报警次数数据
let dangerNums = ref<any>([]);

// 准备修复次数数据
// let repairCounts = [8, 7, 6, 5];

// 指定图表的配置项和数据
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
    trigger: "axis"
    // axisPointer: {
    //   type: "shadow"
    // }
  },
  legend: {
    data: ["报警"]
  },
  xAxis: {
    type: "category",
    data: times.value
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "报警",
      type: "line",
      data: dangerNums.value
    }
    // {
    //   name: "修复次数",
    //   type: "line",
    //   data: repairCounts
    // }
  ]
};
onMounted(async () => {
  // 使用 Day.js 获取本周的起始和结束日期
  const startOfWeek = dayjs().format("YYYY-MM-DD 00:00:00");
  const endOfWeek = dayjs().format("YYYY-MM-DD 23:59:59");
  dateRange.value[0] = startOfWeek;
  dateRange.value[1] = endOfWeek;
  await getTrend();
  getHisAlarm();
  let chartContainer = echarts.init(document.getElementById("main2"));
  option && chartContainer.setOption(option);
});
// 获取30天报警趋势记录
const getTrend = async () => {
  let res: any = await lub_lubAlarmTrend({ partId: partId?.value });
  if (res.code == "200") {
    if (res.data.length > 0) {
      let arrs: any = res.data;
      // 遍历 objects 数组
      arrs.forEach(obj => {
        dangerNums.value.push(obj?.num);
        times.value.push(obj?.DateTime);
      });
      option.xAxis.data = times.value;
      option.series[0].data = dangerNums.value;
    }
  } else {
    ElMessage.error(res?.message);
  }
};
// table 列表
let tableData = ref([]);
// 分页
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getHisAlarm();
};
const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getHisAlarm();
};
// 导出报警记录列表
const downloadFile = async () => {
  let params = {
    startTime: dateRange.value.length > 0 ? dateRange.value[0] : "",
    endTime: dateRange.value.length > 0 ? dateRange.value[1] : "",
    partId: partId?.value
  };
  if (tableData.value.length > 0) {
    ElMessageBox.confirm("确认导出报警记录?", "温馨提示", { type: "warning" }).then(() =>
      useDownload(export_lubAlarmEventExcel, "报警记录列表", params)
    );
  } else {
    ElMessage.warning("没有可以导出的数据");
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
}
</style>
