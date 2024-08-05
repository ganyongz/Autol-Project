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
      <el-table-column prop="name" label="箱体点位别名" width="240" />
      <el-table-column prop="boxNum" label="箱体编号" />
      <el-table-column prop="pointNum" label="点位编号" />
      <el-table-column prop="cumulativeOil" label="累计油量(ml)" />
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
