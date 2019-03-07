<template>
  <div class="app-container P0401A">
    <div class="filter-container" style="float: left; margin-left: -10px">
      <div class="filter-item">
        <label class="filter-label">模块类型:</label>
        <el-select v-model="listInfo.query.mod_type" placeholder="请选择模块类型" style="width: 160px;">
          <el-option v-for="(item, index) in  listTypeInfo.modTypeList" :key="index" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </div>
    </div>
    <!-- 左侧数结构 -->
    <div class="tree">
      <Tree
        :treeData="treeInfo.initData"
        :rightClick="true"
        :draggable="true"
        :rightMenuInfo="treeInfo.rightMenu"
        @cdHandleClickLeft="cdHandleClickLeft"
        @cdHandleClickRight="cdHandleClickRight"
        @cdHandleRightEvent="cdHandleRightEvent">
      </Tree>
    </div>
    <!-- 右侧页面 -->
    <div class="content">
      <!-- 查询模块 -->
      <div class="filter-container">
      </div>
      <!-- 功能模块 -->
      <div class="filter-container">
      </div>
      <!-- 显示表单 -->
      <el-form :model="listInfo.data" ref="form" label-width="120px" class="el-form-default">
        <!-- <el-form-item label="模块类型" prop="mod_type">
          <el-select v-model="form.mod_type" placeholder="请选择模块类型">
            <el-option v-for="(item, index) in  listTypeInfo.modTypeList" :key="index" :label="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="父模块" prop="mod_pid">
          <!-- <el-select v-model="listInfo.data.mod_pid" placeholder="请选择父模块" filterable>
            <el-option v-for="(item, index) in  listTypeInfo.pModList" :key="index" :label="item.title" :value="item.mod_id"></el-option>
          </el-select> -->
          <el-input 
            :value="$fn.getDataName({dataList: listTypeInfo.pModList, value: 'mod_id', label: 'title', data: listInfo.data.mod_pid})" 
            placeholder="父模块"
            readonly>
          </el-input>
        </el-form-item>
        <el-form-item label="模块编码" prop="mod_code">
          <el-input v-model.trim="listInfo.data.mod_code" placeholder="模块编码" readonly></el-input>
        </el-form-item>
        <el-form-item label="模块名称" prop="mod_name">
          <el-input v-model.trim="listInfo.data.mod_name" placeholder="模块名称" readonly></el-input>
        </el-form-item>
        <el-form-item label="模块组件" prop="mod_component">
          <!-- <el-select v-model="listInfo.data.mod_component" placeholder="请选择模块类型">
            <el-option v-for="(item, index) in  listTypeInfo.modComponentList" :key="index" :label="item.key" :value="item.value"></el-option>
          </el-select> -->
          <el-input 
            :value="$fn.getDataName({dataList: listTypeInfo.modComponentList, value: 'value', label: 'key', data: listInfo.data.mod_component})" 
            placeholder="模块组件"
            readonly>
          </el-input>
        </el-form-item>
        <el-form-item label="模块重定向" prop="mod_redirect">
          <!-- <el-select v-model="listInfo.data.mod_redirect" placeholder="请选择重定向地址">
            <el-option v-for="(item, index) in  listTypeInfo.childModList" :key="index" :label="item.title" :value="item.completePath"></el-option>
          </el-select> -->
          <el-input 
            :value="$fn.getDataName({dataList: listTypeInfo.childModList, value: 'completePath', label: 'title', data: listInfo.data.mod_redirect})" 
            placeholder="模块重定向"
            readonly>
          </el-input>
        </el-form-item>
        <el-form-item label="模块图标" prop="mod_icon">
          <el-input placeholder="请输入内容" :value="listInfo.data.mod_icon">
            <template slot="prepend">
              <i v-if="listInfo.data.mod_type !== 3" :class="listInfo.data.mod_icon" style="display: inline-block; vertical-align: middle; max-width: 30px; font-size: 20px;"></i>
              <img v-else :src="listInfo.data.mod_icon" style="display: inline-block; vertical-align: middle; max-width: 30px; font-size: 20px;">
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="mod_sort">
          <el-input v-model.trim="listInfo.data.mod_sort" placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="mod_desc">
          <el-input v-model.trim="listInfo.data.mod_desc" placeholder="备注" readonly></el-input>
        </el-form-item>
      </el-form>
      <!-- 操作弹窗 -->
      <el-dialog :title="dialogInfo.header[dialogInfo.status]" :visible.sync="dialogInfo.show">
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
          <el-form-item label="模块类型" prop="mod_type">
            <el-tag >{{$fn.getDataName({dataList: listTypeInfo.modTypeList, value: 'value', label: 'key', data: form.mod_type})}}</el-tag>
          </el-form-item>
          <el-form-item label="父模块" prop="mod_pid">
            <el-tag v-if="form.mod_pid !== 0">{{$fn.getDataName({dataList: listTypeInfo.pModList, value: 'mod_id', label: 'title', data: form.mod_pid})}}</el-tag>
            <el-tag v-else>{{$fn.getDataName({dataList: listTypeInfo.modTypeList, value: 'value', label: 'key', data: form.mod_type})}}模块</el-tag>
          </el-form-item>
          <el-form-item label="模块编码" prop="mod_code">
            <el-input v-model.trim="form.mod_code" placeholder="请输入模块编码"></el-input>
          </el-form-item>
          <el-form-item label="模块名称" prop="mod_name">
            <el-input v-model.trim="form.mod_name" placeholder="请输入模块名称"></el-input>
          </el-form-item>
          <el-form-item label="模块组件" prop="mod_component">
            <!-- <el-select v-model="form.mod_component" placeholder="请选择模块类型" filterable>
              <el-option v-for="(item, index) in  listTypeInfo.modComponentList" :key="index" :label="item.key" :value="item.value"></el-option>
            </el-select> -->
            <el-tag >{{$fn.getDataName({dataList: listTypeInfo.modComponentList, value: 'value', label: 'key', data: form.mod_component})}}</el-tag>
          </el-form-item>
          <el-form-item label="模块重定向" prop="mod_redirect">
            <el-select v-model="form.mod_redirect" placeholder="请选择重定向地址" filterable clearable v-if="form.mod_type !== 3">
              <el-option v-for="(item, index) in  listTypeInfo.childModList" :key="index" :label="item.title" :value="item.completePath"></el-option>
            </el-select>
            <el-input v-model.trim="form.mod_redirect" placeholder="请输入重定向地址" v-else></el-input>
          </el-form-item>
          <el-form-item label="模块图标" prop="mod_icon">
            <template v-if="form.mod_type !== 3">
              <el-select v-model="form.mod_icon" placeholder="请选择图标" filterable clearable>
                <template slot="prefix">
                  <i :class="'header-icon ' + form.mod_icon" style="vertical-align: middle; font-size: 20px; color: black" v-if="form.mod_icon"></i>
                </template>
                <el-option v-for="(item, index) in  iconList" :key="index" :label="item.class" :value="item.class">
                  <slot>
                    <i :class="item.class" style="display: inline-block; vertical-align: middle; width: 30px; font-size: 20px"></i>{{item.class}}
                  </slot>
                </el-option>
              </el-select>
              <!-- <el-input v-model.trim="form.mod_icon" placeholder="请输入模块图标"></el-input> -->
            </template>
            <template v-else>
              <el-button type="success" size="small" @click="dialogInfo.iCon = true">{{form.mod_icon ? '修改图标' : '选择图标'}}</el-button>
              <img v-show="form.mod_icon" :src="form.mod_icon" style="vertical-align: middle;display: inline-block;width: 100px;height: 100px;border-radius: 7px">
            </template>
          </el-form-item>
          <el-form-item label="排序" prop="mod_sort">
            <el-input v-model.number="form.mod_sort" placeholder="请输入排序"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="mod_desc">
            <el-input v-model.number="form.mod_desc" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="mod_status">
            <el-select v-model="form.mod_status" placeholder="请选择状态">
              <el-option v-for="(item, index) in  listTypeInfo.statusList" :key="index" :label="item.key" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel('form')">取消</el-button>
          <el-button type="primary" :loading="dialogInfo.btLoading" @click="handleConfirm(dialogInfo.status)">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog width="45%" title="选择图标" :visible.sync="dialogInfo.iCon" :append-to-body="true" :lock-scroll="false">
        <Ic @iconUrl="iconUrl"></Ic>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tree from '@/components/tree/index'
import Ic from '@/components/selecPicture/index'
// 布局组件
import horizontal from '@/views/layout/horizontal'
import vertical from '@/views/layout/vertical'

import { iconList } from './js/icon.js'
// 引入接口
import { getModApi, addModApi, updateModApi, deleteModApi } from '@/api/platform/P0401A'

// 定义提示弹窗初始参数
let MESSAGE, TYPE

export default {
  name: 'P0401A',
  components: {
    Tree,
    Ic
  },
  data () {
    // 检测项目编号
    const checkCode = (rule, value, callback) => {
      let check = this.$validate({label: '编码', value, rules: ['notnull', 'noChinese', 'max'], conditions: [12]})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检查数字
    const checkNum = (rule, value, callback) => {
      let check = this.$validate({label: '排序', value, rules: ['notnull', 'number']})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      iconList,
      // 刷新数据标识
      isRefreshData: false,
      // 列表相关
      listInfo: {
        data: {
          mod_id: '', // 模块ID *
          mod_type: 1, // 模块类型 *
          mod_pid: '', // 父模块ID *
          mod_code: '', // 模块编码 *
          mod_name: '', // 模块名称 *
          mod_component: '', // 模块对应组件(平台级默认为水平组件，项目级默认为垂直组件，子页面和移动端默认为对应页面)
          mod_icon: '', // 模块图标
          mod_redirect: '', // 模块重定向路径
          mod_sort: '', // 排序 *
          mod_status: 1, // 模块状态 *
          mod_adduser: '', // 创建人 *
          mod_addtime: '' // 创建时间 *
        },
        // 查询条件
        query: {
          curPage: 1,
          pageSize: this.$config.PAGESIZE,
          mod_type: 1,
          mod_name: ''
        }
      },
      // 页面相关的列表类型
      listTypeInfo: {
        // 父模块列表
        pModList: [],
        // 子模块列表
        childModList: [],
        // 模块类型
        modTypeList: [
          {value: 1, key: '平台级'},
          {value: 2, key: '项目级'},
          {value: 3, key: '移动端'}
        ],
        // 组件类型
        modComponentList: [
          {value: 1, key: '页面组件'},
          {value: 2, key: '水平布局组件'},
          {value: 3, key: '垂直布局组件'}
        ],
        // 状态
        statusList: [
          {value: 0, key: '停用'},
          {value: 1, key: '启用'}
        ]
      },
      // 弹窗相关
      dialogInfo: {
        header: {
          add: '添加',
          update: '编辑'
        },
        show: false,
        status: '',
        btLoading: false,
        iCon: false
      },
      // 表单参数
      form: {
        mod_id: '', // 模块ID *
        mod_type: 0, // 模块类型 *
        mod_pid: '', // 父模块ID *
        mod_code: '', // 模块编码 *
        mod_name: '', // 模块名称 *
        mod_component: '', // 模块对应组件(平台级默认为水平组件，项目级默认为垂直组件，子页面默认为对应页面)
        mod_icon: '', // 模块图标
        mod_redirect: '', // 模块重定向路径
        mod_sort: '', // 排序 *
        mod_desc: '', // 备注
        mod_status: 1, // 模块状态 *
        mod_adduser: '', // 创建人 *
        mod_addtime: '', // 创建时间 *
      },
      // 表单验证规则
      rules: {
        mod_name: [
          {
            required: true,
            message: "请输入模块名称",
            trigger: ['blur', 'change']
          },
          {
            max: 24,
            message: "长度最多为24个字符",
            trigger: ['blur', 'change']
          }
        ],
        mod_code: [
          {
            required: true,
            validator: checkCode,
            trigger: ['blur', 'change']}
        ],
        mod_component: [
          {
            required: true,
            message: "请输入模块组件",
            trigger: ['blur', 'change']
          }
        ],
        mod_sort: [
          {
            required: true,
            validator: checkNum,
            trigger: ['blur', 'change']
          }
        ],
        mod_status: [
          {
            required: true,
            message: "请选择模块状态",
            trigger: ['blur', 'change']
          }
        ]
      },
      treeInfo: {
        baseData: [],
        initData: [],
        // 右键菜单
        rightMenu: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'routerTree'
    ])
  },
  mounted () {
    this.getList()
  },
  watch: {
    'listInfo.query.mod_type' (val) {
      this.getModTree()
    },
    'treeInfo.baseData' () {
      this.getModTree()
    },
    'dialogInfo.show' () {
      // 弹窗隐藏时，将弹窗数据初始化
      if (!this.dialogInfo.show) {
        // 表单验证初始哈
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        // 表单内容初始化
        this.resetForm()
        // 按钮loading消失
        this.dialogInfo.btLoading = false
      } else {
        // 参数绑定
        this.form.mod_type = this.listInfo.query.mod_type
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    next()
    // 当用户在这个页面操作了模块后，离开页面时页面刷新
    if (this.isRefreshData) {
      location.reload()
    }
  },
  methods: {
    getList () {
      // 对树状菜单做处理
      this.$api.getModApi().then(response => {
        let arr = [], 
            query = this.listInfo.query
        if (response.success) {
          arr = response.content.data.filter((item, index) => {
            // 对基础数据的处理
            item.id = item.mod_id
            item.meta = {}
            item.title = item.mod_name
            item.meta.title = item.mod_name
            item.meta.icon = item.mod_icon
            item.redirect = item.mod_redirect
            item.type = item.mod_type
            // 对排序字段处理
            item.mod_sort = item.mod_sort + item.mod_pid
            // 使路由名字具有唯一性
            item.name = item.mod_name
            // 设置对应的页面路径
            if (item.mod_pid === 0) {
              item.path = '/' + item.mod_code
            } else {
              item.path = item.mod_code
            }
            return item
          })
        }
        // 排序
        arr = arr.sort((a, b) => a.mod_sort - b.mod_sort)
        
        // 对选择的父级节点做处理 （主要用来添加时通过父id找到对应的名字）
        this.listTypeInfo.pModList = JSON.parse(JSON.stringify(arr))
        if (query.mod_type === 1) {
          this.listTypeInfo.pModList.unshift({mod_id: 0, title: this.getModName(query.mod_type), name: '平台级', id: -1})
        } else if (query.mod_type === 2) {
          this.listTypeInfo.pModList.unshift({mod_id: 0, title: this.getModName(query.mod_type), name: '项目级', id: -1})
        } else if (query.mod_type === 3) {
          this.listTypeInfo.pModList.unshift({mod_id: 0, title: this.getModName(query.mod_type), name: '移动端', id: -1})
        }

        // 对重定向路径做处理
        let childModList = JSON.parse(JSON.stringify(arr))
        childModList.forEach(item => {
          childModList.forEach(item1 => {
            if (item.mod_pid === item1.mod_id && item1.mod_pid === 0) {
              item.completePath = '/' + item1.mod_code + '/' + item.mod_code
            }
          })
        })
        // 将所有可访问的子页面得到，生成重定向列表
        this.listTypeInfo.childModList = this.filterMod(childModList, [])
        // 得到基础数据
        this.treeInfo.baseData = arr
        })
      .catch(() => {
      })
    },
    // 得到对应模块结构
    getModTree () {
      let val = this.listInfo.query.mod_type
      // 初始化结构
      this.treeInfo.initData = [
        {
          name: this.getModName(val),
          children: this.$fn.getTreeArr({key: 'mod_id', pKey: 'mod_pid', rootPValue: 0, data: this.treeInfo.baseData.filter(item => item.mod_type === val)}), 
          type: -val,
          id: -1,
          mod_id: 0
        }
      ]
    },
    // 得到对应模块名字
    getModName (type) {
      switch (type) {
        case 1:
          return '平台级模块'
        case 2:
          return '项目级模块'
        case 3:
          return '移动端模块'
      }
    },
    /**
     * 得到所有子模块
     * @param {Array} data 递归的数组
     * @param {Array} arrChild 得到的可访问的子模块数组
     */
    filterMod (data, arrChild) {
      // 不是数组不往下进行
      if (!Array.isArray(data)) return
      data.forEach(item => {
        if (item.mod_pid !== 0) {
          arrChild.push(item)
        }
      })
      return arrChild
    },
    // 树状左键的点击事件
    cdHandleClickLeft (data) {
      if (data.type === -1 || data.type === -2 || data.type === -3) {
        this.listInfo.data = JSON.parse(JSON.stringify(data))
        return
      }
      getModApi({mod_id: data.mod_id || data.id}).then(response => {
        if (response.content.data && Array.isArray(response.content.data)) {
          this.listInfo.data = JSON.parse(JSON.stringify(response.content.data[0]))
          // 将当前行数据换成服务端数据
          // for(let key in row) {
          //   if (response.content.data[0][key]) row[key] = response.content.data[0][key]
          // }
        } else {
          this.listInfo.data = JSON.parse(JSON.stringify(data))
        }
      })
      .catch(() => {
        this.listInfo.data = JSON.parse(JSON.stringify(data))
      })
    },
    // 树状右键的点击事件
    cdHandleClickRight (data, node) {
      // 设置右键菜单
      let arr = []
      if (data.type === -1 || data.type === -2 || data.type === -3) {
        arr = [
          {name: '添加', type: 'add', node},
          {name: '刷新', type: 'refresh', node}
        ]
      } else {
        arr = [
          {name: '添加', type: 'add', node},
          {name: '编辑', type: 'update', node},
          {name: '删除', type: 'delete', node},
          {name: '刷新', type: 'refresh', node}
        ]
      }
      this.treeInfo.rightMenu = arr
      // 为项目地图的时候，不能做操作
      // this.treeInfo.rightMenu = data.mod_code === 'P01' || data.mod_code === 'P0101A' ? [] : arr

      // 右键点击的时候设置目录的模块类型
      switch (node.data.type) {
        case -1:
          this.form.mod_component = 2
          break
        case -2:
          this.form.mod_component = 3
          break
        case -3:
          this.form.mod_component = 1
        default:
          this.form.mod_component = 1
          break
      }
    },
    // 树状右键的事件处理
    cdHandleRightEvent (type, data) {
      if (type === 'add') {
        this.form.mod_pid = data.mod_id
      }
      this.handleClickBt(type, data)
    },
    // 按钮的点击
    handleClickBt (type, row) {
      switch (type) {
      case 'add':
        this.dialogInfo.show = true
        this.dialogInfo.status = 'add'
        break
      case 'update':
        // 显示当前数据
        getModApi({mod_id: row.mod_id}).then(response => {
          this.dialogInfo.show = true
          this.dialogInfo.status = 'update'
          if (response.content.data && Array.isArray(response.content.data)) {
            // 将当前行数据换成服务端数据
            row.name = response.content.data[0].mod_name
            for(let key in row) {
              if (response.content.data[0][key]) {
                row[key] = response.content.data[0][key]
              }
            }
          }
          this.form = JSON.parse(JSON.stringify(row))
        })
        .catch(() => {
          this.form = JSON.parse(JSON.stringify(row))
        })
        break
      case 'delete':
        this.handleDelete(row)
        break
      case 'refresh':
        this.getList()
        break
      }
    },
    // 确认的事件处理
    handleConfirm (type) {
      // 添加和编辑的事件处理
      this.$refs.form.validate(valid => {
        if (valid) {
          let api
          // 参数处理
          this.form.mod_adduser = this.userInfo.user_id
          switch (type) {
          case 'add':
            api = addModApi
            break
          case 'update':
            api = updateModApi
            break
          default:
            return
          }
          delete this.form.mod_addtime
          delete this.form.mod_adduser
          delete this.form.meta
          delete this.form.children
          this.dialogInfo.btLoading = true
          api(this.form)
            .then(response => {
              if (response.success) {
                // 刷新树
                this.getList()
                // TODO: 暂时用刷新页面处理
                this.isRefreshData = true
                // location.reload()

                // 动态添加当前路由
                if (type === 'add') {
                  this.handleAddRoute
                }
                
                this.dialogInfo.show = false
                TYPE = 'success'
              } else {
                this.dialogInfo.btLoading = false
                TYPE = 'error'
              }
              MESSAGE = response.message
              this.$message({
                showClose: true,
                message: response.message,
                type: TYPE,
                duration: 3500
              })
            })
            .catch(() => {
              this.dialogInfo.btLoading = false
              // this.dialogInfo.show = false
            })
        }
      })
    },
    // 动态添加路由
    handleAddRoute () {
      let obj = JSON.parse(JSON.stringify(this.form))
      // 设置路由参数
      obj.name = obj.mod_name
      obj.redirect = obj.mod_redirect
      obj.icon = obj.mod_icon
      obj.type = obj.mod_type
      // 设置页面对应的组件
      switch (obj.mod_component) {
        case 1:
          obj.component = resolve => require(['@/views/' + obj.mod_code + '/index'], resolve)
          break
        case 2:
          obj.component = horizontal
          break
        case 3:
          obj.component = vertical
          break
        default:
          obj.component = resolve => require(['@/views/errorPage/401'], resolve)
          break
      }
      if (obj.mod_type === 1) {
        obj.path = obj.mod_code
      } else {
        obj.path = '/' + obj.mod_code
      }
      this.$router.addRoutes([obj])
    },
    // 删除的事件处理
    handleDelete (row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteModApi(row).then(response => {
            if (response.success) {
              // 刷新树
              this.getList()
              // TODO: 暂时用刷新页面处理
              this.isRefreshData = true
              // location.reload()
              // 重新获取用户菜单
              // this.$store.dispatch('user/getUserMenu')
              TYPE = 'success'
            } else {
              TYPE = 'error'
            }
            this.$message({
              showClose: true,
              message: response.message,
              type: TYPE,
              duration: 3500
            })
          })
        })
    },
    // 取消按钮的点击
    handleCancel () {
      this.dialogInfo.show = false
    },
    // 表单初始化
    resetForm () {
      this.form = {
        mod_id: '', // 模块ID *
        // mod_type: 1, // 模块类型 *
        mod_pid: '', // 父模块ID *
        mod_code: '', // 模块编码 *
        mod_name: '', // 模块名称 *
        mod_component: '', // 模块对应组件(平台级默认为水平组件，项目级默认为垂直组件，子页面默认为对应页面)
        mod_icon: '', // 模块图标
        mod_redirect: '', // 模块重定向路径
        mod_sort: '', // 排序 *
        mod_desc: '', // 备注
        mod_status: 1 // 模块状态 *
        // mod_adduser: '', // 创建人 *
        // mod_addtime: '', // 创建时间 *
      }
    },
    // Ic组件传过来的图标地址
      iconUrl (url) {
        if (url) {
          this.dialogInfo.iCon = false
          this.form.mod_icon = url
        }
      }
  }
}
</script>

<style lang="scss" scoped>
  .P0401A{
    position: relative;
    padding: 20px 30px;
    .tree{
      position: absolute;
      margin: 20px 0 10px 10px;
      left: 0;
      top: 45px;
      bottom: 0;
      border: 1px solid rgb(200, 200, 200);
    }
    .content{
      margin-left: 240px;
      .el-form-default{
        .el-input, .el-select{
          width: 400px;
        }
      }
    }
  }
</style>
