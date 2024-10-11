<template>
  <div class="main-box">
    <!-- <TreeFilter
      title="部件菜单"
      multiple
      label="name"
      :request-api="getUserDepartment"
      :default-value="treeFilterValues.departmentId"
      @change="changeTreeFilter"
    /> -->
    <el-tree
      ref="treeRef"
      style="width: 240px; max-width: 600px"
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      :current-node-key="partId"
      :highlight-current="true"
      @node-click="handleNodeClick"
    />
    <div class="table-box">
      <div class="card mb10 pt0 pb0">
        <qualityChart />
      </div>
      <ProTable
        :key="keyTable"
        ref="proTable"
        highlight-current-row
        :init-param="initParam"
        :request-api="getTableList"
        :columns="columns"
        :data-callback="dataCallback"
      >
        <!-- :init-param="Object.assign(treeFilterValues, selectFilterValues)" -->
        <!-- 表格 header 按钮 -->
        <!-- <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
          <el-button type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button>
          <el-button type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>
          <el-button type="primary" :icon="Pointer" plain @click="setCurrent">选中第四行</el-button>
        </template> -->
        <!-- 表格操作 -->
        <!-- <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
        </template> -->
      </ProTable>
      <UserDrawer ref="drawerRef" />
      <ImportExcel ref="dialogRef" />
    </div>
  </div>
</template>
<script setup lang="tsx" name="oilAnalyse">
// 油液分析
import { ref, reactive, onMounted, watch } from "vue";
// import { User } from "@/api/interface";
import { ElMessage } from "element-plus";
// import { useHandleData } from "@/hooks/useHandleData";
// import { useDownload } from "@/hooks/useDownload";
// import { genderType, userStatus } from "@/utils/dict";
import { oil_pageList } from "@/api/online/oilAnalyse";
// D:\Autol-Project\src\api\online\oilAnalyse.ts
import ProTable from "@/components/ProTable/index.vue";
// import TreeFilter from "@/components/TreeFilter/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
// import SelectFilter from "@/components/SelectFilter/index.vue";
import { ProTableInstance } from "@/components/ProTable/interface";
// import { CirclePlus, Delete, EditPen, Pointer, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
// D:\Autol-Project\src\views\online\expertAnalysis\oilCorrelation\qualityChart.vue
import qualityChart from "@/views/online/expertAnalysis/oilCorrelation/qualityChart.vue";

// ProTable 实例
const proTable = ref<ProTableInstance>();
// 初始化的请求参数
let initParam = ref({ partId: "134" });
let keyTable = ref(1);

// 表格配置项
const columns: any = reactive([
  // { type: "radio", label: "单选", width: 80 },
  { type: "index", label: "#", width: 80 },
  { prop: "dataTime", label: "时间", width: 220 },
  // { prop: "gender", label: "性别", width: 120, sortable: true, enum: genderType },
  { prop: "oilTemperature", label: "油液温度" },
  { prop: "waterActivity", label: "水活性" },
  { prop: "moistureContent", label: "含水量" },
  // { prop: "status", label: "用户状态", width: 120, sortable: true, tag: true, enum: userStatus },
  { prop: "viscosity", label: "动力粘度", width: 180 },
  // { prop: "operation", label: "操作", width: 330, fixed: "right" }
  { prop: "density", label: "密度" },
  { prop: "dielectricConstant", label: "介电常数" },
  { prop: "contaminationStandard", label: "污染等级" },
  { prop: "ironParticlesConcentration", label: "铁磁浓度" },
  { prop: "notIronParticlesConcentration", label: "非铁磁浓度" }
]);

// selectFilter 数据（用户角色为后台数据）
// const selectFilterData = reactive([
//   {
//     title: "用户状态(单)",
//     key: "userStatus",
//     options: [
//       { label: "全部", value: "" },
//       { label: "在职", value: "1", icon: "User" },
//       { label: "待培训", value: "2", icon: "Bell" },
//       { label: "待上岗", value: "3", icon: "Clock" },
//       { label: "已离职", value: "4", icon: "CircleClose" },
//       { label: "已退休", value: "5", icon: "CircleCheck" }
//     ]
//   },
//   {
//     title: "用户角色(多)",
//     key: "userRole",
//     multiple: true,
//     options: []
//   }
// ]);

// 获取用户角色字典
onMounted(() => {
  // proTable.value?.getTableList(); //估计没有也行
  // getUserRoleDict()
});
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  debugger;
  return {
    list: data.records,
    total: data.total,
    pageNum: data.current,
    pageSize: data.size
  };
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="oil_pageList"
const getTableList = (params: any) => {
  debugger;
  let newParams = JSON.parse(JSON.stringify(params));
  // newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  // newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  // delete newParams.createTime;
  return oil_pageList(newParams);
};
// const getUserRoleDict = async () => {
//   const { data } = await getUserRole();
//   selectFilterData[1].options = data as any;
// };

// 默认 selectFilter 参数
// const selectFilterValues = ref({ userStatus: "2", userRole: ["1", "3"] });
// const changeSelectFilter = (value: typeof selectFilterValues.value) => {
//   ElMessage.success("请注意查看请求参数变化 🤔");
//   proTable.value!.pageable.pageNum = 1;
//   selectFilterValues.value = value;
// };

// 默认 treeFilter 参数
// const treeFilterValues = reactive({ departmentId: ["11"] });
// const changeTreeFilter = (val: string[]) => {
//   ElMessage.success("请注意查看请求参数变化 🤔");
//   proTable.value!.pageable.pageNum = 1;
//   treeFilterValues.departmentId = val;
// };

// 选择行
// const setCurrent = () => {
//   proTable.value!.radio = proTable.value?.tableData[3].id;
//   proTable.value?.element?.setCurrentRow(proTable.value?.tableData[3]);
// };

watch(
  () => proTable.value?.radio,
  () => proTable.value?.radio && ElMessage.success(`选中 id 为【${proTable.value?.radio}】的数据`)
);

// 删除用户信息
// const deleteAccount = async (params: User.ResUserList) => {
//   await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`);
//   proTable.value?.getTableList();
// };

// 重置用户密码
// const resetPass = async (params: User.ResUserList) => {
//   await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
//   proTable.value?.getTableList();
// };

// 导出用户列表
// const downloadFile = async () => {
//   ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
//     useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
//   );
// };

// 批量添加用户
// const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
// const batchAdd = () => {
//   const params = {
//     title: "用户",
//     tempApi: exportUserInfo,
//     importApi: BatchAddUser,
//     getTableList: proTable.value?.getTableList
//   };
//   dialogRef.value?.acceptParams(params);
// };

// 打开 drawer(新增、查看、编辑)
// const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
// const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
//   const params = {
//     title,
//     isView: title === "查看",
//     row: { ...row },
//     api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
//     getTableList: proTable.value?.getTableList
//   };
//   drawerRef.value?.acceptParams(params);
// };
// 树结构
let partId = ref();
import { getLocationTree } from "@/api/system/functionPosition";
interface Tree {
  label: string;
  type: Number;
  id: String;
  children?: Tree[];
}
const handleNodeClick = (data: Tree) => {
  // console.log(data, "节点数据");
  // 1功能位置，2设备，3部件，4测点;只有当type为3时才查询
  if (data?.type == 3) {
    sessionStorage.setItem("deviceID", data.id as any);
    partId.value = data.id;
    initParam.value.partId = data.id as any;
    // getTableList({
    //   partId: data.id
    // });
    keyTable.value += 1;
  }
};
const defaultProps = {
  children: "children",
  label: "name",
  id: "id"
};
let treeData = ref();
let caidan = ref(true);
// 获取菜单列表
const getEquipTreeList = async () => {
  caidan.value = false;
  // 1功能位置，2设备，3部件，4测点
  let res: any = await getLocationTree({ type: 3, range: 9, isFiltration: false });
  if (res.code == "200") {
    treeData.value = res.data as any;
  } else {
    ElMessage.error(res?.message);
  }
};

// 调用
getEquipTreeList();
</script>
