<template>
  <div class="app-container S0801A">
    <!-- 左侧数结构 -->
    <div class="tree">
      <Tree
        :rightClick="true"
        :refreshLevel="treeInfo.refreshLevel"
        :treeRefresh="treeInfo.refresh" 
        @cdHandleClickLeft="cdHandleClickLeft"
        @cdHandleClickRight="cdHandleClickRight" 
        @cdHandleRightEvent="cdHandleRightEvent">
      </Tree>
    </div>
    <!-- 右侧页面 -->
    <div class="content" :style="listInfo.boxHeight ? 'height: ' + listInfo.boxHeight + 'px; overflow: auto' : ''">
      <el-collapse v-model="collapseInfo.activeNames">
        <el-collapse-item :title="collapseInfo.title1" name="1">
          <!-- 显示表单 -->
          <el-form :model="showForm" label-width="120px">
            <el-form-item v-for="(item, index) in fieldList[treeInfo.leftType]" :key="index" :prop="item.value" :label="item.key" :class="item.type === 'textarea' ? 'el-form-block' : ''">
              <el-input
                v-if="item.type === 'input' && item.value === 'proj_dist_id'"
                class="filter-item filter-input"
                :value="(showForm.province || '省') + '/' + (showForm.city || '市')"
                readonly
                placeholder="所在区域">
              </el-input>
              <!-- 普通输入框 -->
              <el-input
                v-else-if="item.type === 'input'"
                :type="item.type" 
                :placeholder="item.key"
                readonly
                v-model.trim="showForm[item.value]">
              </el-input>
              <!-- 图片 -->
              <!-- <el-card v-if="item.type === 'image'" style="height: 80px;">
                <img v-if="item.type === 'image'" :src="showForm[item.value]" style="height: 50px;">
              </el-card> -->
              <img v-if="item.type === 'image'" :src="showForm[item.value]" style="height: 50px;">
              <!-- 文本输入框 -->
              <el-input
                v-if="item.type === 'textarea'"
                :type="item.type" 
                :placeholder="item.key"
                :autosize="{ minRows: 2, maxRows: 10}"
                readonly
                v-model.trim="showForm[item.value]">
              </el-input>
              <!-- 选择框 -->
              <el-input 
                v-if="item.type === 'select'"
                :value.trim="$fn.getDataName({dataList: listTypeInfo[item.list], value: 'value', label: 'key', data: showForm[item.value]})" 
                :placeholder="item.key"
                readonly>
              </el-input>
              <!-- 日期选择框 -->
              <el-date-picker
                v-if="item.type === 'date'"
                v-model="showForm[item.value]"
                :type="item.dateType"
                :clearable="false"
                readonly
                :placeholder="getPlaceholder(item)">
              </el-date-picker>
              <!-- 信息展示框 -->
              <el-tag v-if="item.type === 'tag'">
                {{$fn.getDataName({dataList: listTypeInfo[item.list], value: 'value', label: 'key', data: showForm[item.value]})}}
              </el-tag>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item :title="collapseInfo.title2" name="2" v-if="treeInfo.leftType !== 'station'">
          <!-- 显示表格 -->
          <el-table :max-height="listInfo.tableHeight || undefined" :data="listInfo[treeInfo.listType]" style="width:100%" border v-loading="listInfo.loading">
            <el-table-column align="center" label="序号" width="80">
              <template slot-scope="scope">
                <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
              </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in fieldList[treeInfo.listType]" :key="index" :prop="item.value" :label="item.key" align="center" :min-width="item.width || '160px'" v-if="!item.hidden">
              <template slot-scope="scope">
                {{$fn.getDataName({dataList: listTypeInfo[item.list], value: 'value', label: 'key', data: scope.row[item.value]})}}
              </template>
            </el-table-column>
          </el-table>
           <!-- 分页组件 -->
          <div v-show="!listInfo.loading" class="pagination-container">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="listInfo.query.curPage"
              :page-sizes="listInfo.pageSizes"
              :page-size="listInfo.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
              :total="listInfo.total">
            </el-pagination>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 操作弹窗 -->
    <el-dialog :title="dialogInfo.header[dialogInfo.status]" :visible.sync="dialogInfo.show" :close-on-click-modal="false">
      <!-- 添加和编辑的时候显示的内容 (类型为测点时) -->
      <el-form 
        v-if="treeInfo.rightType === 'station' && dialogInfo.status === 'add'"
        :model="formList[treeInfo.rightType]"
        :rules="rules"
        ref="form"
        label-width="120px"
        class="el-form-default">
        <el-form-item label="" prop="proj_owner">
          <el-checkbox v-model="formList[treeInfo.rightType].isClass">是否按类添加</el-checkbox>
        </el-form-item>
        <!-- 测点类 -->
        <div v-if="formList[treeInfo.rightType].isClass">
          <el-form-item label="类" prop="pocg_id">
            <el-select v-model.number="formList[treeInfo.rightType].pocg_id" placeholder="请选择类" @change="handleChangePocg(formList[treeInfo.rightType].pocg_id)">
            <el-option v-for="(item ,index) in listTypeInfo.pocgList" :key="index" :label="item.key" :value="item.value"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="AI" prop="ai">
            <el-input v-model.number="formList[treeInfo.rightType].ai" placeholder="请输入AI起始地址">
              <!-- <template slot="prepend">当前起始地址为：{{classDataAddr.AI}} +</template> -->
            </el-input>
          </el-form-item>
          <el-form-item label="DI" prop="di">
            <el-input v-model.number="formList[treeInfo.rightType].di" placeholder="请选择DI起始地址">
              <!-- <template slot="prepend">当前起始地址为：{{classDataAddr.DI}} +</template> -->
            </el-input>
          </el-form-item>
          <el-form-item label="AO" prop="ao">
            <el-input v-model.number="formList[treeInfo.rightType].ao" placeholder="请选择AO起始地址">
              <!-- <template slot="prepend">当前起始地址为：{{classDataAddr.AO}} +</template> -->
            </el-input>
          </el-form-item>
          <el-form-item label="DO" prop="do">
            <el-input v-model.number="formList[treeInfo.rightType].do" placeholder="请选择DO起始地址">
              <!-- <template slot="prepend">当前起始地址为：{{classDataAddr.DO}} +</template> -->
            </el-input>
          </el-form-item>
        </div>
        <!-- 测点  -->
        <div v-else>
          <el-form-item label="测点名称" prop="poit_name">
            <el-input v-model.trim="formList[treeInfo.rightType].poit_name" placeholder="请输入测点名称"></el-input>
          </el-form-item>
          <el-form-item label="测点类型" prop="poit_type">
            <el-select
              v-model.number="formList[treeInfo.rightType].poit_type"
              placeholder="请选择测点类型">
              <el-option v-for="(item ,index) in  listTypeInfo.dataTypeList" :key="index" :label="item.key" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="驱动地址" prop="poit_driv_id">
            <el-tag>
              {{$fn.getDataName({dataList: listTypeInfo.driveList, value: 'value', label: 'key', data: formList[treeInfo.rightType].poit_driv_id})}}
            </el-tag>
          </el-form-item>
          <el-form-item label="相对地址" prop="poit_addr">
            <el-input v-model.trim="formList[treeInfo.rightType].poit_addr" placeholder="请输入相对地址"></el-input>
          </el-form-item>
          <!-- <el-form-item label="报警类型" prop="poit_alarmtype">
            <el-select
              v-model.number="formList[treeInfo.rightType].poit_alarmtype"
              @change="item.event || ''"
              placeholder="请选择报警类型">
              <el-option v-for="(item ,index) in  listTypeInfo.alarmType" :key="index" :label="item.key" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
        </div>
      </el-form>
      <!-- 添加和编辑的时候显示的内容 (类型不为测点的其他数据) -->
      <el-form v-else :model="formList[treeInfo.rightType]" :rules="rules" ref="form" label-width="120px">
        <el-form-item v-for="(item, index) in fieldList[treeInfo.rightType]" :key="index" :prop="item.value" :label="item.key" :class="item.type === 'textarea' ? 'el-form-block' : ''">
          <!-- 普通输入框 -->
          <el-input
            v-if="item.type === 'input' && item.code"
            :type="item.type"
            :disabled="item.disabled"
            :placeholder="getPlaceholder(item)"
            v-model.trim="formList[treeInfo.rightType].code_foot">
            <template slot="prepend">{{formList[treeInfo.rightType].code_head}}</template>
          </el-input>
          <el-input
            v-else-if="item.type === 'input'"
            :type="item.type"
            :disabled="item.disabled"
            :placeholder="getPlaceholder(item)"
            @focus="handleEventM(item.event)"
            v-model="formList[treeInfo.rightType][item.value]">
          </el-input>
          <!-- 文本输入框 -->
          <el-input
            v-if="item.type === 'textarea'"
            :type="item.type"
            :disabled="item.disabled"
            :placeholder="getPlaceholder(item)"
            :autosize="{ minRows: 2, maxRows: 10}"
            @focus="handleEventM(item.event)"
            v-model.trim="formList[treeInfo.rightType][item.value]">
          </el-input>
          <!-- 选择框 -->
          <el-select
            v-if="item.type === 'select'"
            v-model="formList[treeInfo.rightType][item.value]"
            :disabled="item.disabled"
            @change="handleEventM(item.event, formList[treeInfo.rightType][item.value])"
            :clearable="!item.required"
            :filterable="!item.required"
            :placeholder="getPlaceholder(item)">
            <el-option v-for="(item ,index) in  listTypeInfo[item.list]" :key="index" :label="item.key" :value="item.value"></el-option>
          </el-select>
          <!-- 日期选择框 -->
          <el-date-picker
            v-if="item.type === 'date'"
            v-model="formList[treeInfo.rightType][item.value]"
            :type="item.dateType"
            :disabled="item.disabled"
            @focus="handleEventM(item.event)"
            :placeholder="getPlaceholder(item)">
          </el-date-picker>
          <!-- 信息展示框 -->
          <el-tag v-if="item.type === 'tag'">
            {{$fn.getDataName({dataList: listTypeInfo[item.list], value: 'value', label: 'key', data: formList[treeInfo.rightType][item.value]})}}
          </el-tag>
        </el-form-item>
        <!-- 表计添加测点类 -->
        <el-collapse v-if="treeInfo.rightType === 'meter' && dialogInfo.status === 'add'"  v-model="formList[treeInfo.rightType].activeNames">
          <el-collapse-item title="配置测点类" name="1">
            <el-form-item label="类" prop="pocg_id">
              <el-select v-model="formList[treeInfo.rightType].pocg_id" placeholder="请选择类" @change="handleChangePocg(formList[treeInfo.rightType].pocg_id)">
                <el-option v-for="(item ,index) in listTypeInfo.pocgList" :key="index" :label="item.key" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="AI" prop="ai">
              <el-input v-model.number="formList[treeInfo.rightType].ai" placeholder="请输入AI起始地址">
                <!-- <template slot="prepend">当前起始地址为：{{classDataAddr.AI}} +</template> -->
              </el-input>
            </el-form-item>
            <el-form-item label="DI" prop="di">
              <el-input v-model.number="formList[treeInfo.rightType].di" placeholder="请选择DI起始地址">
                <!-- <template slot="prepend">当前起始地址为：{{classDataAddr.DI}} +</template> -->
              </el-input>
            </el-form-item>
            <el-form-item label="AO" prop="ao">
              <el-input v-model.number="formList[treeInfo.rightType].ao" placeholder="请选择AO起始地址">
                <!-- <template slot="prepend">当前起始地址为：{{classDataAddr.AO}} +</template> -->
              </el-input>
            </el-form-item>
            <el-form-item label="DO" prop="do">
              <el-input v-model.number="formList[treeInfo.rightType].do" placeholder="请选择DO起始地址">
                <!-- <template slot="prepend">当前起始地址为：{{classDataAddr.DO}} +</template> -->
              </el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('form')">取消</el-button>
        <el-button type="primary" :loading="dialogInfo.btLoading" @click="handleConfirm(dialogInfo.status)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表达式弹窗 -->
    <el-dialog title="生成表达式" :visible.sync="dialogInfo.expressionShow" width="40%">
      <VirtualExpression
        v-if="dialogInfo.expressionShow"
        :rightData="treeInfo.rightData"
        :expressionID.sync="formList.meter.metr_expression"
        :expressionText.sync="formList.meter.metr_exprnames"
        :visible.sync="dialogInfo.expressionShow">
      </VirtualExpression>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tree from './components/tree'
import VirtualExpression from './components/virtualExpression'
// 引入接口
import {
        getBuildListApi, getBuildRowApi, addBuildApi, updateBuildApi, deleteBuildApi,
        getCollectorListApi, getCollectorRowApi, addCollectorApi, updateCollectorApi, deleteCollectorApi,
        getMeterListApi, getMeterRowApi, addMeterApi, updateMeterApi, deleteMeterApi,
        getStationListApi, getStationRowApi, addClassStationApi, addStationApi, updateStationApi, deleteStationApi
       } from '@/api/project/S0801A'
import { getDriveApi } from '@/api/project/S0808A'
import { getPocgInfoApi } from '@/api/project/S0809A'
import { getPounApi } from '@/api/project/S0814A'

// 定义提示弹窗初始参数
let MESSAGE, TYPE, checkBubiCodeLength, checkDaciCodeLength, checkMetrCodeLength

export default {
  name: 'S0801A',
  components: {
    Tree,
    VirtualExpression
  },
  data () {
    // 验证建筑编码长度
    checkBubiCodeLength = (rule, value, callback) => {
      let check = this.$validate({label: '建筑编码', value: this.formList.build.code_foot, rules: ['notnull', 'number', 'fixedNum'], conditions: [3]})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 验证采集器编码长度
    checkDaciCodeLength = (rule, value, callback) => {
      let check = this.$validate({label: '采集器编码', value: this.formList.collector.code_foot, rules: ['notnull', 'number', 'fixedNum'], conditions: [2]})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 验证表计编码长度
    checkMetrCodeLength = (rule, value, callback) => {
      let check = this.$validate({label: '表计编码', value: this.formList.meter.code_foot, rules: ['notnull', 'number', 'fixedNum'], conditions: [4]})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      collapseInfo: {
        activeNames: ['1', '2'],
        title1: '项目信息',
        title2: '建筑列表'
      },
      // 列表相关
      listInfo: {
        initCurPage: false,
        boxHeight: 0,
        tableHeight: 0,
        // 建筑
        build: [],
        // 采集器
        collector: [],
        // 表计
        meter: [],
        // 测点
        station: [],
        total: 0,
        loading: false,
        pageSizes: [5, 10, 25, 50, 100],
        // 查询条件
        query: {
          curPage: 1,
          pageSize: 5,
          proj_id: '',
          bubi_id: '',
          daci_id: '',
          metr_id: '',
          pocg_id: ''
        }
      },
      // 页面相关的列表类型
      listTypeInfo: {
        areaList: [], // 选择区域的参数
        // 能源分类
        entpList: [],
        // 测点类列表
        pocgList: [],
        // 驱动列表
        driveList: [],
        // 表计列表
        metrList: [],
        // 建筑功能列表
        bubiFuncList: [
          {value: 'A', key: '办公建筑'},
          {value: 'B', key: '商场建筑'},
          {value: 'C', key: '宾馆饭店建筑'},
          {value: 'D', key: '文化教育建筑'},
          {value: 'E', key: '医疗卫生建筑'},
          {value: 'F', key: '体育建筑'},
          {value: 'G', key: '综合建筑'},
          {value: 'Z', key: '其他建筑'}
        ],
        // 建筑空调系统形式列表
        bubiAirTypeList: [
          {value: 'A', key: '集中式全空气系统'},
          {value: 'B', key: '风机盘管＋新风系统'},
          {value: 'C', key: '分体式空调或VRV的局部式机组系统'},
          {value: 'Z', key: '其它'}
        ],
        // 建筑采暖系统形式列表
        bubiHeatTypeList: [
          {value: 'A', key: '散热器采暖'},
          {value: 'B', key: '地板辐射采暖'},
          {value: 'C', key: '电辐射采暖'},
          {value: 'D', key: '空调系统集中供暖'},
          {value: 'Z', key: '其它'}
        ],
        // 建筑结构形式列表
        bubiStruTypeList: [
          {value: 'A', key: '框架结构'},
          {value: 'B', key: '框-剪结构'},
          {value: 'C', key: '剪力墙结构'},
          {value: 'D', key: '砖混结构'},
          {value: 'E', key: '钢结构'},
          {value: 'F', key: '筒体结构'},
          {value: 'G', key: '木结构'},
          {value: 'Z', key: '其它'}
        ],
        // 建筑外墙保温形式列表
        bubiWallWarmTypeList: [
          {value: 'A', key: '内保温'},
          {value: 'B', key: '外保温'},
          {value: 'C', key: '夹芯保温'},
          {value: 'Z', key: '其它'}
        ],
        // 建筑外窗类型列表
        bubiWallWinTypeList: [
          {value: 'A', key: '单玻单层窗'},
          {value: 'B', key: '单玻双层窗'},
          {value: 'C', key: '单玻单层窗+单玻双层窗'},
          {value: 'D', key: '中空双层玻璃窗'},
          {value: 'E', key: '中空三层玻璃窗'},
          {value: 'F', key: ' 中空充惰性气体'},
          {value: 'Z', key: '其它'}
        ],
        // 建筑玻璃类型列表
        bubiGlassTypeList: [
          {value: 'A', key: '普通玻璃'},
          {value: 'B', key: '镀膜玻璃'},
          {value: 'C', key: 'Low-e玻璃'},
          {value: 'Z', key: '其它'}
        ],
        // 窗框材料类型列表
        bubiWinFrameTypeList: [
          {value: 'A', key: '钢窗'},
          {value: 'B', key: '铝合金'},
          {value: 'C', key: '木窗'},
          {value: 'D', key: '断热窗框'},
          {value: 'E', key: ' 塑钢'},
          {value: 'Z', key: '其它'}
        ],
        // 测点数据类型列表
        dataTypeList: [
          {value: 'AI', key: 'AI'},
          {value: 'DI', key: 'DI'},
          // {value: 'AO', key: 'AO'},
          // {value: 'DO', key: 'DO'},
          {value: 'CalAI', key: 'CalAI'},
          {value: 'CalDI', key: 'CalDI'}
        ],
        // 测点单位
        unitList: [
          {value: 'A', key: 'A'},
          {value: 'mA', key: 'mA'},
          {value: 'kA', key: 'kA'},
          {value: 'V', key: 'V'},
          {value: 'kV', key: 'kV'},
          {value: 'W', key: 'W'},
          {value: 'kW', key: 'kW'},
          {value: 'MW', key: 'MW'},
          {value: 'Var', key: 'Var'},
          {value: 'KVar', key: 'KVar'},
          {value: 'MVar', key: 'MVar'},
          {value: 'MVar', key: 'MVar'},
          {value: 'Wh', key: 'Wh'},
          {value: 'kWh', key: 'kWh'},
          {value: 'MWh', key: 'MWh'},
          {value: 'Varh', key: 'Varh'},
          {value: 'kVarh', key: 'kVarh'},
          {value: 'MVarh', key: 'MVarh'},
          {value: 'Hz', key: 'Hz'},
          {value: '°C', key: '°C'},
          {value: 'm', key: 'm'},
          {value: 'Km', key: 'Km'},
          {value: 'pa', key: 'pa'},
          {value: 'kPa', key: 'kPa'},
          {value: 'Tap', key: 'kPa'},
          {value: 'COS@', key: 'COS@'},
          {value: 'M/S', key: 'M/S'},
          {value: 'Lus', key: 'Lus'},
          {value: 'rpm', key: 'rpm'},
          {value: ' %25', key: ' %25'},
          {value: 'w/m2', key: 'w/m2'}
        ],
        // 数字量列表
        digitalList: [
          {value: 0, key: '缺省类型'},
          {value: 1, key: '断路器位置'},
          {value: 2, key: '刀闸位置'},
          {value: 3, key: '保护动作'},
          {value: 4, key: '手车位置'},
          {value: 5, key: '通讯状态'},
          {value: 6, key: '弹簧储能'},
          {value: 7, key: '就地远方'},
          {value: 8, key: '开关位置'},
          {value: 9, key: '三相不同步（计算）'},
          {value: 10, key: '报警信息'},
          {value: 11, key: '储能是否故障'}
        ],
        // 报警类型
        alarmType: [
          {value: 0, key: '不报警'},
          {value: 1, key: '一般事件'},
          {value: 2, key: '预告报警'},
          {value: 3, key: '故障报警'}
        ],
        // 是否列表
        isList: [
          {value: 0, key: '否'},
          {value: 1, key: '是'}
        ],
        // 电表型号
        metrTypeList: [
          {value: '三相', key: '三相'},
          {value: '单相', key: '单相'}
        ],
        // 状态列表
        statusList: [
          {value: 0, key: '停用'},
          {value: 1, key: '启用'}
        ],
        // 全部测点单位列表
        pounList: [],
        // 筛选过的测点单位列表
        pounTypeList: [],
        // 建模字段列表
        modeFieldList: []
      },
      // 显示数据
      showForm: {},
      // 表单数据
      formList: {
        // 项目
        project: {
          proj_id: '', // 项目ID *
          proj_name: '', // 项目名称 *
          proj_dist_id: '', // 所在地区 *
          proj_address: '', // 项目地址
          proj_longitude: '', // 项目坐标--经度 *
          proj_latitude: '', // 项目坐标--纬度 *
          proj_pic: '', // 项目图标
          proj_desc: '', // 项目描述
          proj_owner: '', // 项目业主
          proj_contact: '', // 项目联系人
          proj_contacttel: '', // 联系人电话
          proj_espr_id: '', // 能源服务商
          proj_startdate: '', // 工程开工时间
          proj_acceptdate: '', // 工程验收时间
          proj_status: 1, // 项目状态 *
          proj_contractno: '', // 合同编号
          proj_code: '', // 项目编码
          proj_modversion: '', // 功能版本
          proj_dbname: '', // 数据库名称
          proj_maxpoint: '', // 最大接入数 *
          proj_adduser: '', // 创建人
          proj_addtime: '', // 创建时间
          proj_audituser: '', // 审核人
          proj_audittime: '' // 审核时间
        },
        // 建筑
        build: {
          bubi_id: '', // 建筑ID *
          bubi_proj_id: '', // 项目ID *
          bubi_code: '', // 建筑编码 *
          code_head: '',
          code_foot: '',
          bubi_name: '', // 建筑名称 *
          bubi_alias: '', // 建筑别名 *
          bubi_owner: '', // 建筑业主
          bubi_status: 1, // 建筑监测状态 *
          bubi_districtCode: '', // 所属行政区划
          bubi_address: '', // 建筑地址
          bubi_longitude: '', // 经度
          bubi_latitude: '', // 纬度
          bubi_year: '', // 建设年代
          bubi_upFloor: '', // 地上建筑层数
          bubi_downFloor: '', // 地下建筑层数
          bubi_personNum: '', // 建筑办公人数
          bubi_func: '', // 建筑功能 *
          bubi_totalArea: '', // 建筑总面积
          bubi_airArea: '', // 空调面积
          bubi_heatArea: '', // 采暖面积
          bubi_airType: '', // 建筑空调系统形式
          bubi_heatType: '', // 建筑采暖系统形式
          bubi_bodyCoef: '', // 建筑体型系数
          bubi_struType: '', // 建筑结构形式
          bubi_wallMatType: '', // 建筑外墙材料形式
          bubi_wallWarmType: '', // 建筑外墙保温形式
          bubi_wallWinType: '', // 建筑外窗类型
          bubi_glassType: '', // 建筑玻璃类型
          bubi_winFrameType: '', // 窗框材料类型
          bubi_isStandard: '', // 是否是标杆建筑
          bubi_designDept: '', // 监测方案设计单位
          bubi_workDept: '', // 监测工程实施单位
          bubi_monitorDate: '', // 开始监测日期
          bubi_acceptDate: '', // 能耗监测工程验收日期
          bubi_pic: '', // 建筑图片路径
          bubi_desc: '' // 建筑描述
        },
        // 采集器
        collector: {
          daci_id: '', // 数据采集器ID *
          daci_bubi_id: '', // 建筑ID *
          daci_code: '', // 数据采集器代码 *
          code_head: '',
          code_foot: '',
          daci_name: '', // 数据采集器名称 *
          daci_driv_id: '', // 驱动ID *
          daci_addr: '', // 相对地址 *
          daci_mac: '', // 采集器MAC地址
          daci_ip: '', // 采集器IP地址
          daci_url: '', // 数据采集器URL
          daci_startTime: '', // 数据采集器开始使用时间
          daci_collectInterval: '', // 数据采集器采集频率
          daci_installPerson: '', // 安装人员
          daci_installDate: '', // 安装日期
          daci_installAddress: '', // 安装位置
          daci_status: 1 // 状态 *
        },
        // 表计
        meter: {
          metr_id: '', // 表计ID *
          metr_bubi_id: '', // 建筑ID *
          metr_entp_id: '', // 能耗分类ID *
          metr_code: '', // 表计代码 *
          metr_no: '', // 电表编号 * TODO: 正佳广场项目使用这个字段
          code_head: '',
          code_foot: '',
          metr_name: '', // 表计名称 *
          metr_driv_id: '', // 驱动ID *
          metr_addr: '', // 相对地址 *
          metr_daci_id: '', // 数据采集器ID *
          metr_channel: '', // 采集器通道
          metr_intake: '', // 是否总表 *
          metr_voltage: '', // 电压等级
          metr_rate: '', // 变比 *
          metr_installDate: '', // 安装日期
          metr_virtual: '', // 是否虚拟计表 *
          metr_expression: '', // 虚拟表达式 id拼接
          metr_exprnames: '', // 虚拟表达式文字拼接
          metr_status: 1, // 表计状态 *

          // 按类添加的参数e
          activeNames: '1',
          flag: true,
          device_id: '',
          pocg_id: '',
          ai: 0,
          di: 0,
          ao: 0,
          do: 0
        },
        // 测点
        station: {
          poit_id: '', // 测点ID *
          poit_proj_id: '', // 项目ID *
          poit_driv_id: '', // 驱动ID *
          poit_name: '', // 测点名称 *
          poit_type: '', // 测点类型 *
          poit_addr: '', // 相对地址 *
          poit_formula: '', // 计算公式
          poit_coefficient: '', // 系数
          poit_untp_id: '', // 单位类型ID
          poit_digits: '', // 保留小数点
          poit_device_id: '', // 设备ID
          poit_store: '', // 是否存储
          poit_field: '', // 建模字段
          poit_addtime: '', // 创建时间 *
          // 按类添加的参数
          isClass: false,
          device_id: '',
          pocg_id: '',
          ai: 0,
          di: 0,
          ao: 0,
          do: 0
        }
      },
      // 验证规则
      rules: {},
      /**
       * 自定义对应的表单字段，用来动态匹配显示数据
       * @param {String} value 字段名
       * @param {String} key 字段书面
       * @param {String} type 在form中以什么类型显示
       * @param {String} hidden 在table中是否显示
       * @param {Array} list 在type为select时的数据列表
       * @param {String} dateType 在type为date时的日期格式
       * @param {String} event from中绑定事件
       * @param {Function} rules from中字段验证规则
       * @param {Boolean} required 在from中是否必填
       * @param {Boolean} disabled 在from中是否禁止填入
       */
      fieldList: {
        // 项目
        project: [
          {value: 'proj_name', key: '项目名称', type: 'input', required: true},
          {value: 'proj_pic', key: '项目图标', type: 'image'},
          {value: 'proj_dist_id', key: '所属区域', type: 'input', required: true},
          {value: 'proj_address', key: '项目地址', type: 'input'},
          {value: 'proj_longitude', key: '经度', type: 'input', required: true},
          {value: 'proj_latitude', key: '纬度', type: 'input', required: true},
          // {value: 'proj_owner', key: '项目业主', type: 'input'},
          {value: 'proj_contact', key: '项目联系人', type: 'input'},
          {value: 'proj_contacttel', key: '联系人电话', type: 'input'},
          {value: 'proj_desc', key: '项目描述', type: 'textarea', hidden: true}
        ],
        // 建筑
        build: [
          {value: 'bubi_func', key: '建筑功能', type: 'select', list: 'bubiFuncList', hidden: true, required: true},
          {value: 'bubi_code', key: '建筑代码', type: 'input', code: true, required: true, rules: checkBubiCodeLength},
          {value: 'bubi_name', key: '建筑名称', type: 'input', required: true},
          {value: 'bubi_districtCode', key: '行政编码', type: 'input'},
          {value: 'bubi_alias', key: '建筑别名', type: 'input', required: true},
          {value: 'bubi_monitorDate', key: '监测日期', type: 'date', dateType: 'date', hidden: true},
          {value: 'bubi_acceptDate', key: '验收日期', type: 'date', dateType: 'date', hidden: true},
          {value: 'bubi_status', key: '监测状态', type: 'select', list: 'statusList', hidden: true, required: true},
          {value: 'bubi_totalArea', key: '总面积', type: 'input', hidden: true},
          {value: 'bubi_year', key: '建筑年代', type: 'input', hidden: true},
          {value: 'bubi_address', key: '建筑地址', type: 'input', hidden: true},
          {value: 'bubi_longitude', key: '经度', type: 'input', hidden: true},
          {value: 'bubi_latitude', key: '纬度', type: 'input', hidden: true},
          {value: 'bubi_upFloor', key: '地上层数', type: 'input', hidden: true},
          {value: 'bubi_downFloor', key: '地下层数', type: 'input', hidden: true},
          {value: 'bubi_airType', key: '空调系统形式', type: 'select', list: 'bubiAirTypeList', hidden: true},
          {value: 'bubi_airArea', key: '空调总面积', type: 'input', hidden: true},
          {value: 'bubi_heatType', key: '建筑采暖形式', type: 'select', list: 'bubiHeatTypeList', hidden: true},
          {value: 'bubi_wallMatType', key: '采暖面积', type: 'input', hidden: true},
          {value: 'bubi_heatArea', key: '采暖面积', type: 'input', hidden: true},
          {value: 'bubi_wallWarmType', key: '外墙保温形式', type: 'select', list: 'bubiWallWarmTypeList', hidden: true},
          {value: 'bubi_wallWinType', key: '外窗类型', type: 'select', list: 'bubiWallWinTypeList', hidden: true},
          {value: 'bubi_glassType', key: '玻璃类型', type: 'select', list: 'bubiGlassTypeList', hidden: true},
          {value: 'bubi_bodyCoef', key: '建筑体型系数', type: 'input', hidden: true},
          {value: 'bubi_struType', key: '建筑结构形式', type: 'select', list: 'bubiStruTypeList', hidden: true},
          {value: 'bubi_winFrameType', key: '窗框材料类型', type: 'select', list: 'bubiWinFrameTypeList', hidden: true},
          {value: 'bubi_owner', key: '建筑用户', type: 'input', hidden: true},
          {value: 'bubi_designDept', key: '是否标杆', type: 'select', list: 'isList', hidden: true},
          {value: 'bubi_owner', key: '设计单位', type: 'input', hidden: true},
          {value: 'bubi_workDept', key: '实施单位', type: 'input', hidden: true},
          {value: 'bubi_personNum', key: '办公人数', type: 'input', hidden: true},
          {value: 'bubi_pic', key: '建筑图片路径', type: 'input', hidden: true},
          {value: 'bubi_desc', key: '建筑描述', type: 'textarea', hidden: true},
        ],
        // 采集器
        collector: [
          {value: 'daci_code', key: '采集器代码', type: 'input', code: true, required: true, rules: checkDaciCodeLength},
          {value: 'daci_name', key: '采集器名称', type: 'input', required: true},
          {value: 'daci_driv_id', key: '关联驱动', type: 'select', list: 'driveList', required: true},
          {value: 'daci_addr', key: '相对地址', type: 'input', required: true},
          {value: 'daci_mac', key: 'MAC地址', type: 'input', hidden: true},
          {value: 'daci_ip', key: '采集器IP地址', type: 'input', hidden: true},
          {value: 'daci_url', key: '采集器URL', type: 'input', hidden: true},
          {value: 'daci_startTime', key: '开始使用时间', type: 'date', dateType: 'datetime', hidden: true},
          {value: 'daci_collectInterval', key: '采集周期', type: 'input', hidden: true},
          {value: 'daci_installPerson', key: '安装人员', type: 'input', hidden: true},
          {value: 'daci_installDate', key: '安装日期', type: 'date', dateType: 'date', hidden: true},
          {value: 'daci_installAddress', key: '安装位置', type: 'input', hidden: true},
          {value: 'daci_status', key: '状态', type: 'select', list: 'statusList', required: true},
        ],
        // 表计
        meter: [
          {value: 'metr_code', key: '表计代码', type: 'input', code: true, required: true, rules: checkMetrCodeLength},
          {value: 'metr_name', key: '表计名称', type: 'input', required: true, width: '240px'},
          {value: 'metr_entp_id', key: '能耗类型', type: 'select', list: 'entpList', required: true},
          {value: 'metr_driv_id', key: '关联驱动', type: 'tag', list: 'driveList', required: true, hidden: true},
          {value: 'metr_addr', key: '相对地址', type: 'input', required: true},
          {value: 'metr_channel', key: '采集器通道', type: 'input', hidden: true},
          {value: 'metr_voltage', key: '电压等级', type: 'input'},
          {value: 'metr_intake', key: '是否总表', type: 'select', list: 'isList', required: true},
          {value: 'metr_rate', key: '变比', type: 'input', hidden: true, required: true},
          {value: 'metr_installDate', key: '安装日期', type: 'date', dateType: 'date', hidden: true},
          {value: 'metr_virtual', key: '是否虚拟计表', type: 'select', list: 'isList', required: true},
          {value: 'metr_status', key: '状态', type: 'select', list: 'statusList', required: true},
          {value: 'metr_exprnames', key: '虚拟表达式', type: 'textarea', hidden: true, event: 'handleExpression'},
        ],
        // 测点
        station: [
          {value: 'poit_name', key: '测点名称', type: 'input', required: true},
          {value: 'poit_type', key: '测点类型', type: 'select', list: 'dataTypeList', event: 'handlePoitChange', required: true},
          {value: 'poit_driv_id', key: '关联驱动', type: 'tag', list: 'driveList', required: true},
          {value: 'poit_addr', key: '相对地址', type: 'input', disabled: false, required: true},
          {value: 'poit_formula', key: '计算公式', type: 'input', hidden: true, disabled: false},
          {value: 'poit_coefficient', key: '系数', type: 'input', hidden: true, disabled: false},
          {value: 'poit_untp_id', key: '基本单位', type: 'select', list: 'pounTypeList', disabled: false},
          {value: 'poit_digits', key: '保留小数点', type: 'input', hidden: true, disabled: false,},
          // {value: 'poit_device_id', key: '关联设备', type: 'select', list: 'metrList', hidden: true},
          {value: 'poit_store', key: '是否存储', type: 'select', list: 'isList', hidden: true},
          {value: 'poit_field', key: '建模字段', type: 'select', list: 'modeFieldList', hidden: true}
        ]
      },
      // 测点类数据地址
      classDataAddr: {
        AI: 0,
        DI: 0,
        AO: 0,
        DO: 0
      },
      // 弹窗相关
      dialogInfo: {
        header: {
          add: '添加',
          update: '编辑'
        },
        show: false,
        expressionShow: false,
        status: '',
        btLoading: false
      },
      // 树组件相关数据
      treeInfo: {
        leftType: 'project', // 当前左键点击的类型
        listType: 'build', // 当前列表要显示的类型
        rightType: 'project', // 当前右键点击的类型
        eventType: '',
        leftData: '',
        rightData: '',
        refresh: 0,
        refreshLevel: 0
      },
    }
  },
  computed: {
    ...mapGetters([
      'projectInfo'
    ])
  },
  created () {
    // 初始化字段验证规则
    this.initRules()
  },
  mounted () {
    this.initlistTypeInfo()
    // 初始得到项目数据
    this.getList('project')

    // 内容的高度 = 视口高度 - 表格到头部导航的距离 - 头部导航的高度137 - margin20
    this.listInfo.boxHeight = document.body.clientHeight - document.getElementsByClassName('content')[0].offsetTop - 137 - 20
    // 表格的高度 = 视口高度 - 头部导航的高度137 - 手风琴高度96 - padding30 - 分页组件的高度100 - 分页组件到表格的margin-top20
    this.listInfo.tableHeight = document.body.clientHeight - 137 - 96 - 30 - 120
    // 监听页面大小改变
    window.addEventListener('resize', () => {
      if (!document.getElementsByClassName('content')[0]) return
      // 内容的高度 = 视口高度 - 表格到头部导航的距离 - 头部导航的高度137 - margin20
      this.listInfo.boxHeight = document.body.clientHeight - document.getElementsByClassName('content')[0].offsetTop - 137 - 20
      // 表格的高度 = 视口高度 - 头部导航的高度137 - 手风琴高度96 - padding30 - 分页组件的高度100 - 分页组件到表格的margin-top20
      this.listInfo.tableHeight = document.body.clientHeight - 137 - 96 - 30 - 120
    })
  },
  watch: {
    'dialogInfo.show' () {
      // 表单验证初始化
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
      // 弹窗隐藏时，将弹窗数据初始化
      if (!this.dialogInfo.show) {
        // // 表单验证初始化
        // if (this.$refs.form) {
        //   this.$refs.form.clearValidate()
        // }
        // 表单内容初始化
        this.resetForm()
        // 按钮loading消失
        this.dialogInfo.btLoading = false
      } else {
        // 重置为false
        this.formList.station.isClass = false
      }
    },
    'treeInfo.leftType' (value) {
      switch (value) {
      case 'project':
        // 列表显示的类型 
        this.treeInfo.listType = 'build'
        // 标题显示
        this.collapseInfo.title1 = '项目信息'
        this.collapseInfo.title2 = '建筑列表'
        break
      case 'build':
        // 列表显示的类型 
        this.treeInfo.listType = 'collector'
        // 标题显示
        this.collapseInfo.title1 = '建筑信息'
        this.collapseInfo.title2 = '采集器列表'
        break
      case 'collector':
        // 列表显示的类型 
        this.treeInfo.listType = 'meter'
        // 标题显示
        this.collapseInfo.title1 = '采集器信息'
        this.collapseInfo.title2 = '表计列表'
        break
      case 'meter':
        // 列表显示的类型 
        this.treeInfo.listType = 'station'
        // 标题显示
        this.collapseInfo.title1 = '表计信息'
        this.collapseInfo.title2 = '测点列表'
        break
      case 'station':
        // 标题显示
        this.collapseInfo.title1 = '测点信息'
        // this.collapseInfo.title2 = '测点列表'
        break
      }
    },
    'listTypeInfo.pounList' () {
      // 对测点的数据初始化
      this.handlePoitChange('AI')
    },
    // 监听显示code (只是为了通过验证, code最终值是在点击确认的时候进行拼接)
    'formList.build.code_foot' (val) {
      this.formList.build.bubi_code = val
    },
    'formList.collector.code_foot' (val) {
      this.formList.collector.daci_code = val
    },
    'formList.meter.code_foot' (val) {
      this.formList.meter.metr_code = val
    },
    'formList.station.isClass' (val) {
      if (val) {
        this.formList.station.pocg_id = this.listTypeInfo.pocgList[0] ? this.listTypeInfo.pocgList[0].value : ''
      } else {
        this.formList.station.pocg_id = ''
      }
    }
  },
  methods: {
    // TODO: 对字段进行操作 (正佳广场项目, 需要将表计编码改成电表编号)
    changeFieldList () {
      if (this.projectInfo.proj_code === this.$config.PROJCODE_ZJ) {
        // 将正佳相关数据清除
        let meter = this.formList.meter
        meter.metr_no = ''
        meter.metr_location = ''
        meter.metr_elicloss = ''
        meter.metr_type = this.listTypeInfo.metrTypeList[0].value
        meter.metr_linesize = ''
        meter.metr_switchtype = ''
        let arr = [
          {value: 'metr_code', key: '表计代码', type: 'input', code: true, required: true, rules: checkMetrCodeLength},
          {value: 'metr_no', key: '电表编号', type: 'input', required: true}, // 正佳
          {value: 'metr_name', key: '表计名称', type: 'input', required: true, width: '240px'},
          {value: 'metr_entp_id', key: '能耗类型', type: 'select', list: 'entpList', required: true},
          {value: 'metr_driv_id', key: '关联驱动', type: 'tag', list: 'driveList', required: true, hidden: true},
          {value: 'metr_addr', key: '相对地址', type: 'input', required: true},
          {value: 'metr_channel', key: '采集器通道', type: 'input', hidden: true},
          {value: 'metr_voltage', key: '电压等级', type: 'input'},
          {value: 'metr_intake', key: '是否总表', type: 'select', list: 'isList', required: true},
          {value: 'metr_rate', key: '变比', type: 'input', hidden: true, required: true},
          {value: 'metr_installDate', key: '安装日期', type: 'date', dateType: 'date', hidden: true},
          {value: 'metr_virtual', key: '是否虚拟计表', type: 'select', list: 'isList', required: true},
          // 正佳 从这往下
          {value: 'metr_location', key: '电表位置', type: 'input'},
          {value: 'metr_elicloss', key: '电损系数', type: 'input', required: true},
          {value: 'metr_type', key: '电表型号', type: 'select', list: 'metrTypeList', required: true},
          {value: 'metr_linesize', key: '电览截面', type: 'input'},
          {value: 'metr_switchtype', key: '开关型号', type: 'input'},
          // 到这
          {value: 'metr_status', key: '状态', type: 'select', list: 'statusList', required: true},
          {value: 'metr_exprnames', key: '虚拟表达式', type: 'textarea', hidden: true, event: 'handleExpression'}
        ]
        this.$set(this.fieldList, 'meter', arr)
      }
      this.initRules()
    },
    // 初始化验证数据
    initRules () {
      let obj = {}
      // 循环字段列表
      for (let key in this.fieldList) {
        for (let child of this.fieldList[key]) {
          let type = child.type === 'select' ? '选择' : '输入'

          if (child.required) {
            if (child.rules) {
              obj[child.value] = {
                required: child.required,
                validator: child.rules,
                trigger: 'blur'
              }
            } else {
              obj[child.value] = {
                required: child.required,
                message: '请' + type + child.key,
                trigger: 'blur'
              }
            }
          }
        }
      }
      this.rules = obj
    },
    // 初始化查询相关数据
    initlistTypeInfo () {
      // 得到所有的区域列表
      // this.$api.getAreaTreeApi().then(response => {
      //   this.listTypeInfo.areaList = response.content.data
      // })
      // .catch(() => {
      //   console.log('获取区域列表失败')
      // })
      // 得到所有的能耗类型列表
      this.$api.getEntpApi({proj_id: this.projectInfo.proj_id}).then(response => {
        this.listTypeInfo.entpList = response.content.data
        this.listTypeInfo.entpList.forEach(item => {
          item.value = item.entp_id
          item.key = item.entp_name
        })
      })
      .catch(() => {
        console.log('获取能耗类型失败')
      })
      // 得到驱动列表
      getDriveApi ({proj_id: this.projectInfo.proj_id}).then(response => {
        this.listTypeInfo.driveList = response.content.data
        this.listTypeInfo.driveList.forEach(item => {
          item.value = item.driv_id
          item.key = item.driv_name
        })
      })
      .catch(() => {
        console.log('获取驱动列表失败')
      })
      // 得到所有的表计数据
      this.$api.getMetrApi({projID: this.projectInfo.proj_id}).then(response => {
        this.listTypeInfo.metrList = response.content.data
        this.listTypeInfo.metrList.forEach(item => {
          item.key = item.metr_name
          item.value = item.metr_id
        })
      })
      .catch(() => {
        console.log('获取表计列表失败')
      })
      // 得到测点单位列表
      getPounApi({proj_id: this.projectInfo.proj_id}).then(response => {
        this.listTypeInfo.pounList = response.content.data
        this.listTypeInfo.pounList.forEach(item => {
          item.value = item.poun_id
          item.key = item.poun_name
        })
      })
      .catch(() => {
        console.log('获取测点单位列表失败')
      }) 
      // 得到所有的测点类
      getPocgInfoApi({proj_id: this.projectInfo.proj_id}).then(response => {
        this.listTypeInfo.pocgList = response.content.data.typeCount
        this.listTypeInfo.pocgList.forEach(item => {
          item.value = item.pocg_id
          item.key = item.pocg_name
          // item.AI = item.poat_type.AI || 0
          // item.DI = item.poat_type.DI || 0
          // item.AO = item.poat_type.AO || 0
          // item.DO = item.poat_type.DO || 0
        })
        // 得到属性值
        this.classDataAddr = response.content.data.maxaddr
        for (let key in this.classDataAddr) {
          if (this.classDataAddr[key]) {
            this.classDataAddr[key] = this.classDataAddr[key] + 1
          }
        }
      })
      .catch(() => {
        console.log('获取测点列表失败')
      })
      // 得到所有的建模字段
      this.$api.getParamsTypeApi({cod_type: 'PN01'}).then(response => {
        this.listTypeInfo.modeFieldList = response.content.data
        this.listTypeInfo.modeFieldList.forEach(item => {
          item.value = item.cod_value
          item.key = item.cod_name
        })
      })
      .catch(() => {
        console.log('获取建模字段列表失败')
      })
    },
    // 表单绑定的事件中间层 (解决动态事件绑定问题)
    handleEventM (event, val) {
      if (event) {
        this[event](val)
      }
    },
    // 绑定虚拟表达式
    handleExpression () {
      this.dialogInfo.expressionShow = true
    },
    // 更换测点类型触发函数
    handlePoitChange (val) {
      let data = this.fieldList.station,
          _this = this
      switch (val) {
        case 'AI':
          setPounList(data, '基本单位', 1)
          setDisabled(data, ['poit_formula'])
          break
        case 'DI':
          setPounList(data, '数字量', 2)
          setDisabled(data, ['poit_formula', 'poit_coefficient', 'poit_digits'])
          break
        case 'CalAI':
          setPounList(data, '基本单位', 1)
          setDisabled(data, ['poit_addr', 'poit_coefficient'])
          break
        // case 'DO':
        //   setPounList(data, '数字量', 2)
        //   setDisabled(data, ['poit_coefficient', 'poit_untp_id'])
        //   break
        // case 'AO':
        //   setPounList(data, '单位', 1)
        //   break
        case 'CalDI':
          setPounList(data, '数字量', 2)
          setDisabled(data, ['poit_addr', 'poit_coefficient', 'poit_digits'])
          break
      }
      // 设置测点单位列表
      function setPounList (arr, key, poun_type) {
        _this.formList.station.poit_untp_id = ''
        for (let item of arr) {
          if (item.value === 'poit_untp_id') {
            item.key = key
            _this.listTypeInfo.pounTypeList = _this.listTypeInfo.pounList.filter(item => {
              return item.poun_type === poun_type
            })
          }
        }
      }
      // 设置禁用
      function setDisabled (arr, disabledArr) {
        // 先全部设为空
        for (let item of arr) {
          item.disabled = false
        }
        // 第二次将对应的禁用设置
        for (let item of arr) {
          for (let item1 of disabledArr) {
            if (item.value === item1) {
              item.disabled = true
            }
          }
        }
      }
    },
    /**
     * 通过当前数据类型和事件类型，得到当前的接口
     * @param {String} type 数据类型
     * @param {String} eventType 事件类型
     * @param {all} param 接口参数 编辑操作的时候为form数据， 查询操作的时候为数据ID
     * @return {Function} API 接口函数
     */
    handleApi (type, eventType, param) {
      let api, 
          rightData = this.treeInfo.rightData,
          leftData = this.treeInfo.leftData,
          projectInfo = this.projectInfo,
          query = this.listInfo.query,
          data = this.formList[type]
      switch (type) {
      case 'project':
        if (eventType === 'refresh') {
          api = getBuildListApi
          // 处理查询数据
          query.proj_id = projectInfo.proj_id
          query.bubi_id = ''
          query.daci_id = ''
          query.metr_id = ''
          query.pocg_id = ''
        }
        break
      case 'build':
        if (eventType === 'add') {
          // 处理添加参数
          data.bubi_proj_id = projectInfo.proj_id
          // 设置编码
          data.bubi_code = data.code_head + data.code_foot
          api =  addBuildApi
        } else if (eventType === 'update') {
          // 设置编码
          data.bubi_code = data.code_head + data.code_foot
          api =  updateBuildApi
        } else if (eventType === 'delete') {
          api =  deleteBuildApi
        } else if (eventType === 'refresh') {
          // 处理查询数据
          query.proj_id = projectInfo.proj_id
          query.bubi_id = leftData.bubi_id
          query.daci_id = ''
          query.metr_id = ''
          query.pocg_id = ''
          api =  getCollectorListApi
        } else if (eventType === 'row') {
          api =  getBuildRowApi
          // 设置查询参数
          param = {bubi_id: param}
        }
        break
      case 'collector':
        if (eventType === 'add') {
          // 处理添加参数
          data.daci_proj_id = projectInfo.proj_id
          data.daci_bubi_id = rightData.bubi_id
          // 设置编码
          data.daci_code = data.code_head + data.code_foot
          api =  addCollectorApi
        } else if (eventType === 'update') {
          // 设置编码
          data.daci_code = data.code_head + data.code_foot
          api =  updateCollectorApi
        } else if (eventType === 'delete') {
          api =  deleteCollectorApi
        } else if (eventType === 'refresh') {
          // 处理查询数据
          query.proj_id = projectInfo.proj_id
          query.bubi_id = ''
          query.daci_id = leftData.daci_id
          query.metr_id = ''
          query.pocg_id = ''
          api =  getMeterListApi
        } else if (eventType === 'row') {
          api =  getCollectorRowApi
          // 设置查询参数
          param = {daci_id: param}
        }
        break
      case 'meter':
        if (eventType === 'add') {
          // 处理添加参数
          data.metr_proj_id = projectInfo.proj_id
          data.metr_daci_id = rightData.daci_id
          data.metr_bubi_id = rightData.daci_bubi_id
          // 设置编码
          data.metr_code = data.code_head + data.code_foot
          api =  addMeterApi
        } else if (eventType === 'update') {
          // 设置编码
          data.metr_code = data.code_head + data.code_foot
          api =  updateMeterApi
        } else if (eventType === 'delete') {
          api =  deleteMeterApi
        } else if (eventType === 'refresh') {
          // 处理查询数据
          query.proj_id = projectInfo.proj_id
          query.bubi_id = ''
          query.daci_id = ''
          query.metr_id = leftData.metr_id
          query.pocg_id = ''
          api =  getStationListApi
        } else if (eventType === 'row') {
          api =  getMeterRowApi
          // 设置查询参数
          param = {metr_id: param}
        }
        // 设置编码
        data.metr_code = data.code_head + data.code_foot
        break
        case 'station':
        if (eventType === 'add') {
          // 处理添加参数
          data.poit_proj_id = projectInfo.proj_id
          data.poit_device_id = rightData.metr_id
          data.device_id = rightData.metr_id
          // 根据是否按类添加来判断API
          api =  data.isClass ? addClassStationApi : addStationApi
        } else if (eventType === 'update') {
          api =  updateStationApi
        } else if (eventType === 'delete') {
          api =  deleteStationApi
        } else if (eventType === 'refresh') {
          // 处理查询数据
          query.proj_id = projectInfo.proj_id
          query.bubi_id = ''
          query.daci_id = ''
          query.metr_id = ''
          query.pocg_id = leftData.poit_id
          api =  getStationListApi
        } else if (eventType === 'row') {
          api =  getStationRowApi
          // 设置查询参数
          param = {poit_id: param}
        }
        break
      }
      // 请求对应的接口
      return new Promise((resolve, reject) => {
        // 对参数做处理
        let obj = JSON.parse(JSON.stringify(param))
        delete obj.project
        delete obj.build
        delete obj.collector
        delete obj.meter
        delete obj.station
        
        api(obj).then(response => {
          if (response.success) {
          } else {
            this.$message({
              showClose: true,
              message: response.message,
              type: 'error',
              duration: 3500
            })
          }
          resolve(response)
        })
        .catch(() => {
          reject()
        })
      })
    },
    // 树状组件左键点击的处理
    cdHandleClickLeft (data) {
      if (data.type === 'meter') {
        // 对字段进行操作
        this.changeFieldList()
      }
      // 页数初始化
      this.listInfo.initCurPage = true
      // 得到左键点击类型
      this.treeInfo.leftType = data.type
      // 得到表单要显示的数据
      data.areaList = [this.projectInfo.dist_pid, this.projectInfo.dist_id]

      // 先得到数据
      this.showForm = data
      this.treeInfo.leftData = data

      // 获取表格数据
      this.getList(data.type)
      
      // 获取当前点击的数据 (替换得到最新数据)
      this.handleApi (data.type, 'row', data.bubi_id || data.daci_id || data.metr_id || data.poit_id)
      .then(response => {
        if (response.success) {
          let row = response.content.data[0]
          // 表单显示数据
          this.showForm = row
          // 得到当前点击数据
          this.treeInfo.leftData = row
        }
      })
      .catch(() => {
      })
    },
    // 树状组件右键的点击事件
    cdHandleClickRight (data, node) {
      // 表单内容初始化
      this.resetForm()
      // 对表计添加和编辑操作的时候，对表计字段的重新生成
      if (data.type === 'meter' || data.type === 'collector') {
        // 对字段进行操作
        this.changeFieldList()
      }
    },
    // 数状组件右键事件点击的处理
    cdHandleRightEvent (type, data, node) {
      let _type,
          _data = JSON.parse(JSON.stringify(data)),
          areaCode = this.projectInfo.dist_code,
          formList = this.formList 
      // 得到树组件操作的层级
      this.treeInfo.refreshLevel = node.level
      // 添加和编辑显示的是不同类型的数据
      switch (data.type) {
      case 'project':
        if (type === 'add') {
          _type = 'build'
          // 对code输入框头部做处理
          formList.build.code_head = areaCode + (formList.build.bubi_func || 'X')
          this.$watch('formList.build.bubi_func', () => {
            formList.build.code_head = areaCode + (formList.build.bubi_func || 'X')
          })
        } else {  
          _type = 'project'
        }
        break
      case 'build':
        if (type === 'add') {
          _type = 'collector'
          // 对code输入框头部做处理
          formList.collector.code_head = _data.bubi_code
        } else {  
          _type = 'build'
          // 对code输入框头部做处理
          formList.build.code_head = areaCode + (formList.build.bubi_func || 'X')
          this.$watch('formList.build.bubi_func', () => {
            formList.build.code_head = areaCode + (formList.build.bubi_func || 'X')
          })
          // 对code输入框尾部做处理
          formList.build.code_foot = _data.bubi_code.substring(7)
        }
        break
      case 'collector':
        if (type === 'add') {
          this.getClassInfo()
          _type = 'meter'
          // 对code输入框头部做处理
          formList.meter.code_head = _data.daci_code
          formList.meter.metr_driv_id = _data.daci_driv_id
          if (this.projectInfo.proj_code === this.$config.PROJCODE_ZJ) {
            formList.meter.metr_type = this.listTypeInfo.metrTypeList[0].value
          }
        } else {  
          _type = 'collector'
          // 对code输入框头部做处理
          formList.collector.code_head = _data.build.bubi_code
          // 对code输入框尾部做处理
          formList.collector.code_foot = _data.daci_code.replace(_data.build.bubi_code, '')
        }
        break
      case 'meter':
        if (type === 'add') {
          this.getClassInfo()
          _type = 'station'
          formList.station.poit_driv_id = _data.collector.daci_driv_id
        } else {  
          _type = 'meter'
          // 对code输入框头部做处理
          formList.meter.code_head = _data.collector.daci_code
          // 对code输入框尾部做处理
          formList.meter.code_foot = _data.metr_code.replace(_data.collector.daci_code, '')
        }
        break
      case 'station':
        this.getClassInfo()
        _type = 'station'
        formList.station.poit_driv_id = _data.meter.metr_driv_id
        // 初始化测点配置
        this.handlePoitChange(_data.poit_type)
        break
      }
      // 添加的时候将数据清除
      if (type === 'add') {
        for (let key in _data) {
          _data[key] = ''
        }
      }
      // 右键点击类型
      this.treeInfo.rightType = _type
      // 右键点击数据
      this.treeInfo.rightData = JSON.parse(JSON.stringify(data))
      // 调用事件中间层
      this.handleClickBt(type, data)
      // 先得到数据
      for (let key in _data) {
        // 不对测点地址做处理
        if (['ai', 'di', 'ao', 'do'].indexOf(key) === -1) {
          formList[_type][key] = _data[key]
        }
      }

      // 最大值赋值
      if ('ai' in formList[_type]) {
        formList[_type].ai = this.classDataAddr.AI || 0
      }
      if ('di' in formList[_type]) {
        formList[_type].di = this.classDataAddr.DI || 0
      }
      if ('ao' in formList[_type]) {
        formList[_type].ao = this.classDataAddr.AO || 0
      }
      if ('do' in formList[_type]) {
        formList[_type].do = this.classDataAddr.DO || 0
      }

      this.$watch('classDataAddr', () => {
        if ('ai' in formList[_type]) {
          formList[_type].ai = this.classDataAddr.AI || 0
        }
        if ('di' in formList[_type]) {
          formList[_type].di = this.classDataAddr.DI || 0
        }
        if ('ao' in formList[_type]) {
          formList[_type].ao = this.classDataAddr.AO || 0
        }
        if ('do' in formList[_type]) {
          formList[_type].do = this.classDataAddr.DO || 0
        }
      })
      // 获取当前点击的数据(替换得到最新数据)
      this.handleApi (data.type, 'row', data.bubi_id || data.daci_id || data.metr_id || data.poit_id)
      .then(response => {
        if (response.success) {
          let row = response.content.data[0]
          // 得到当前表单数据
          for (let key in row) {
            // 不对页面上的ai,di,ao,do做初始化处理
            if (['ai', 'di', 'ao', 'do'].indexOf(key) === -1) {
              formList[_type][key] = row[key]
            }
          }
        }
      })
      .catch(() => {
      })
    },
    // 数据处理
    dealParam () {
      // 对数据做处理
      let query = this.listInfo.query

      // 如果点击了树状，则此时请求第一页
      query.curPage = this.listInfo.initCurPage ? 1 : query.curPage
      // 参数重置
      this.listInfo.initCurPage = false
    },
    // 得到数据
    getList (type) {
      this.dealParam()
      this.listInfo.loading = true
      this.handleApi(type, 'refresh', this.listInfo.query)
        .then(response => {
          this.listInfo.loading = false
          if (response.success) {
            this.listInfo[this.treeInfo.listType] = response.content.data
            this.listInfo.total = response.content.total
            // this.listInfo.query.curPage = response.content.curPage
            // this.listInfo.query.pageSize = response.content.pageSize
          } else {
            this.$message({
              showClose: true,
              message: response.message,
              type: 'error',
              duration: 3500
            })
          }
        })
        .catch(() => {
          this.listInfo.loading = false
        })
    },
    // 得到类
    getClassInfo () {
      // 得到所有的测点类
      getPocgInfoApi({proj_id: this.projectInfo.proj_id}).then(response => {
        this.classDataAddr = response.content.data.maxaddr
        for (let key in this.classDataAddr) {
          if (this.classDataAddr[key]) {
            this.classDataAddr[key] = this.classDataAddr[key] + 1
          }
        }
      })
      .catch(() => {
        console.log('获取测点列表失败')
      })
    },
    // 页面切换
    handleCurrentChange (val) {
      this.listInfo.query.curPage = val // 当前页
      this.getList(this.treeInfo.leftType)
    },
    // 页数改变
    handleSizeChange (val) {
      this.listInfo.query.pageSize = val  // 一页几个
      this.getList(this.treeInfo.leftType)
    },
    // 切换类, 得到当前类下面的数据类型
    handleChangePocg (pocgId) {
      // this.listTypeInfo.pocgList.forEach(item => {
      //   if (item.pocg_id === pocgId) {
      //     this.classDataAddr = item
      //   }
      // })
    },
    // 得到placeholder的显示
    getPlaceholder (row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.key
      } else if (row.type === 'select' || row.type === 'date') {
        placeholder = '请选择' + row.key
      } else {
        placeholder = row.key
      }
      return placeholder
    },
    // 按钮的点击
    handleClickBt (type, row) {
      switch (type) {
      case 'add':
        this.dialogInfo.show = true
        this.dialogInfo.status = 'add'
        break
      case 'update':
        this.dialogInfo.show = true
        this.dialogInfo.status = 'update'
        // 显示当前数据
        this.form = JSON.parse(JSON.stringify(row))
        break
      case 'delete':
        this.handleDelete(row)
        break
      }
    },
    // 确认的事件处理
    handleConfirm (type) {
      // 添加和编辑的事件处理
      this.$refs.form.validate(valid => {
        if (valid) {
          let dataType = this.treeInfo.rightType,
          data = this.formList[dataType]
          this.dialogInfo.btLoading = true
          this.handleApi(dataType, type, data)
            .then(response => {
              if (response.success) {
                // 添加成功之后对类的起始地址做操作
                if (data.isClass || data.activeNames) {
                  // let meter = this.formList.meter,
                  //     station = this.formList.station
                  // meter.ai = (meter.ai || 0) + this.classDataAddr.AI
                  // meter.di = (meter.di || 0) + this.classDataAddr.DI
                  // meter.ao = (meter.ao || 0) + this.classDataAddr.AO
                  // meter.do = (meter.do || 0) + this.classDataAddr.DO
                  // station.ai = (station.ai || 0) + this.classDataAddr.AI
                  // station.di = (station.di || 0) + this.classDataAddr.DI
                  // station.ao = (station.ao || 0) + this.classDataAddr.AO
                  // station.do = (station.do || 0) + this.classDataAddr.DO
                }
                // 刷新列表
                // this.getList(this.treeInfo.leftType)
                // 刷新树
                this.treeInfo.refresh = Math.random()
                this.dialogInfo.show = false
                TYPE = 'success'
              } else {
                this.dialogInfo.btLoading = false
                TYPE = 'error'
              }
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
    // 删除的事件处理
    handleDelete (row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let dataType = this.treeInfo.rightType
          this.handleApi(dataType, 'delete', row).then(response => {
            if (response.success) {
              // 刷新列表
              // this.getList(this.treeInfo.leftType)
              // 刷新树
              this.treeInfo.refresh = Math.random()
              MESSAGE = '删除成功'
              TYPE = 'success'
            } else {
              MESSAGE = '未知错误'
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
      let obj = {
        // 建筑
        build: {
          bubi_id: '', // 建筑ID *
          bubi_proj_id: '', // 项目ID *
          bubi_code: '', // 建筑编码 *
          code_head: '',
          code_foot: '',
          bubi_name: '', // 建筑名称 *
          bubi_alias: '', // 建筑别名 *
          bubi_owner: '', // 建筑业主
          bubi_status: 1, // 建筑监测状态 *
          bubi_districtCode: '', // 所属行政区划
          bubi_address: '', // 建筑地址
          bubi_longitude: '', // 经度
          bubi_latitude: '', // 纬度
          bubi_year: '', // 建设年代
          bubi_upFloor: '', // 地上建筑层数
          bubi_downFloor: '', // 地下建筑层数
          bubi_personNum: '', // 建筑办公人数
          bubi_func: '', // 建筑功能 *
          bubi_totalArea: '', // 建筑总面积
          bubi_airArea: '', // 空调面积
          bubi_heatArea: '', // 采暖面积
          bubi_airType: '', // 建筑空调系统形式
          bubi_heatType: '', // 建筑采暖系统形式
          bubi_bodyCoef: '', // 建筑体型系数
          bubi_struType: '', // 建筑结构形式
          bubi_wallMatType: '', // 建筑外墙材料形式
          bubi_wallWarmType: '', // 建筑外墙保温形式
          bubi_wallWinType: '', // 建筑外窗类型
          bubi_glassType: '', // 建筑玻璃类型
          bubi_winFrameType: '', // 窗框材料类型
          bubi_isStandard: '', // 是否是标杆建筑
          bubi_designDept: '', // 监测方案设计单位
          bubi_workDept: '', // 监测工程实施单位
          bubi_monitorDate: '', // 开始监测日期
          bubi_acceptDate: '', // 能耗监测工程验收日期
          bubi_pic: '', // 建筑图片路径
          bubi_desc: '' // 建筑描述
        },
        // 采集器
        collector: {
          daci_id: '', // 数据采集器ID *
          daci_bubi_id: '', // 建筑ID *
          daci_code: '', // 数据采集器代码 *
          code_head: '',
          code_foot: '',
          daci_name: '', // 数据采集器名称 *
          daci_driv_id: '', // 驱动ID *
          daci_addr: '', // 相对地址 *
          daci_mac: '', // 采集器MAC地址
          daci_ip: '', // 采集器IP地址
          daci_url: '', // 数据采集器URL
          daci_startTime: '', // 数据采集器开始使用时间
          daci_collectInterval: '', // 数据采集器采集频率
          daci_installPerson: '', // 安装人员
          daci_installDate: '', // 安装日期
          daci_installAddress: '', // 安装位置
          daci_status: 1 // 状态 *
        },
        // 表计
        meter: {
          metr_id: '', // 表计ID *
          metr_bubi_id: '', // 建筑ID *
          metr_entp_id: '', // 能耗分类ID *
          metr_code: '', // 表计代码 *
          metr_no: '', // 电表编号 * TODO: 正佳广场项目使用这个字段
          code_head: '',
          code_foot: '',
          metr_name: '', // 表计名称 *
          metr_driv_id: '', // 驱动ID *
          metr_addr: '', // 相对地址 *
          metr_daci_id: '', // 数据采集器ID *
          metr_channel: '', // 采集器通道
          metr_intake: 0, // 是否总表 *
          metr_voltage: '', // 电压等级
          metr_rate: '', // 变比 *
          metr_installDate: '', // 安装日期
          metr_virtual: 0, // 是否虚拟计表 *
          metr_expression: '', // 虚拟表达式 id拼接
          metr_exprnames: '', // 虚拟表达式文字拼接
          metr_status: 1, // 表计状态 *

          // 按类添加的参数e
          activeNames: '1',
          // flag: true,
          device_id: '',
          pocg_id: '',
          // ai: 0,
          // di: 0,
          // ao: 0,
          // do: 0
        },
        // 测点
        station: {
          poit_id: '', // 测点ID *
          poit_proj_id: '', // 项目ID *
          poit_driv_id: '', // 驱动ID *
          poit_name: '', // 测点名称 *
          poit_type: '', // 测点类型 *
          poit_addr: '', // 相对地址 *
          poit_formula: '', // 计算公式
          poit_coefficient: '', // 系数
          poit_untp_id: '', // 单位类型ID
          poit_digits: '', // 保留小数点
          poit_device_id: '', // 设备ID
          poit_store: '', // 是否存储
          poit_field: '', // 建模字段
          poit_addtime: '', // 创建时间 *
          // 按类添加的参数
          isClass: false,
          device_id: '',
          pocg_id: '',
          // ai: 0,
          // di: 0,
          // ao: 0,
          // do: 0
        }
      }

      for (let key in obj) {
        let item = this.formList[key]
        for (let childKey in obj[key]) {
          item[childKey] = obj[key][childKey]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .S0801A{
    position: relative;
    padding: 20px 30px;
    .tree{
      position: absolute;
      margin: 20px 0 10px 10px;
      width: 260px;
      left: 0;
      top: 0;
      bottom: 0;
      overflow: auto;
      border: 1px solid rgb(200, 200, 200)
    }
    .content{
      margin-left: 240px;
    }
  }
</style>
