<template>
  <div class="page-tree" @contextmenu.prevent="handleTreeClick">
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
      :render-content="renderContent"
      :props="treeProps">
    </el-tree>
    <!-- 右键菜单 -->
    <ul class='contextmenu' v-show="rightMenu.show" :style="{left: rightMenu.left +'px',top: rightMenu.top +'px'}">
      <li v-for="(item, index) in rightMenu.list" :key="index" @click="handleRightEvent(item.type, item.data, item.node, item.vm)">{{item.name}}</li>
    </ul>
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
    /**
     * 懒加载相关数据
     * key -> 唯一标识 label -> 显示 type -> 类型 api -> 接口 params -> 参数 leaf -> 是否叶子节点
     */
    lazyInfo: {
      type: Array,
      default: () => {
        return [
          {
            key: 'id',
            label: 'name',
            type: '',
            api: () => {},
            params: {key: '', value: ''},
            leaf: true
          }
        ]
      }
    },
    // 默认选中的项
    defaultChecked: {
      type: Array
    },
    // 默认点击的项
    defaultClicked: {
      type: Number
    },
    // 默认展开项
    defaultExpanded: {
      type: Array
    },
    // 默认高亮
    defaultHighLight: {
      type: String || Number
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
      default: true
    },
    // 右键菜单列表
    rightMenuList: {
      type: Array,
      default: () => {
        return [
          {name: '刷新树', type: 'refreshTree'}
        ]
      }
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
          label: 'name',
          isLeaf: 'leaf'
        }
      }
    },
    // 传入一个随机数，让树组件更新
    treeRefresh: {
      type: Boolean
    },
    // 要刷新的层级
    refreshLevel: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      rightMenu: {
        show: false,
        left: 0,
        top: 0,
        list: [
          {name: '刷新树', type: 'refreshTree', data: null, node: null, vm: null}
        ]
      },
      // 每个level的节点信息
      nodeInfoList: {}
    }
  },
  watch: {
    'rightMenu.show' (val) {
      if (val) {
        document.body.addEventListener('click', this.handlecCloseMenu)
      } else {
        document.body.removeEventListener('click', this.handlecCloseMenu)
      }
    },
    rightMenuList (val) {
      if (val.length === 0) return
      // 处理右键要显示的菜单内容
      this.rightMenu.list = val
    },
    treeRefresh (val) {
      let level = 'node' + (this.refreshLevel - 1 >= 0 ? this.refreshLevel - 1 : 0)
      this.nodeInfoList[level].node.childNodes = [] // 清空子节点, 保证数据不会重复渲染
      this.handleLoadNode(this.nodeInfoList[level].node, this.nodeInfoList[level].resolve)
      // 关闭菜单
      this.handlecCloseMenu()
    }
  },
  methods: {
    // 自定义渲染内容
    renderContent (h, { node, data, store }) {
      let dom
      if (data.leaf) {
        dom = (
          <p class="custom-tree-node">
            <img src={require('@/assets/image/doc.png')}></img>
            <span style="margin-left:5px;" title={data.desc}>{node.label}</span>
          </p>
        )
      } else {
        dom = (
          <p class="custom-tree-node">
            <img src={node.expanded ? require('@/assets/image/file-open.png') : require('@/assets/image/file-close.png')}></img>
            <span style="margin-left:5px;" title={data.desc}>{node.label}</span>
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
      // 显示菜单，并且根据点击的位置生成菜单显示的坐标
      this.rightMenu.show = true
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        len = this.rightMenu.list.length, top
      if (len * 30 + e.clientY > h) {
        top = e.clientY - len * 30
      } else {
        top = e.clientY
      }
      this.rightMenu.left = e.clientX
      this.rightMenu.top = top
    },
    // 节点左键点击
    handleClickLeft (data, node, vm) {
      this.$emit('handleEvent', 'leftClick', {data, node, vm})
    },
    // 右键的点击事件 => 参数依次为 event, 数据， 节点， 节点组件本身
    handleClickRight (e, data, node, vm) {
      if (!this.rightClick) return
      // 显示菜单，并且根据点击的位置生成菜单显示的坐标
      this.rightMenu.show = true
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        len = this.rightMenu.list.length, top
      if (len * 30 + e.clientY > h) {
        top = e.clientY - len * 30
      } else {
        top = e.clientY
      }
      this.rightMenu.left = e.clientX
      this.rightMenu.top = top
      this.$emit('handleEvent', 'rightClick', {data, node, vm})
    },
    // 右键的事件触发， 派发到父组件处理
    handleRightEvent (type, data, node, vm) {
      this.$emit('handleEvent', 'rightEvent', {type, data, node, vm})
    },
    // 关闭右键菜单
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
      this.$emit('handleEvent', 'check', {haleKeys: haleKeys.concat(checkedKeys), halfs: halfs.concat(checkeds)})
    },
    // 是否可以放置, 设置为只能同一层级拖拽
    handleDrop (draggingNode, dropNode, type) {
      return draggingNode.level === dropNode.level && type !== 'inner'
    },
    // 非懒加载
    initData () {
      // 懒加载不往下处理
      if (this.lazy) return
      // 空数据不往下处理
      if (this.treeData.length === 0) return
      // 设置默认高亮
      if (this.defaultHighLight) {
        this.$nextTick(() => {
          this.$refs.TreeComponent.setCurrentKey(this.defaultHighLight)
        })
      }
      // 设置默认点击
      if (this.defaultClicked) {
        // 页面初始化，设置默认点击项， 并将点击事件派发到父级
        this.$emit('handleEvent', 'leftClick', {data: this.getSelectData(this.treeData, this.defaultClicked)})
      }
    },
    // 在树状数据中找到某一条数据
    getSelectData (data, val) {
      for (let item of data) {
        if (item[this.nodeKey] === val) {
          return item
        } else if (Array.isArray(item.children) && item.children.length > 0) {
          this.getSelectData(item.children, val)
        }
      }
    },
    // 懒加载数据
    handleLoadNode (node, resolve) {
      // 存下每个懒加载的数据
      this.$set(this.nodeInfoList, 'node' + node.level, {node, resolve})
      // 懒加载延迟时间
      let timeStamp = 100,
        treeProps = this.treeProps,
        levelInfo = this.lazyInfo[node.level],
        params = levelInfo.params,
        // TODO: 参数暂时设置为pid类型，之后考虑扩展
        query = params.value || params.value === 0 ? params.value : node.data[levelInfo.key]
      levelInfo.api(query).then(res => {
        let arr = []
        if (res.success) {
          arr = JSON.parse(JSON.stringify(res.content))
          arr.forEach(item => {
            // 保证刷新之后key的唯一
            item.key = levelInfo.type + item[levelInfo.key] + Math.random()
            item['level' + node.level + 'data'] = node.data
            item[treeProps.label] = item[levelInfo.label]
            item.type = levelInfo.type
            item[treeProps.isLeaf] = levelInfo.leaf
          })
          // 初始化时设置相关参数
          if (node.level === 0) {
            // 设置默认高亮
            if (this.defaultHighLight) {
              this.$nextTick(() => {
                this.$refs.TreeComponent.setCurrentKey(this.defaultHighLight)
              })
            }
            // 设置默认点击
            if (this.defaultClicked) {
              // 页面初始化，设置默认点击项， 并将点击事件派发到父级
              this.$emit('handleEvent', 'leftClick', {data: this.getSelectData(this.treeData, this.defaultClicked)})
            }
          }
        }
        // 延迟加载，保证加载动画
        setTimeout(() => {
          resolve(arr)
        }, timeStamp)
      }).catch(() => {
        // 延迟加载，保证加载动画
        setTimeout(() => {
          resolve([])
        }, timeStamp)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tree{
}
</style>
