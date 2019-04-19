<template>
  <div class="page-tree" v-loading="treeLoading" @contextmenu.prevent="handleTreeClick">
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
      :default-expand-all="expandAll"
      :expand-on-click-node="clickNode"
      :check-strictly="checkStrictly"
      :filter-node-method="filterNode"
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
      <li v-for="(item, index) in rightMenu.list.filter(item => item.show)" :key="index" @click="handleRightEvent(item.type, item.data, item.node, item.vm)">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PageTree',
  props: {
    // 容器，内部获取到的数据提供外部的接口
    baseData: {
      type: Array
    },
    // 是否手风琴点击
    clickNode: {
      type: Boolean,
      defalult: false
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
            data: [],
            key: 'id',
            label: 'name',
            type: '',
            api: () => {},
            params: {key: '', value: '', type: 'url'}, // url/query->{data: [{key: '', value: '', default: ''}] type: 'query'}
            leaf: true
          }
        ]
      }
    },
    /**
     * 正常加载相关
     */
    loadInfo: {
      type: Object,
      default: () => {
        return {
          data: [],
          key: 'id',
          label: 'name',
          api: () => {},
          params: {key: '', value: '', type: 'url'} // url/query->{data: [{key: '', value: '', default: ''}] type: 'query'}
        }
      }
    },
    // 默认选中的项
    defaultChecked: {
      type: Array
    },
    // 默认点击的项 (设置为obj，保证能一直监听到数据的变化)
    defaultClicked: {
      type: Object,
      defalult: () => {
        return {}
      }
    },
    // 默认展开项
    defaultExpanded: {
      type: Array
    },
    // 默认高亮
    defaultHighLight: {
      // type: String || Number
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
        return []
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
      type: Number
    },
    // 要刷新的层级
    refreshLevel: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      treeLoading: false,
      treeData: [],
      rightMenu: {
        show: false,
        left: 0,
        top: 0,
        list: []
      },
      node: null,
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
      if (this.lazy) {
        let level = 'node' + (this.refreshLevel - 1 >= 0 ? this.refreshLevel - 1 : 0)
        this.nodeInfoList[level].node.childNodes = [] // 清空子节点, 保证数据不会重复渲染
        this.handleLoadNode(this.nodeInfoList[level].node, this.nodeInfoList[level].resolve)
      } else {
        this.initData()
      }
      // 关闭菜单
      this.handlecCloseMenu()
    },
    // 树组件默认高亮的节点
    defaultHighLight (val) {
      this.$nextTick(() => {
        this.$refs.TreeComponent.setCurrentKey(val)
      })
    },
    // 页面默认点击的节点
    defaultClicked (val) {
      if (!val.id) return
      const data = this.lazy ? this.lazyInfo : this.loadInfo
      this.$emit('handleEvent', 'leftClick', {data: this.getSelectData(data.key, this.baseData, val.id)})
    },
    // 设置选中的节点，直接使用这个属性可能会导致父节点勾中，子节点全部选中的问题
    defaultChecked (val) {
      this.initDefaultChecked(val)
    }
  },
  mounted () {
    this.initData()
    this.initDefaultChecked(this.defaultChecked)
  },
  methods: {
    // TODO: elementui-tree组件内部问题，有时无法成功选中，先用延时器的方法保证效果
    initDefaultChecked (val = []) {
      if (val.length === 0) return
      setTimeout(() => {
        this.$nextTick(() => {
          // 将节点选中的状态初始化
          this.$refs.TreeComponent.setCheckedNodes([])
          for (let i = 0; i < val.length; i++) {
            // 得到选中的节点,这个方法ojbk
            this.$refs.TreeComponent.setChecked(val[i], true)
          }
        })
      }, 100)
    },
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
      // 初始菜单
      this.rightMenu.list = [
        {name: '刷新', type: 'refreshTree', data: null, node: null, vm: null, show: true}
      ]
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
      // 关闭菜单
      this.handlecCloseMenu()
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
      this.$emit('handleEvent', 'treeCheck', {haleKeys: haleKeys.concat(checkedKeys), halfs: halfs.concat(checkeds)})
    },
    // 是否可以放置, 设置为只能同一层级拖拽
    handleDrop (draggingNode, dropNode, type) {
      return draggingNode.level === dropNode.level && type !== 'inner'
    },
    // 非懒加载
    initData () {
      // 懒加载不往下处理
      if (this.lazy) return
      // 加载loading
      this.treeLoading = true
      let treeProps = this.treeProps,
        loadInfo = this.loadInfo,
        params = loadInfo.params || {}, data
      if (params.type === 'url') {
        data = params.value
      } else if (params.type === 'query') {
        data = {}
        params.data.forEach(item => {
          data[item.key] = item.value
        })
      } else {
        // console.log('没有传参数类型')
      }
      loadInfo.api(data).then(res => {
        let arr = []
        if (res.success) {
          if (res.content.length > 0) {
            // 得到数据后把数据给到父级，方便父级用到
            this.$emit('update:baseData', res.content)
            arr = JSON.parse(JSON.stringify(res.content))
            arr.forEach(item => {
              // 保证刷新之后key的唯一
              item.key = item[loadInfo.key]
              item[treeProps.label] = item[loadInfo.label]
            })
            // 设置默认高亮
            if (this.defaultHighLight || this.defaultHighLight === 0) {
              this.$nextTick(() => {
                this.$refs.TreeComponent.setCurrentKey(this.defaultHighLight)
              })
            }
            // 设置默认点击
            if ((this.defaultClicked && (this.defaultClicked.id || this.defaultClicked.id === 0))) {
              // 页面初始化，设置默认点击项， 并将点击事件派发到父级
              this.$emit('handleEvent', 'leftClick', {data: this.getSelectData(loadInfo.key, this.baseData, this.defaultClicked.id)})
            }
          }
          this.treeData = this.$fn.getTreeArr({key: loadInfo.key, pKey: loadInfo.pKey, data: arr})
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: res.success ? 'success' : 'error',
            duration: 2000
          })
        }
        // 加载loading
        this.treeLoading = false
      }).catch(() => {
        // 加载loading
        this.treeLoading = false
      })
    },
    // 在树状数据中找到某一条数据
    getSelectData (key, data, val) {
      for (let item of data) {
        if (item[key] === val) {
          return item
        }
      }
    },
    // 懒加载数据
    handleLoadNode (node, resolve) {
      // 加载loading
      if (node.level === 0) {
        this.treeLoading = true
      }
      // 存下每个懒加载的数据
      this.$set(this.nodeInfoList, 'node' + node.level, {node, resolve})
      // 懒加载延迟时间
      let timeStamp = 100,
        treeProps = this.treeProps,
        levelInfo = this.lazyInfo[node.level],
        params = levelInfo.params, data
      if (params.type === 'url') {
        data = this.refreshLevel > 0 ? node.data[levelInfo.key] : params.value || params.value === 0 ? params.value : node.data[levelInfo.key]
      } else if (params.type === 'query') {
        params.data.forEach(item => {
          data = {}
          data[item.key] = item.default || node.data[item.value]
        })
      } else {
        console.log('没有传参数类型')
      }
      levelInfo.api(data).then(res => {
        let arr = []
        if (res.success) {
          if (res.content.length > 0) {
            // 得到数据后把数据给到父级，方便父级用到
            this.$emit('update:baseData', [...this.baseData, ...res.content])
            arr = JSON.parse(JSON.stringify(res.content))
            arr.forEach(item => {
              // 保证key的唯一
              item.key = levelInfo.type + item[levelInfo.key]
              item['level' + node.level + 'data'] = node.data
              item[treeProps.label] = item[levelInfo.label]
              item.type = levelInfo.type
              item[treeProps.isLeaf] = levelInfo.leaf
            })
            // 设置默认高亮
            if (this.defaultHighLight || this.defaultHighLight === 0) {
              this.$nextTick(() => {
                this.$refs.TreeComponent.setCurrentKey(this.defaultHighLight)
              })
            }
            // 设置默认点击
            if ((this.defaultClicked && (this.defaultClicked.id || this.defaultClicked.id === 0))) {
              // 页面初始化，设置默认点击项， 并将点击事件派发到父级
              this.$emit('handleEvent', 'leftClick', {data: this.getSelectData(levelInfo.key, this.baseData, this.defaultClicked.id)})
            }
          }
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: res.success ? 'success' : 'error',
            duration: 2000
          })
        }
        // 延迟加载，保证加载动画
        setTimeout(() => {
          resolve(arr)
        }, timeStamp)
        // 加载loading
        if (node.level === 0) {
          this.treeLoading = false
        }
      }).catch(() => {
        // 延迟加载，保证加载动画
        setTimeout(() => {
          resolve([])
        }, timeStamp)
        // 加载loading
        if (node.level === 0) {
          this.treeLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tree{
}
</style>
