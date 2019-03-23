<template>
  <div class="page-tree">
    <el-tree
      class="tree-component disabled-select"
      ref="TreeComponent"
      :show-checkbox="checkBox"
      :node-key="nodeKey"
      :data="treeData"
      :load="handleLoadNode"
      :lazy="lazy"
      :draggable="draggable"
      :allow-drop="handleDrop"
      :expand-on-click-node="false"
      :check-strictly="checkStrictly"
      :filter-node-method="filterNode"
      :default-checked-keys="defaultChecked"
      :default-expanded-keys="defaultExpanded"
      @node-click="handleClickLeft"
      @node-contextmenu="handleClickRight"
      @check="handleCheck"
      @check-change="handleCheck"
      @current-change="handleCheck"
      @node-expand="handleCheck"
      highlight-current
      :props="defaultProps">
      <!-- :render-content="renderContent" -->
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'PageTree',
  props: {
    // 是否手风琴点击
    clickNode: {
      type: Boolean,
      defalult: false
    },
    // 树状数据
    treeData: {
      type: Array
    },
    // 是否懒加载
    lazy: {
      type: Boolean,
      defalult: false      
    },
    // 默认选中的项
    defaultChecked: {
      type: Array
    },
    // 是否全部展开
    expandAll: {
      type: Boolean,
      default: false
    },
    // 是否有选择框
    checkBox: {
      type: Boolean,
      default: false
    },
    // 在有复选框的时候，是否·遵循父子不互关联
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 是否可拖拽
    draggable: {
      type: Boolean,
      default: true
    },
    // 是否需要右键菜单
    rightClick: {
      type: Boolean,
      default: false
    },
    // 右键菜单显示
    rightMenuInfo: {
      type: Array
    },
    // 设置节点过滤文本
    filterText: {
      type: String
    },
    // 节点的key字段名称
    nodeKey: {
      type: String,
      default: 'id'
    },
    // 设置树状的字段结构
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'name'
        }
      }
    },
    // 传入一个随机数，让树组件更新
    treeRefresh: {
      type: Number
    }
  },
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
    renderContent (h, { node, data, store }) {
      // let dom
      // if (data.type === 'metr') {
      //   dom = (
      //     <p class="custom-tree-node">
      //       <img src={require('@/assets/image/doc.png')}></img>
      //       <span style="margin-left:5px;"  title={data.desc}>{node.label}</span>
      //     </p>
      //   )
      // } else {
      //   dom = (
      //     <p class="custom-tree-node">
      //       <img src={node.expanded ? require('@/assets/image/file-open.png') : require('@/assets/image/file-close.png')}></img>
      //       <span style="margin-left:5px;"  title={data.desc}>{node.label}</span>
      //     </p>
      //   )
      // }
      // return dom
    },
    // 过滤节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点左键点击
    handleClickLeft (data, Node, vm) {
    },
    // 右键的点击事件 => 参数依次为 event, 数据， 节点， 节点组件本身
    handleClickRight (e, data, node, vm) {
      if (!this.rightClick) return
    },
    // 右键的事件触发， 派发到父组件处理
    handleRightEvent (type, node) {
    },
    // 关闭右键菜单
    handlecCloseMenu () {
      this.rightMenu.show = false
    },
    // 选择框的点击事件
    handleCheck () {
      // 将当前选择的数据派发到父级处理
      this.$emit('cdHandleTreeCheck', this.$refs.TreeComponent.getCheckedNodes())
    },
    // 是否可以放置, 设置为只能同一层级拖拽
    handleDrop (draggingNode, dropNode, type) {
      return draggingNode.level === dropNode.level && type !== 'inner'
    },
    // 非懒加载
    initData () {
      if (this.lazy) return
    },
    // 懒加载数据
    handleLoadNode (node, resolve) {
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tree{
}
</style>
