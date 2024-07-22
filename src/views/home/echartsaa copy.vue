<template>
  <el-tree
    :data="treeData"
    :props="defaultProps"
    node-key="id"
    :render-content="renderContent"
    :check-on-click-node="true"
    :check-strictly="true"
  ></el-tree>
</template>

<script setup lang="ts">
import { ref } from "vue";

let treeData = ref([
  { id: 1, label: "Node1", type: 1 },
  { id: 2, label: "Node2", type: 2 },
  { id: 3, label: "Node3", type: 3 },
  {
    id: 4,
    label: "Node4",
    type: 1,
    children: [
      { id: 41, label: "Child Node1", type: 4 },
      { id: 42, label: "Child Node2", type: 4 }
    ]
  }
]);
const defaultProps = {
  children: "children",
  label: "label"
};
const renderContent = (h, { node, data }) => {
  console.log(node);

  if (data.type === 4) {
    return h("div", h("span", node.checked ? "✔" : "口"));
  } else {
    return h(
      "span",
      null,
      h("i", {
        class: "el-icon-plus",
        style: "margin-right: 5px"
      }),
      h("span", null, node.label)
    );
  }
};
</script>
