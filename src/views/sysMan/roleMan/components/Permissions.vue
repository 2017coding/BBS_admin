<template>
  <div class="permissions">
    <el-tabs v-model="menuType">
      <el-tab-pane
        v-for="(item, index) in listTypeInfo.menuTypeList"
        :key="index"
        class="tab"
        :label="item.key"
        :name="item.value + ''"
      >
        <!-- 点击加载 -->
        <template v-if="item.value + '' === menuType">
          <!-- 左侧树 -->
          <div class="left">
            <page-tree
              :expand-all="true"
              :check-box="true"
              :load-type="1"
              :default-clicked="treeInfo.defaultClicked"
              :default-high-light="treeInfo.defaultHighLight"
              :default-expanded="treeInfo.defaultExpanded"
              :default-checked="treeInfo.defaultChecked"
              :tree-data="treeInfo.treeData"
              :base-data.sync="treeInfo.baseData"
              :node-key="treeInfo.nodeKey"
              :load-info.sync="treeInfo.loadInfo"
              :right-menu-list="treeInfo.rightMenuList"
              :tree-refresh="treeInfo.refresh"
              :refresh-level="treeInfo.refreshLevel"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
          </div>
          <div class="right">
            <!-- 点击页面组件时显示 -->
            <!-- 表格 -->
            <page-table
              v-show="treeInfo.leftClickData.component === 1"
              :listen-height="false"
              :check-box="true"
              :class="'table'"
              :refresh="tableInfo.refresh"
              :pager="tableInfo.pager"
              :data.sync="tableInfo.data"
              :checked-list="roleRelation.permissions"
              :api="getRoleDataPermsApi"
              :query="{menuId: treeInfo.leftClickData.id}"
              :field-list="tableInfo.fieldList"
              :list-type-info="listTypeInfo"
              :handle="tableInfo.handle"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
            <!-- 提示 -->
            <p
              v-show="treeInfo.leftClickData.component !== 1"
              class="tips"
            >
              选择功能页面可查看相关数据权限
            </p>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPermissionsApi } from '@/api/sysMan/roleMan'
import { getRoleMenuApi, getRoleDataPermsApi } from '@/api/sysMan/menuMan'
import PageTree from '@/components/PageTree'
import PageTable from '@/components/PageTable'

export default {
  components: {
    PageTree,
    PageTable
  },
  props: {
    roleId: {
      type: Number
    },
    rolePId: {
      type: Number
    },
    params: {
      type: Object,
      default: () => {
        return {
          menu: [],
          permissions: [],
          roleId: ''
        }
      }
    }
  },
  data () {
    return {
      getRoleDataPermsApi,
      // 菜单类型
      menuType: '',
      // 相关列表
      listTypeInfo: {
        statusList: [
          { key: '启用', value: 1 },
          { key: '停用', value: 0 }
        ],
        menuTypeList: [
          { key: '平台端', value: 1, status: false },
          { key: '论坛端', value: 2, status: false },
          { key: '移动端', value: 3, status: false }
        ],
        componentsList: [
          { key: '根目录', value: -1 },
          { key: '页面组件', value: 1 },
          { key: '默认布局组件', value: 2 }
        ],
        dataControlTypeList: [
          { key: '按钮点击', value: 1 },
          { key: '右键菜单', value: 2 },
          { key: '链接访问', value: 3 }
        ],
        reqTypeList: [
          { key: 'GET', value: 1 },
          { key: 'POST', value: 2 },
          { key: 'PUT', value: 3 },
          { key: 'DELETE', value: 4 }
        ],
        treeList: []
      },
      // 树相关信息
      treeInfo: {
        initTree: false, // 初始化加载
        refresh: 1, // 刷新
        nodeKey: 'key', // 节点绑定字段
        defaultClicked: {}, // 默认点击 (设置为对象，保证数据能被监听到)
        defaultHighLight: '', // 默认高亮
        defaultExpanded: [], // 默认展开
        defaultChecked: [], // 默认选中列表
        // 对树删除编辑添加时的临时存储，在树刷新后赋值这些数据的
        defaultClickedAsyc: '', // 默认点击
        defaultHighLightAsyc: '', // 默认高亮
        defaultExpandedAsyc: [], // 默认展开
        treeData: [], // 树渲染数据(非懒加载时由外部渲染)
        baseData: [], // 树的基础数据，从组件中获取到
        // 加载相关数据
        loadInfo: {
          key: 'id', // 节点id
          pKey: 'pid', // 节点父级id
          label: 'name', // 节点名称字段
          api: getRoleMenuApi, // 获取数据的接口
          params: { data: [{ key: 'type', value: 1 }, { key: 'roleId', value: this.rolePId }], type: 'query' },
          resFieldList: ['content'] // 数据所在字段
        },
        leftClickData: {}
      },
      // 表格相关
      tableInfo: {
        refresh: 1,
        initTable: false,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '所属菜单', value: 'menu_id', list: 'treeList', required: true },
          { label: '触发类型', value: 'type', list: 'dataControlTypeList', required: true },
          // {label: '功能编码', value: 'code', required: true},
          { label: '功能名称', value: 'name', required: true }
          // {label: '功能api', value: 'api', required: true},
          // {label: '请求方式', value: 'method', list: 'reqTypeList', required: true}
        ]
      },
      // 角色依赖的相关数据
      roleRelation: {
        menu: [],
        permissions: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    'menuType' (val) {
      const treeInfo = this.treeInfo
      // 修改树组件参数
      treeInfo.loadInfo.params.data[0].value = val
      // 设置树重新初始化
      treeInfo.initTree = false
      // 刷新树
      // treeInfo.refresh = Math.random()
    },
    // 得到树组件数据，处理相关事件
    'treeInfo.baseData' (val) {
      // 得到树状数据
      this.treeInfo.treeData = this.$fn.getTreeArr({
        key: 'id',
        pKey: 'pid',
        data: val
      })
      this.initTree(val)
    },
    roleId: {
      handler: function (val) {
        if (!val) return
        this.getPermissions()
        this.$emit('update:params', { ...this.params, ...{ roleId: val }})
      },
      immediate: true
    }
  },
  created () {
    this.menuType = '1'
  },
  methods: {
    initTree (val) {
      const treeInfo = this.treeInfo
      val.forEach(item => {
        if (item.pid === -1) {
          item.disabled = true
        }
      })
      // 初始化树
      if (!treeInfo.initTree) {
        treeInfo.initTree = true
        // 容错处理
        if (val[0]) {
          // 设置默认
          treeInfo.defaultClicked = { id: val[0].id }
          treeInfo.defaultHighLight = val[0].id
          treeInfo.defaultExpanded = [val[0].id]
        }
      }

      // 设置列表
      this.listTypeInfo.treeList = val.map(item => {
        item.key = item.name
        item.value = item.id
        return item
      })
    },
    // 获取权限
    getPermissions () {
      getPermissionsApi({ roleId: this.roleId }).then(res => {
        if (res.success) {
          const data = res.content
          const checkArr = data.menu
          // 得到要勾选的数据, 将父级过滤掉
          for (const item of this.treeInfo.baseData) {
            checkArr.forEach((item1, index1) => {
              let key
              // 得到属于父节点的数据
              if (item.pid === item1) {
                key = index1
              }
              checkArr.forEach((item2, index2) => {
                // 如果当前项为父节点，则把他删除
                if (item2 === checkArr[key]) {
                  checkArr.splice(index2, 1)
                }
              })
            })
          }
          this.treeInfo.defaultChecked = checkArr
          this.roleRelation.permissions = data.permissions
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: res.success ? 'success' : 'error',
            duration: 2000
          })
        }
      })
    },
    // 按钮点击
    handleClick (event, data) {
      switch (event) {
        case 'save':
          break
      }
    },
    // 触发事件
    handleEvent (event, data) {
      const treeInfo = this.treeInfo
      const tableInfo = this.tableInfo
      const roleRelation = this.roleRelation
      switch (event) {
      // 左键点击的处理
        case 'leftClick':
          tableInfo.data = []
          tableInfo.refresh = Math.random()
          treeInfo.leftClickData = JSON.parse(JSON.stringify(data.data))
          break
          // 树选中事件
        case 'treeCheck':
          roleRelation.menu = data.keys
          this.$emit('update:params', { ...this.params, ...roleRelation })
          break
          // 表格的选中事件 (实现分页保存选中功能)
        case 'tableCheck':
          const selectIds = []
          let unSelectedIds = []
          const selectedList = JSON.parse(JSON.stringify(roleRelation.permissions))
          // 拿到当前列表中未选中的数据
          if (data.length === 0) {
            unSelectedIds = this.tableInfo.data.map(item => {
              return item.id
            })
          } else {
            this.tableInfo.data.forEach(item => {
              let index = 0
              data.forEach((item1, index1) => {
                if (item1 && item1.id) {
                // 得到当前选中的ID
                  selectIds.push(item1.id)
                  // 当列表中的数据在选择的数据中不存在
                  if (item.id !== item1.id) {
                    index++
                  }
                }
              })
              // 得到当前未选中的id
              if (index === data.length) {
                unSelectedIds.push(item.id)
              }
            })
          }
          // 从当期列表中将未选中的元素删除
          unSelectedIds.forEach(item1 => {
          // 判断要删除的数据是否在选择的数据中
            if (selectedList.indexOf(item1) === -1) return
            selectedList.splice(selectedList.indexOf(item1), 1)
          })
          // 合并选中并去重
          roleRelation.permissions = [...new Set(selectIds.concat(selectedList))]
          this.$emit('update:params', { ...this.params, ...roleRelation })
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .permissions{
    .tab{
      display: flex;
      padding-bottom: 10px;
      width: 100%;
    }
    .left, .right{
      height: 400px;
      overflow: auto;
    }
    .left{
      width: 220px;
    }
    .right{
      position: relative;
      margin-left: 10px;
      flex: 1;
    }
    .tips{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
    }
  }
</style>
