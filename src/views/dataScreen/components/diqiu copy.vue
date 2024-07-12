<template>
  <div>
    <div class="main" ref="map"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
let map = ref();

//引入世界地图的JSON数据
import WorldJSON from "./home.json";
//注册世界地图
echarts.registerMap("world", WorldJSON as any);
onMounted(() => {
  let myChart = echarts.init(map.value);
  let geoCoordMap: any = ref({
    太仓: [121.1, 31.45],
    郑州: [113.65, 34.76]
  });
  let alirl = ref([
    [
      [113.65, 34.76],
      [143.65, 35.76]
    ],
    [
      [121.15, 31.89],
      [121.48, 31.22]
    ]
    // [
    //   [120.38, 37.35],
    //   [121.48, 31.22]
    // ]
    // [
    //   [123.97, 47.33],
    //   [121.48, 31.22]
    // ],
    // [
    //   [118.87, 42.28],
    //   [121.48, 31.22]
    // ],
    // [
    //   [121.52, 36.89],
    //   [121.48, 31.22]
    // ],
    // [
    //   [102.188043, 38.520089],
    //   [121.48, 31.22]
    // ],
    // [
    //   [118.58, 24.93],
    //   [121.48, 31.22]
    // ],
    // [
    //   [120.53, 36.86],
    //   [121.48, 31.22]
    // ],
    // [
    //   [119.46, 35.42],
    //   [121.48, 31.22]
    // ],
    // [
    //   [119.97, 35.88],
    //   [121.48, 31.22]
    // ],
    // [
    //   [121.05, 32.08],
    //   [121.48, 31.22]
    // ],
    // [
    //   [91.11, 29.97],
    //   [121.48, 31.22]
    // ]
  ]);
  let convertData = function (data: any) {
    let res = reactive([] as any[]);
    for (let i = 0; i < data.length; i++) {
      let geoCoord = geoCoordMap.value[data[i].name];
      console.log(geoCoord, "geoCoordMap-------------111");

      if (geoCoord) {
        console.log(data[i]?.value, "data[i]-----222");

        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i]?.value)
        });
      }
    }
    console.log(res, "看看res----=============99");

    return res;
  };
  let baseTexture: any = null;
  // 生成球面纹理
  function getBaseTexture() {
    let canvas = document.createElement("canvas");
    baseTexture = echarts.init(canvas, null as any, {
      width: 4096,
      height: 2048
    });
    baseTexture.setOption({
      backgroundColor: "#001213",
      series: [
        {
          type: "map",
          map: "world",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          boundingCoords: [
            [-180, 90],
            [180, -90]
          ],
          label: {
            show: true, //是否显示国家名
            color: "#fff",
            fontSize: 20
          },
          itemStyle: {
            //地区陆地颜色
            areaColor: "#004444",
            borderColor: "#00cccc",
            borderWidth: 2
          }
        }
      ]
    });
    drawEarth();
  }

  function drawEarth() {
    let option: any = {
      tooltip: {
        show: true,
        formatter: "{b} <br /> 经纬度：{c}<br /> {a}{d}"
      },
      globe: {
        silent: true,
        shading: "color",
        // environment: "#000",//背景颜色
        baseTexture: baseTexture
      },
      series: [
        //柱状图
        {
          //name: 'bar3D',
          type: "bar3D",
          coordinateSystem: "globe",
          barSize: 1.5, //柱子粗细
          shading: "lambert",
          opacity: 1,
          bevelSize: 0.5,
          itemStyle: {
            color: "#EBE806",
            opacity: 0.2
          },
          label: {
            show: true,
            formatter: "{b}"
          },
          data: convertData([
            {
              name: "太仓",
              value: 500
            },
            {
              name: "郑州",
              value: 1890
            }
          ])
        },
        {
          name: "lines3D",
          type: "lines3D",
          coordinateSystem: "globe",
          effect: {
            //光束设置
            show: true,
            period: 2,
            trailWidth: 3,
            trailLength: 0.5,
            trailOpacity: 1,
            trailColor: "#0087f4"
          },
          blendMode: "lighter",
          lineStyle: {
            // width: 2
            width: 1,
            color: "#0087f4",
            opacity: 0
          },
          data: [],
          silent: false
        },

        {
          type: "lines3D",

          coordinateSystem: "globe",

          effect: {
            show: true,
            trailWidth: 5,
            trailOpacity: 1,
            trailLength: 0.2,
            constantSpeed: 5
          },

          blendMode: "lighter",

          lineStyle: {
            //(另外一种)航线的视图效果
            color: "red",
            width: 1,
            opacity: 1
          },

          data: alirl.value
        }
      ]
    };
    for (let i = 0; i < 50; i++) {
      option.series[1].data = option.series[1].data.concat(rodamData());
    }

    myChart.clear();
    myChart.setOption(option, true);
  }

  function rodamData() {
    // 郑州的经纬度坐标 [113.65, 34.76]
    let longitude = 113.65;
    let longitude2 = Math.random() * 360 - 180;
    let latitude = 34.76;
    let latitude2 = Math.random() * 180 - 90;
    return {
      coords: [
        [longitude2, latitude2],
        [longitude, latitude]
      ],
      value: (Math.random() * 3000).toFixed(2)
    };
  }

  getBaseTexture();
});
</script>

<style scoped>
.main {
  /* width: 100vw;
  height: 100vh; */
  width: 550px;
  height: 540px;
}
</style>
