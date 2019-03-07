<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.title" :name="item.title">
        <ChildrenPage1 
          v-if="item.title === activeName || item.init" 
          :alsgAlarmtype="item.value" 
          :alsgAlarmtypeName="$fn.getDataName({dataList: tabList, value: 'value', label: 'key', data: item.value})">
        </ChildrenPage1>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ChildrenPage1 from './childrenPage1'
export default {
  props: {
  },
  components: {
    ChildrenPage1
  },
  data () {
    return {
      activeName: '',
      tabList: [
        {title: '测点报警设置', key: '测点', value: -1, alarmtype: 'AI越限报警/DI变位报警', init: false},
        {title: '设备报警设置', key: '设备', value: 2, alarmtype: '设备报警', init: false},
        {title: '采集器报警设置', key: '采集器', value: 3, alarmtype: '采集器报警', init: false},
        {title: '驱动报警设置', key: '驱动', value: 4, alarmtype: '驱动报警', init: false},
        {title: '能耗报警设置', key: '设备', value: 5, alarmtype: '能耗报警', init: false}
      ]
    }
  },
  watch: {
    activeName () {
      for (let item of this.tabList) {
        if (item.title === this.activeName) {
          item.init = true
        }
      }
    }
  },
  created () {
    this.activeName = this.tabList[0].title
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
