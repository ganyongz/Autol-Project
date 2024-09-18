<template>
  <div>
    <div v-if="fftData.series[0].data" ref="chartRef" style="width: 100%; height: 400px"></div>
    <el-empty v-else description="暂无分析数据" />
  </div>
</template>

<script setup lang="ts" name="fft">
// 短时FFT分析
import { ref, onMounted, onUnmounted, toRefs } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
import "echarts-gl";
import { Diagram_professionalAtlas } from "@/api/online/comprehensiveAnalysis";
const props = defineProps({
  stationId: {
    type: String,
    default: ""
  },
  dataObj: {
    type: Object
  }
});
const { dataObj } = toRefs(props);
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
// let xAxisData = ref();
// let yAxisData = ref();
let boxingKey = ref(1);
// 假设 fftData 是从服务器获取的 FFT 结果
let fftData = ref({
  tooltip: {},
  xAxis3D: {
    name: "x", //x轴显示为x
    type: "value",
    // min: 'dataMin',//获取数据中的最值
    // max: 'dataMax'
    min: 0,
    max: 80,
    interval: 20, //坐标轴刻度标签的显示间隔，在类目轴中有效
    axisTick: {
      show: true //显示每个值对应的刻度
    },
    axisLine: {
      //x轴坐标轴，false为隐藏，true为显示
      show: true
    },
    axisLabel: {
      show: true //是否显示刻度 (刻度上的数字，或者类目)， false为隐藏，true为显示
    },
    itemStyle: {
      borderColor: "#fff",
      backgroundColor: "#fff"
    }
  },
  yAxis3D: {
    name: "y", //y轴显示为y
    type: "value",
    splitNumber: 5,
    axisTick: {
      show: true //显示每个值对应的刻度
    },
    min: 0,
    // max: 360,
    interval: 90
  },
  zAxis3D: {
    name: "z", //z轴显示为z
    type: "value",
    min: -20,
    max: 60,
    interval: 20,
    axisTick: {
      show: true //显示每个值对应的刻度
    }
  },
  grid3D: {
    axisLine: {
      lineStyle: {
        //坐标轴样式
        color: "#070707", //轴线颜色
        opacity: 0.8, //(单个刻度不会受影响)
        width: 1 //线条宽度
      }
    },
    axisPointer: {
      lineStyle: {
        color: "#f00" //坐标轴指示线
      },
      show: true //不坐标轴指示线
    },
    viewControl: {
      // autoRotate: true,//旋转展示
      // projection: 'orthographic'
      // beta:0,
      distance: 1500, //与视角的距离，值越大，图离视角越远，图越小
      alpha: 7, //绕x轴旋转的角度（上下旋转），增大，视角顺时针增大（向上）
      beta: 0, //绕y轴旋转的角度（左右旋转），增大，视角逆时针增大（向右）
      center: [-15, 100, -20] //第一个参数：增大，视角沿x轴正方向水平右移动（图向左）；第二个参数：增大，视角沿y轴正方向垂直向上移动（图向下）；第三个参数：增大，视角向z轴正方向移动（图变小）
    },
    boxWidth: 1000,
    boxHeight: 70,
    boxDepth: 120,
    top: -100
  },
  series: [
    {
      type: "scatter3D",
      dimensions: [
        "x",
        "y",
        "z" //悬浮到点时弹出的显示框信息
      ],
      // encode: {
      // x: [3, 1, 5],      // 表示维度 3、1、5 映射到 x 轴。
      // y: 1,              // 表示维度 2 映射到 y 轴。
      // z: 3,
      // tooltip:['a','c','b'], // 表示维度 3、2、4 会在 tooltip 中显示。
      // label: 'a'           // 表示 label 使用维度 3。
      // },

      data: [
        // [0, 0, 0],
        // [1, 0, 0],
        // [0, 1, 0],
        // [0, 1, 1],
        // [21, 24, 25],
        // [22, 25, 26]
      ],
      symbolSize: 4, //点的大小
      // symbol: 'triangle',
      itemStyle: {
        // borderWidth: 1,
        color: "#87f0e5"
        // borderColor: 'rgba(255,255,255,0.8)'//边框样式
      },
      emphasis: {
        itemStyle: {
          color: "#ccc" //高亮
        }
      }
      // itemStyle: {
      //     color: "#87f0e5"
      // }
    }
  ],
  backgroundColor: "#e8e8e8"
});

onMounted(async () => {
  if (dataObj?.value) {
    await getTrendChart();
  }
  chartInstance = echarts.init(chartRef.value as HTMLElement);
  chartInstance.setOption(fftData.value);
});
const getTrendChart = async () => {
  let obj: any = dataObj?.value;
  let params = {
    id: obj["id"],
    tableName: obj["tableName"],
    type: 7
  };
  let res: any = await Diagram_professionalAtlas(params);
  if (res.code == "200" && res.data?.frequencies) {
    // 首先，循环 arr1 和 arr2 来创建一个新数组
    let arr1 = res.data?.frequencies;
    let arr2 = res.data?.magnitude;
    let arr3 = res.data?.times;
    let combinedArr = arr1.map((item1, index1) => {
      return arr2[index1].map(item2 => [item1, item2]);
    });

    // 然后，循环新数组和 arr3 来创建最终的数组
    let finalArr: any = [];
    combinedArr.forEach(subArr => {
      subArr.forEach((item: any) => {
        arr3.forEach((item3: any) => {
          finalArr.push([...item, item3]);
        });
      });
    });
    fftData.value.series[0].data = finalArr;
    console.log(fftData.value.series[0].data);

    boxingKey.value += 1;
  } else {
    ElMessage.error(res?.message);
  }
};
onUnmounted(() => {
  if (chartInstance) {
    // 组件卸载时清理 ECharts 实例
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<style scoped>
/* 这里可以添加一些样式 */
</style>
