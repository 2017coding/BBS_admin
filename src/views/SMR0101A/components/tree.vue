<template>
  <!-- 树组件 -->
  <div class="frad-tree" @contextmenu.prevent="handleTreeClick">
    <el-tree
      class="tree-component disabled-select"
      ref="TreeComponent"
      :data="treeData"
      :show-checkbox="checkBox"
      :default-expand-all="expandAll"
      :node-key="idName"
      :draggable="draggable"
      :allow-drop="handleDrop"
      :expand-on-click-node="clickNode"
      :default-checked-keys="defaultChecked || defaultCheckedFrist"
      :default-expanded-keys="defaultExpanded"
      :check-strictly="checkStrictly"
      :filter-node-method="filterNode"
      @node-click="handleClickLeft"
      @node-contextmenu="handleClickRight"
      @check="handleCheck"
      :render-content="renderContent"
      :highlight-current="true"
      :props="defaultProps">
    </el-tree>
    <!-- 右键菜单 -->
    <ul class='contextmenu' v-show="rightMenu.show" :style="{left: rightMenu.left +'px',top: rightMenu.top +'px'}">
      <li v-for="(item, index) in rightMenu.list" @click="handleRightEvent(item.type, item.node)">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'tree', // 静态的数组件，不异步加载数据
    props: {
      // 是否手风琴点击
      clickNode: {
        type: Boolean,
        defalult: false
      },
      // 节点的id字段名称
      idName: {
        type: String,
        default: 'id'
      },
      // 树状数据
      treeData: {
        type: Array
      },
      // 是否有选择框
      checkBox: {
        type: Boolean,
        default: false
      },
      // 默认选中的项
      defaultChecked: {
        type: Array
      },
      // 在有复选框的时候，是否·遵循父子不互关联
      checkStrictly: {
        type: Boolean,
        default: false
      },
      // 是否全部展开
      expandAll: {
        type: Boolean,
        default: false
      },
      // 是否可拖拽
      draggable: {
        type: Boolean,
        default: false
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
      // 设置数据的名字字段
      defaultPropsLabel: {
        type: String,
        default: 'name'
      },
      // 设置节点过滤文本
      filterText: {
        type: String
      }
    },
    data () {
      return {
        // 设置树状的字段结构
        defaultProps: {
          children: 'children', // 字元素字段名
          label: this.defaultPropsLabel // 名字字段名
        },
        // 默认展开
        defaultExpanded: [],
        // 如果没有传入选中，则默认选中第一个子元素
        defaultCheckedFrist: [],
        rightMenu: {
          show: false,
          left: 0,
          top: 0,
          list: []
        },
        // 双击标识
        double: 0
      }
    },
    computed: {
      ...mapGetters([
        'layoutType'
      ])
    },
    mounted () {
      this.initData()
    },
    watch: {
      treeData (val) {
        this.initData()
      },
      // 节点过滤文本
      filterText (val) {
        this.$refs.TreeComponent.filter(val)
      },
      'rightMenu.show' (value) {
        if (value) {
          document.body.addEventListener('click', this.handlecCloseMenu)
        } else {
          document.body.removeEventListener('click', this.handlecCloseMenu)
        }
      },
      rightMenuInfo (value) {
        // 处理右键要显示的菜单内容
        this.rightMenu.list = value
      }
    },
    methods: {
      renderContent (h, { node, data, store }) {
        let dom
        if (node.level === 1) {
          dom = (
            <p class="custom-tree-node">
              <i class="el-icon-homepage"></i>
              <span style="margin-left:5px;">{node.label}</span>
            </p>
          )
        } else {
          dom = (
            <p class="custom-tree-node">
              <i class="el-icon-flashlight"></i>
              <span style="margin-left:5px;">{node.label}</span>
            </p>
          )
        }
        return dom
      },
      // 树盒子的右键点击事件
      handleTreeClick (e) {
        if (!this.rightClick) return

        this.rightMenu.list = [
          {name: '刷新', type: 'refresh', node: {data: this.treeData[0]}}
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
      // 数据初始化
      initData () {
        // 容错处理
        this.treeData.forEach((item, index) => {
          item.id = item.id || item.id === 0 ? item.id : Math.random()
        })
        // 空数据不往下处理
        if (this.treeData.length === 0) {
          return
        }
        // 设置默认展开
        this.defaultExpanded.push(this.treeData[0].id)
        // 设置默认选择
        let defaultSelect = this.treeData[0] && this.treeData[0].children[0] ? this.treeData[0].children[0].id : this.treeData[0].id
        // 设置默认选中的值
        this.defaultCheckedFrist.push(defaultSelect)
        this.$nextTick(() => {
          // 设置选中高亮
          this.$refs.TreeComponent.setCurrentKey(defaultSelect)
          // 页面初始化，默认勾选第一个子元素， 并将勾选事件派发到父级
          this.$emit('cdHandleTreeCheck', this.$refs.TreeComponent.getCheckedKeys())
        })
        // 在树状数据中找到当前点击的数据
        let obj = {}
        function getSelectData (data, val) {
          for (let item of data) {
            if (item.id === val) {
              obj = item
              return
            } else if (Array.isArray(item.children) && item.children.length > 0) {
              getSelectData(item.children, val)
            }
          }
        }
        getSelectData(this.treeData, defaultSelect)
        // 页面初始化，设置默认点击项， 并将点击事件派发到父级
        this.$emit('cdHandleClickLeft', {id: defaultSelect, ...obj})
      },
      // 过滤节点
      filterNode (value, data) {
        if (!value) return true
        // 不区分大小写过滤节点
        let val = new RegExp(value, 'i')
        return val.test(data.name)
      },
      // 节点的点击事件
      handleClickLeft (data, node, e) {
        this.double++
        this.rightMenu.show = false

        // TODO: 模拟双击事件(>=2双击, 现在还是单击事件)
        if (this.double >= 1) {
          // 将点击事件派发到父级
          this.$emit('cdHandleClickLeft', data, 'double')

          this.double = 0
        } else {
          setTimeout(() => {
            this.double = 0
            // 将点击事件派发到父级
            this.$emit('cdHandleClickLeft', data)
          }, 300)
        }
        console.log('当前点击节点数据↓')
        console.log(data)
      },
      // 右键的点击事件 => 参数依次为 event, 数据， 节点， 节点组件本身
      handleClickRight (e, data, node, vm) {
        if (!this.rightClick) return
        
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
      },
      // 关闭菜单
      handlecCloseMenu () {
        this.rightMenu.show = false
      },
      // 选择框的点击事件
      handleCheck () {
        let halfs, checkeds, haleKeys, checkedKeys
        // 获取半选中的节点和key
        halfs = this.$refs.TreeComponent.getHalfCheckedNodes()
        haleKeys = this.$refs.TreeComponent.getHalfCheckedKeys()
        // 得到全选中的节点和key
        checkeds = this.$refs.TreeComponent.getCheckedNodes()
        checkedKeys = this.$refs.TreeComponent.getCheckedKeys()
        // 将当前选择的数据派发到父级处理
        this.$emit('cdHandleTreeCheck', haleKeys.concat(checkedKeys), halfs.concat(checkeds))
      },
      // 是否可以放置, 设置为只能同一层级拖拽
      handleDrop (draggingNode, dropNode, type) {
        return draggingNode.level === dropNode.level && type !== 'inner'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .frad-tree {
    height: 100%;
    width: 240px;
    overflow: auto;
    // border: 1px solid rgb(200, 200, 200);
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
