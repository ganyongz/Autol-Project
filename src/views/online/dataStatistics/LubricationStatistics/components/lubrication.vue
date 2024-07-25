<template>
  <div class="d-flex flex-column">
    <!-- 1 -->
    <div class="mb-5" style="margin-bottom: 10px">
      <el-date-picker
        v-model="timeSearch"
        type="daterange"
        range-separator="至"
        start-placeholder="Start date"
        end-placeholder="End date"
      />
      <el-button type="primary">查询</el-button>
    </div>
    <!-- 2 -->
    <div class="d-flex">
      <div class="flex-1 mr-3">
        <div class="gird-box">
          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">日</div>
              0
            </div>
            <div class="mt-2 content-text">今日润滑次数(次)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">日</div>
              0
            </div>
            <div class="mt-2 content-text">今日润滑次数(次)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">日</div>
              0
            </div>
            <div class="mt-2 content-text">今日润滑次数(次)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">周</div>
              0
            </div>
            <div class="mt-2 content-text">本周润滑次数(次)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">周</div>
              0
            </div>
            <div class="mt-2 content-text">本周润滑次数(次)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-blue mr-1">周</div>
              0
            </div>
            <div class="mt-2 content-text">本周润滑次数(次)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-yellow mr-1">月</div>
              0
            </div>
            <div class="mt-2 content-text">本月润滑次数(次)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-yellow mr-1">月</div>
              0
            </div>
            <div class="mt-2 content-text">本月润滑次数(次)</div>
          </div>

          <div class="grid-cell">
            <div class="d-flex align-items-center">
              <div class="date-card data-card-yellow mr-1">月</div>
              0
            </div>
            <div class="mt-2 content-text">本月润滑次数(次)</div>
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
      <el-table :data="tableData" height="500px">
        <el-table-column type="index" label="#" width="55" />
        <el-table-column prop="name" label="开泵时间" />
        <el-table-column prop="state" label="关泵时间" />
        <el-table-column prop="time" label="润滑点" />
        <el-table-column prop="time" label="润滑时常(s)" />
        <el-table-column prop="time" label="润滑油量(ml)" />
        <el-table-column prop="time" label="润滑状态" />
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
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
import { onMounted, ref } from "vue";
const timeSearch = ref("");
// 基于准备好的dom，初始化echarts实例
onMounted(() => {
  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      data: ["状态", "剩余油量"]
    },
    xAxis: {
      type: "category",
      data: ["08:15:48", "10:15:48", "12:15:48", "14:15:48"]
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
        name: "剩余油量:ml",
        position: "right",
        axisLabel: {
          formatter: "{value}"
        }
      }
    ],
    series: [
      {
        name: "状态",
        type: "bar",
        yAxisIndex: 0,
        data: [1, 1, 0, 1] // 这里的数据代表状态，0代表停止，1代表启用
      },
      {
        name: "剩余油量",
        type: "bar",
        yAxisIndex: 1,
        data: [80, 70, 60, 50] // 这里的数据代表剩余油量，单位根据实际情况设置
      }
    ]
  };
  let myChart = echarts.init(document.getElementById("main"));
  option && myChart.setOption(option);
});
// table 列表
let tableData = ref([]);
// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
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
