<template>
  <div>
    <el-collapse v-for="(item, index) in equipmentList" :key="item['topLocationId']" v-model="activeName" accordion>
      <el-collapse-item :title="item['topLocationName']" :name="index">
        <div class="flex flex-wrap gap-4 list">
          <el-card v-for="it in item['equipList']" :key="it['id']" class="box-card" shadow="hover" @click="toDetail(it)">
            <div class="left">
              <div>{{ it["name"] }}</div>
              <img :src="it['equipImageUrl']" height="100px" width="100%" alt="暂无图片" />
            </div>
            <div class="right">
              <el-button type="primary">正常</el-button>
              <p>震动检测最大值：100</p>
              <p>运行总时长：987h</p>
              <p>单次运行时长：1.25h</p>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup name="overview">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Overview_List } from "@/api/online/overview";
import { useRouter } from "vue-router";
const router = useRouter();
let equipmentList = ref([]);
// let imagesUrl = "../images/xiaofengji.gif";
let activeName = ref(0);
// 方法区
//获取列表
const getList = async () => {
  const res: any = await Overview_List({});
  if (res.code == "200") {
    equipmentList.value = res.data;
  } else {
    ElMessage.error(res?.message);
  }
};
getList();
// 跳转至详情
const toDetail = (rowData: Object) => {
  router.push({
    name: "anlageuebersicht",
    query: {
      id: rowData["id"]
    }
  });
};
</script>
<style scoped lang="scss">
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-card {
    height: 170px;
    padding: 0;
    .el-card__body {
      height: 100% !important;
      padding: 5px !important;
    }
  }
}
.box-card {
  /* flex: 0 0 24% 该属性等价于 flex:none;width:24% */
  flex: 0 0 24%;
  height: 100%;
  margin-bottom: 10px;
  border-radius: 10px;
  transition: transform 0.3s; /* 放大缩小动画时间 */
}
.box-card:hover {
  transform: scale(1.1); /* 鼠标悬浮时放大卡片 */
}
.left {
  float: left;
  width: 200px;
  height: 140px;
}
.right {
  float: right;
  width: calc(100% - 200px);
  height: 140px;
}
</style>
