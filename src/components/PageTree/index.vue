<template>
  <div v-loading="treeLoading" class="page-tree" @contextmenu.prevent="handleTreeClick">
    <el-tree
      ref="TreeComponent"
      class="tree-component disabled-select"
      :show-checkbox="checkBox"
      :node-key="nodeKey"
      :data="treeData"
      :load="handleLoadNode"
      :lazy="loadType === 2"
      :draggable="draggable"
      :allow-drop="handleDrop"
      :default-expand-all="expandAll"
      :expand-on-click-node="clickNode"
      :check-strictly="checkStrictly"
      :filter-node-method="filterNode"
      :default-expanded-keys="defaultExpanded"
      :default-checked-keys="defaultChecked"
      highlight-current
      :render-content="renderContent"
      :props="treeProps"
      @node-click="handleClickLeft"
      @node-contextmenu="handleClickRight"
      @check="handleCheck"
      @check-change="handleCheck"
      @current-change="handleCheck"
      @node-expand="handleCheck"
    />
    <!-- 右键菜单 -->
    <ul v-show="rightMenu.show" class="contextmenu" :style="{left: rightMenu.left +'px',top: rightMenu.top +'px'}">
      <li v-for="(item, index) in rightMenu.list.filter(item => item.show)" :key="index" @click="handleRightEvent(item.type, item.data, item.node, item.vm)">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PageTree',
  props: {
    // shu
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 容器，内部获取到的数据提供外部的接口
    baseData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否手风琴点击
    clickNode: {
      type: Boolean,
      defalult: false
    },
    // 加载方式
    loadType: {
      type: Number,
      defalult: 1 // 1: 正常通过接口加载 2: 懒加载 3: 传入数据
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
            params: { key: '', value: '', type: 'url' }, // url/query->{data: [{key: '', value: '', default: ''}] type: 'query'}
            resFieldList: [], // 数据响应成功的字段列表
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
          key: 'id', // 节点
          label: 'name',
          api: () => {},
          params: { key: '', value: '', type: 'url' }, // url/query->{data: [{key: '', value: '', default: ''}] type: 'query'}
          resFieldList: [] // 数据响应成功的字段列表
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
      type: null
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
        const level = 'node' + (this.refreshLevel - 1 >= 0 ? this.refreshLevel - 1 : 0)
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
      this.$emit('handleEvent', 'leftClick', { data: this.getSelectData(data.key, this.baseData, val.id) })
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    // 自定义渲染内容
    renderContent (h, { node, data, store }) {
      let dom
      // 懒加载图标设置
      if (this.loadType === 2) {
        if (data.leaf) {
          dom = (
            <p class='custom-tree-node'>
              <img src={require('@/assets/image/doc.png')}></img>
              <span style='margin-left:5px;' title={data.desc}>{node.label}</span>
            </p>
          )
        } else {
          dom = (
            <p class='custom-tree-node'>
              <img src={node.expanded ? require('@/assets/image/file-open.png') : require('@/assets/image/file-close.png')}></img>
              <span style='margin-left:5px;' title={data.desc}>{node.label}</span>
            </p>
          )
        }
      } else {
        dom = (
          <p class='custom-tree-node' title={data.desc}>
            <span style='margin-left:5px;' title={data.desc}>{node.label}</span>
          </p>
        )
      }
      // <i class={node.expanded ? 'el-icon-albb-int' : 'el-icon-albb-earth'}></i>
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
        { name: '刷新', type: 'refreshTree', data: null, node: null, vm: null, show: true }
      ]
      // 显示菜单，并且根据点击的位置生成菜单显示的坐标
      this.rightMenu.show = true
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      const len = this.rightMenu.list.length; let top
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
      this.$emit('handleEvent', 'leftClick', { data, node, vm })
    },
    // 右键的点击事件 => 参数依次为 event, 数据， 节点， 节点组件本身
    handleClickRight (e, data, node, vm) {
      if (!this.rightClick) return
      // 显示菜单，并且根据点击的位置生成菜单显示的坐标
      this.rightMenu.show = true
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      const len = this.rightMenu.list.length; let top
      if (len * 30 + e.clientY > h) {
        top = e.clientY - len * 30
      } else {
        top = e.clientY
      }
      this.rightMenu.left = e.clientX
      this.rightMenu.top = top
      this.$emit('handleEvent', 'rightClick', { data, node, vm })
    },
    // 右键的事件触发， 派发到父组件处理
    handleRightEvent (type, data, node, vm) {
      this.$emit('handleEvent', 'rightEvent', { type, data, node, vm })
    },
    // 关闭右键菜单
    handlecCloseMenu () {
      this.rightMenu.show = false
    },
    // 选择框的点击事件
    handleCheck () {
      // 获取半选中的节点和key
      const halfs = this.$refs.TreeComponent.getHalfCheckedNodes()
      const halfKeys = this.$refs.TreeComponent.getHalfCheckedKeys()
      // 得到全选中的节点和key
      const checkeds = this.$refs.TreeComponent.getCheckedNodes()
      const checkedKeys = this.$refs.TreeComponent.getCheckedKeys()
      // 将当前选择的数据派发到父级处理
      this.$emit('handleEvent', 'treeCheck', {
        // 半选中和全选中的节点
        keys: halfKeys.concat(checkedKeys),
        // 半选中和全选中的node
        nodes: halfs.concat(checkeds),
        // 半选中的节点
        halfKeys,
        // 全选中的节点
        checkedKeys,
        // 半选中的node
        halfs,
        // 全选中的node
        checkeds
      })
    },
    // 是否可以放置, 设置为只能同一层级拖拽
    handleDrop (draggingNode, dropNode, type) {
      return draggingNode.level === dropNode.level && type !== 'inner'
    },
    // 正常通过接口加载
    initData () {
      // 非正常加载
      if (this.loadType !== 1) return
      // 加载loading
      this.treeLoading = true
      const treeProps = this.treeProps
      const loadInfo = this.loadInfo
      const params = loadInfo.params || {}
      let data
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
          let resData = res
          const resFieldList = loadInfo.resFieldList
          // 得到定义的响应成功的数据字段
          for (let i = 0; i < resFieldList.length; i++) {
            resData = resData[resFieldList[i]]
          }
          // 数据处理
          arr = JSON.parse(JSON.stringify(resData))
          arr.forEach(item => {
            // 保证刷新之后key的唯一
            item.key = item[loadInfo.key]
            item[treeProps.label] = item[loadInfo.label]
          })
          console.log(resData)
          // 得到数据后把数据给到父级，方便父级用到
          this.$emit('update:baseData', arr)
          // 设置默认高亮
          if (this.defaultHighLight || this.defaultHighLight === 0) {
            this.$nextTick(() => {
              this.$refs.TreeComponent.setCurrentKey(this.defaultHighLight)
            })
          }
          // 设置默认点击
          if ((this.defaultClicked && (this.defaultClicked.id || this.defaultClicked.id === 0))) {
            // 页面初始化，设置默认点击项， 并将点击事件派发到父级
            this.$emit('handleEvent', 'leftClick', { data: this.getSelectData(loadInfo.key, this.baseData, this.defaultClicked.id) || {}})
          }
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
      for (const item of data) {
        if (item[key] === val) {
          return item
        }
      }
    },
    // 懒加载数据
    handleLoadNode (node, resolve) {
      // 非懒加载
      if (this.loadType !== 2) return
      // 加载loading
      if (node.level === 0) {
        this.treeLoading = true
      }
      // 存下每个懒加载的数据
      this.$set(this.nodeInfoList, 'node' + node.level, { node, resolve })
      // 懒加载延迟时间
      const timeStamp = 100
      const treeProps = this.treeProps
      const levelInfo = this.lazyInfo[node.level]
      const params = levelInfo.params; let data
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
          let resData = res
          const resFieldList = levelInfo.resFieldList
          // 得到定义的响应成功的数据字段
          for (let i = 0; i < resFieldList.length; i++) {
            resData = resData[resFieldList[i]]
          }
          // 数据处理
          arr = JSON.parse(JSON.stringify(resData))
          arr.forEach(item => {
            // 保证key的唯一
            item.key = levelInfo.type + item[levelInfo.key]
            item['level' + node.level + 'data'] = node.data
            item[treeProps.label] = item[levelInfo.label]
            item.type = levelInfo.type
            item[treeProps.isLeaf] = levelInfo.leaf
          })
          // 得到数据后把数据给到父级，方便父级用到
          this.$emit('update:baseData', [...this.baseData, ...arr])
          // 设置默认高亮
          if (this.defaultHighLight || this.defaultHighLight === 0) {
            this.$nextTick(() => {
              this.$refs.TreeComponent.setCurrentKey(this.defaultHighLight)
            })
          }
          // 设置默认点击
          if ((this.defaultClicked && (this.defaultClicked.id || this.defaultClicked.id === 0))) {
            // 页面初始化，设置默认点击项， 并将点击事件派发到父级
            this.$emit('handleEvent', 'leftClick', { data: this.getSelectData(levelInfo.key, this.baseData, this.defaultClicked.id) || {}})
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
