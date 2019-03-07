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
      :check-strictly="checkStrictly"
      :filter-node-method="filterNode"
      :default-checked-keys="defaultChecked"
      :default-expanded-keys="defaultExpanded"
      @node-click="handleClickLeft"
      @node-contextmenu="handleClickRight"
      @check="handleCheck"
      highlight-current
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
import { getChildGroupApi } from '@/api/project/S0804A'
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
    // 树显示的数据
    dimension: {

    },
    // 传入一个随机数，让树组件更新
    treeRefresh: {
      type: Number
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
        n0: null, // 第一个node
        nn: null  // 其他节点
      }
    }
  },
  computed: {
    ...mapGetters([
      'layoutType'
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
    treeRefresh (value) {
      this.loadNode(this.nodeInfo.n0.node, this.nodeInfo.n0.resolve)
      // 关闭菜单
      this.handlecCloseMenu()
    }
  },
  methods: {
    // 过滤节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树盒子的右键点击事件
    handleTreeClick (e) {
      if (!this.rightClick) return
      if (!(this.nodeInfo.n0 && this.nodeInfo.n0.node)) return
      this.rightMenu.show = true
      this.rightMenu.left = e.clientX
      this.rightMenu.top = e.clientY

      this.rightMenu.list = [
        {name: '刷新', type: 'refresh', node: this.nodeInfo.n0.node}
      ]
    }, 
    // 节点的点击事件
    handleClickLeft (data) {
      this.rightMenu.show = false
      // 将点击事件派发到父级
      this.$emit('cdHandleClickLeft', data)
    },
    // 右键的点击事件 => 参数依次为 event, 数据， 节点， 节点组件本身
    handleClickRight (e, data, node, vm) {
      if (!this.rightClick) return
      this.rightMenu.show = true
      this.rightMenu.left = e.clientX
      this.rightMenu.top = e.clientY

      // 根据类型生成右键菜单
      switch (node.level) {
      case 1:
        this.rightMenu.list = [
          {name: '添加下级分组', type: 'addGroup', node},
          {name: '刷新', type: 'refresh', node}
        ]
        break
      default:
        this.rightMenu.list = [
          {name: '添加下级分组', type: 'addGroup', node},
          {name: '编辑分组信息', type: 'update', node},
          {name: '删除分组', type: 'delete', node},
          {name: '添加表计', type: 'addMeter', node},
          {name: '刷新', type: 'refresh', node}
        ]
        break
      }
      this.$emit('cdHandleClickRight', data, node)
    },
    // 右键的事件触发， 派发到父组件处理
    handleRightEvent (type, node) {
      this.$emit('cdHandleRightEvent', type, node.data)
      // 如果点击的是刷新，则刷新当前层的数据
      if (type === 'refresh') {
        this.loadNode(this.nodeInfo.n0.node, this.nodeInfo.n0.resolve)
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
    // 初始化选中状态
    initSelectData () {
      this.$refs.TreeComponent.setCheckedNodes([])
      // for (let i = 0; i < data.data.length; i++) {
      //   // 得到选中的节点
      //   this.$refs.TreeComponent.setChecked(data.data[i].id, true)
      // }
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
        // 得到当前所在节点的信息
        this.nodeInfo.n0 = {node, resolve}
        
        // 得到数据
        if (this.dimension) {
          let data = JSON.parse(JSON.stringify(this.dimension))
          data.type = 'dimension'
          data.disabled = true
          // 初始化数据
          this.treeData = [data]
        }

        // 设置默认展开第一级
        if (this.treeData[0]) {
          if (this.defaultExpanded) {
            this.defaultExpanded.push(this.treeData[0].id)
          }
        }
      } else {
        // 得到当前所在节点的信息
        this.nodeInfo.nn = {node, resolve}
        // 得到数据
        let pid, dagd_id, arr1 = []
        pid = node.data.dagp_id || node.data.dagp_dagp_id
        dagd_id = node.data.dagd_id || node.data.dagp_dagd_id
        getGroup(pid, dagd_id)
        .then(group => {
          arr1 = arr1.concat(group)
          setTimeout(() => {
            resolve(arr1)
          }, timeStamp)
        })
        .catch(() => {
          setTimeout(() => {
          // 设置默认展开第一个子节点, 默认选中， 默认高亮效果
          if (arr1[0]) {
            if (this.defaultChecked) {
              this.defaultChecked.push(arr1[0].id)
            }
            if (this.defaultExpanded) {
              // this.defaultExpanded.push(arr1[0].id)
            }
            this.$nextTick(() => {
              this.$refs.TreeComponent.setCurrentKey(arr1[0].id)
              // 将当前选择的数据派发到父级处理
              this.$emit('cdHandleTreeCheck', this.$refs.TreeComponent.getCheckedNodes())
            })

            // 页面初始化，默认点击了第一项， 并将点击事件派发到父级
            this.$emit('cdHandleClickLeft', arr1[0])
            
          }
            resolve(arr1)
          }, timeStamp)
        })

        // 得到分组数据
        function getGroup (pid, dagd_id) {
          return new Promise((resolve, reject) => {
            getChildGroupApi({pid, dagd_id}).then(response => {
              let arr = JSON.parse(JSON.stringify(response.content.data))
              if (response.success) {
                arr.forEach(item => {
                  item.name = item.dagp_name
                  item.type = 'group'
                  item.id = node.level + item.dagp_id
                  // item.leaf = true
                })
                resolve(arr)
              } else {
                reject(arr)
              }
            })
            .catch(() => {
              reject()
            })
          })
        }
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
