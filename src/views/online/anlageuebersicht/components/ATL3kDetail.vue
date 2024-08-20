<template>
  <div class="box">
    <el-table
      :data="tableData"
      style="width: 100%"
      height="300"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="name" label="部位名称" width="240" />
      <el-table-column prop="boxNum" label="箱体编号" />
      <el-table-column prop="pointNum" label="点位编号" />
      <el-table-column prop="cumulativeOil" label="累计油量(ml)" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <div
            v-if="scope.row.status == null || scope.row.status == 0"
            style="width: 15px; height: 15px; margin: 0 auto; background-color: green; border-radius: 50%"
          ></div>
          <div v-else style="width: 15px; height: 15px; margin: 0 auto; background-color: red; border-radius: 50%"></div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { atl_Atl3000BoxConfigList } from "@/api/system/functionPosition";
import { ElMessage } from "element-plus";
const props = defineProps({
  partId: {
    type: Number
  }
});
const { partId } = toRefs(props);

const tableData = ref();

// 获取列表
const getEquipPointList = async () => {
  let res: any = await atl_Atl3000BoxConfigList({ partId: partId?.value });
  if (res.code == "200") {
    tableData.value = res.data as any;
  } else {
    ElMessage.error(res?.mssage);
  }
};
getEquipPointList();
</script>

<style lang="scss" scoped></style>
