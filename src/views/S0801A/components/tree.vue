<template>
  <!-- 树组件 -->
  <div class="frad-tree" @contextmenu.prevent="handleTreeClick">
    <el-tree
      ref="TreeComponent"
      :show-checkbox="checkBox"
      node-key="id"
      :data="treeData"
      :load="loadNode"
      lazy
      :draggable="draggable"
      :allow-drop="handleDrop"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :default-checked-keys="defaultChecked"
      :default-expanded-keys="defaultExpanded"
      @node-click="handleClickLeft"
      @node-contextmenu="handleClickRight"
      @check="handleCheck"
      highlight-current
      :render-content="renderContent"
      :props="defaultProps">
    </el-tree>
    <!-- 右键菜单 -->
    <ul class='contextmenu' v-show="rightMenu.show" :style="{left: rightMenu.left +'px',top: rightMenu.top +'px'}">
      <li v-for="(item, index) in rightMenu.list" @click="handleRightEvent(item.type, item.node)">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 引入接口
import { getCollectorApi, getMeterApi, getStationApi } from '@/api/project/S0801A'
export default {
  name: 'tree', // 当前页面独有的异步加载组件
  props: {
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
    // 传入一个随机数，让树组件更新
    treeRefresh: {
      type: Number
    },
    refreshLevel: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 初始时的数据
      treeData: [],
      // 设置树状的字段结构
      defaultProps: {
        children: 'children', // 字元素字段名
        label: 'name', // 名字字段名
        isLeaf: 'leaf'
      },
      // 默认选中项
      defaultChecked: [],
      // 默认展开项
      defaultExpanded: [],
      // 右键菜单的参数
      rightMenu: {
        show: false,
        left: 0,
        top: 0,
        list: []
      },
      // 每个level的节点信息
      nodeInfo: {
        n0: null,
        n1: null,
        n2: null,
        n3: null,
        n4: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'layoutType',
      'projectInfo'
    ])
  },
  mounted () {
  },
  watch: {
    'rightMenu.show' (value) {
      if (value) {
        document.body.addEventListener('click', this.handlecCloseMenu)
      } else {
        document.body.removeEventListener('click', this.handlecCloseMenu)
      }
    },
    treeRefresh (val) {
      let level = 'n' + (this.refreshLevel - 1 >= 0 ? this.refreshLevel - 1 : 0)
      this.loadNode(this.nodeInfo[level].node, this.nodeInfo[level].resolve)
      // 关闭菜单
      this.handlecCloseMenu()
    }
  },
  methods: {
    renderContent (h, { node, data, store }) {
      let dom
      if (data.leaf) {
        dom = (
          <p class="custom-tree-node">
            <img src={require('@/assets/image/doc.png')}></img>
            <span style="margin-left:5px;">{node.label}</span>
          </p>
        )
      } else {
        dom = (
          <p class="custom-tree-node">
            <img src={node.expanded ? require('@/assets/image/file-open.png') : require('@/assets/image/file-close.png')}></img>
            <span style="margin-left:5px;">{node.label}</span>
          </p>
        )
      }
      return dom
    },
    // 过滤节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树盒子的右键点击事件
    handleTreeClick (e) {
      if (!this.rightClick) return
      if (!(this.nodeInfo.n1 && this.nodeInfo.n1.node)) return

      this.rightMenu.list = [
        {name: '刷新', type: 'refresh', node: this.nodeInfo.n1.node}
      ]

      // 显示菜单，并且根据点击的位置生成菜单显示的坐标
      this.rightMenu.show = true
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
          len = this.rightMenu.list.length,
          top
      if (len * 30 + e.clientY > h) {
        top = e.clientY - len * 30
      } else {
        top = e.clientY
      }
      this.rightMenu.left = e.clientX
      this.rightMenu.top = top
    }, 
    // 节点的点击事件
    handleClickLeft (data, node) {
      this.rightMenu.show = false
      // 将点击事件派发到父级
      this.$emit('cdHandleClickLeft', data, node)
    },
    // 右键的点击事件 => 参数依次为 event, 数据， 节点， 节点组件本身
    handleClickRight (e, data, node, vm) {
      if (!this.rightClick) return
      // 根据类型生成右键菜单
      switch (data.type) {
      case 'project':
        this.rightMenu.list = [
          {name: '添加建筑', type: 'add', node},
          // {name: '编辑建筑群信息', type: 'update', node},
          {name: '刷新', type: 'refresh', node}
        ]
        break
      case 'build':
        this.rightMenu.list = [
          {name: '添加采集器', type: 'add', node},
          {name: '编辑建筑信息', type: 'update', node},
          {name: '删除建筑', type: 'delete', node},
          {name: '刷新', type: 'refresh', node}
        ]
        break
      case 'collector':
        this.rightMenu.list = [
          {name: '添加表计', type: 'add', node},
          {name: '编辑采集器信息', type: 'update', node},
          {name: '删除采集器', type: 'delete', node},
          {name: '刷新', type: 'refresh', node}
        ]
        break
      case 'meter':
        this.rightMenu.list = [
          {name: '添加测点', type: 'add', node},
          {name: '编辑表计信息', type: 'update', node},
          {name: '删除表计', type: 'delete', node},
          {name: '刷新', type: 'refresh', node}
        ]
        break
      case 'station':
        this.rightMenu.list = [
          {name: '编辑测点信息', type: 'update', node},
          {name: '删除测点', type: 'delete', node},
          {name: '刷新', type: 'refresh', node}
        ]
        break
      }

      // 显示菜单，并且根据点击的位置生成菜单显示的坐标
      this.rightMenu.show = true
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
          len = this.rightMenu.list.length,
          top
      if (len * 30 + e.clientY > h) {
        top = e.clientY - len * 30
      } else {
        top = e.clientY
      }
      this.rightMenu.left = e.clientX
      this.rightMenu.top = top
      
      this.$emit('cdHandleClickRight', data, node)
    },
    // 右键的事件触发， 派发到父组件处理
    handleRightEvent (type, node) {
      this.$emit('cdHandleRightEvent', type, node.data, node)

      // 如果点击的是刷新，则刷新当前层的数据
      if (type === 'refresh') {
        let level = 'n' + (node.level - 1 >= 0 ? node.level - 1 : 0)
        this.loadNode(this.nodeInfo[level].node, this.nodeInfo[level].resolve)
        // 关闭菜单
        this.handlecCloseMenu()
      }
    },
    // 关闭菜单
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
    // 懒加载数据
    loadNode (node, resolve) {
      // 懒加载延迟时间
      let timeStamp = 100
      if (node.level === 0) {
        this.nodeInfo.n0 = {node, resolve}
        // 得到数据
        let arr = [JSON.parse(JSON.stringify(this.projectInfo))]
        arr.forEach(item => {
          item.name = this.projectInfo.proj_shortname || this.projectInfo.proj_name
          item.proj_name = this.projectInfo.proj_name
          item.type = 'project'
          item.id = 'project' + this.projectInfo.id + Math.random()
        })
        // 页面初始化，默认点击了第一项， 并将点击事件派发到父级
        this.$emit('cdHandleClickLeft', arr[0])

        // 初始数据
        this.treeData = arr
        // 设置默认展开, 默认选中， 默认高亮效果
        if (this.treeData[0]) {
          this.defaultChecked.push(this.treeData[0].id)
          this.defaultExpanded.push(this.treeData[0].id)
          this.$nextTick(() => {
            this.$refs.TreeComponent.setCurrentKey(this.treeData[0].id) 
          })
        }
      } else if (node.level === 1) {
        this.nodeInfo.n1 = {node, resolve}
        // 得到数据
        this.$api.getBuildApi({bubi_proj_id : node.data.proj_id}).then(response => {
          let arr = JSON.parse(JSON.stringify(response.content.data))
          arr.forEach(item => {
            // 得到上级数据
            item.project = node.data

            item.name = item.bubi_name
            item.type = 'build'
            item.id = 'build' + item.bubi_id + Math.random()
          })
          setTimeout(() => {
            resolve(arr)
          }, timeStamp)
        })
        .catch(() => {
          setTimeout(() => {
            resolve([])
          }, timeStamp)
        })
      } else if (node.level === 2) {
        this.nodeInfo.n2 = {node, resolve}
        // 得到数据
        getCollectorApi({daci_bubi_id: node.data.bubi_id}).then(response => {
          let arr = JSON.parse(JSON.stringify(response.content.data))
          arr.forEach(item => {
            // 得到上级数据
            item.build = node.data
            item.project = node.data.project

            item.name = item.daci_name
            item.type = 'collector'
            item.id = 'collector' + item.daci_id + Math.random()
          })
          setTimeout(() => {
            resolve(arr)
          }, timeStamp)
        })
        .catch(() => {
          setTimeout(() => {
            resolve([])
          }, timeStamp)
        })
      } else if (node.level === 3) {
        this.nodeInfo.n3 = {node, resolve}
        // 得到数据
        getMeterApi({metr_daci_id: node.data.daci_id}).then(response => {
          let arr = JSON.parse(JSON.stringify(response.content.data))
          arr.forEach(item => {
            // 得到上级数据
            item.collector = node.data
            item.build = node.data.build
            item.project = node.data.project

            item.name = item.metr_name
            item.type = 'meter'
            item.id = 'meter' + item.meter_id + Math.random()
          })
          setTimeout(() => {
            resolve(arr)
          }, timeStamp)
        })
        .catch(() => {
          setTimeout(() => {
            resolve([])
          }, timeStamp)
        })
      } else if (node.level === 4) {
        this.nodeInfo.n4 = {node, resolve}
         // 得到数据
        getStationApi({poit_device_id: node.data.metr_id}).then(response => {
          let arr = JSON.parse(JSON.stringify(response.content.data))
          arr.forEach(item => {
            // 得到上级数据
            item.collector = node.data.collector
            item.build = node.data.build
            item.project = node.data.project
            item.meter = node.data

            item.name = item.poit_name
            item.leaf = true
            item.type = 'station'
            item.id = 'station' + item.station_id + Math.random()
          })
          setTimeout(() => {
            resolve(arr)
          }, timeStamp)
        })
        .catch(() => {
          setTimeout(() => {
            resolve([])
          }, timeStamp)
        })
      } else {
        setTimeout(() => {
            resolve([])
          }, timeStamp)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.frad-tree{
  height: 100%;
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: fixed;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
