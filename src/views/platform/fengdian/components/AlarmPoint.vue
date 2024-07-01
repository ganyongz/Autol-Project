<template>
  <div ref="chartDom" class="chartDom"></div>
</template>

<script lang="ts" setup name="AlarmPoint">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
let chartDom = ref();
let scale = 1;
let echartData = [
  {
    value: 2154,
    name: "发电机输入端轴向"
  },
  {
    value: 3854,
    name: "其他"
  },
  {
    value: 3515,
    name: "发电机输入端"
  },
  {
    value: 3515,
    name: "发电机输入端径向"
  },
  {
    value: 3854,
    name: "齿轮箱高速级径向"
  }
];
let rich = {
  yellow: {
    color: "#ffc72b",
    fontSize: 30 * scale,
    padding: [5, 4],
    align: "center"
  },
  total: {
    color: "#ffc72b",
    fontSize: 40 * scale,
    align: "center"
  },
  white: {
    color: "#fff",
    align: "center",
    fontSize: 14 * scale,
    padding: [21, 0]
  },
  blue: {
    color: "#49dff0",
    fontSize: 16 * scale,
    align: "center"
  },
  hr: {
    borderColor: "#0b5263",
    width: "100%",
    borderWidth: 1,
    height: 0
  }
};
let option = {
  // backgroundColor: "#031f2d",
  title: {
    text: "总报警次数",
    left: "center",
    top: "53%",
    padding: [24, 0],
    textStyle: {
      color: "#fff",
      fontSize: 18 * scale,
      align: "center"
    }
  },
  legend: {
    selectedMode: false,
    formatter: function () {
      let total = 0; //各科正确率总和
      // let averagePercent; //综合正确率
      echartData.forEach(function (value) {
        total += value.value;
      });
      return "{total|" + total + "}";
    },
    data: [echartData[0].name],
    // data: ['高等教育学'],
    // itemGap: 50,
    left: "center",
    top: "center",
    icon: "none",
    align: "center",
    textStyle: {
      color: "#fff",
      fontSize: 16 * scale,
      rich: rich
    }
  },
  series: [
    {
      name: "总考生数量",
      type: "pie",
      radius: ["42%", "50%"],
      color: ["#c487ee", "#deb140", "#49dff0", "#034079", "#6f81da", "#00ffb4"],
      label: {
        // normal: {
        formatter: function (params) {
          let total = 0; //考生总数量
          let percent = 0; //考生占比
          echartData.forEach(function (value) {
            total += value.value;
          });
          percent = ((params.value / total) * 100).toFixed(1) as any;
          return "{white|" + params.name + "}\n{hr|}\n{yellow|" + params.value + "}\n{blue|" + percent + "%}";
        },
        rich: rich
        // }
      },
      labelLine: {
        // normal: {
        length: 55 * scale,
        length2: 0,
        lineStyle: {
          color: "#0b5263"
        }
        // }
      },
      data: echartData
    }
  ]
};

onMounted(() => {
  let myChart = echarts.init(chartDom.value);
  option && myChart.setOption(option);
});
</script>
<style scoped lang="scss">
.chartDom {
  width: 100%;
  height: calc(100% - 48px);
  min-height: 280px;
}
</style>
