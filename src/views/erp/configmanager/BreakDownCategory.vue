<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">{{ $t('common.add') }}</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
               ref="table"
               size="middle"
               rowKey="id"
               class="j-table-force-nowrap"
               :scroll="{ x: true }"
               :columns="columns"
               :dataSource="dataSource"
               :loading="loading"
               :pagination="false"
               :expandedRowKeys="expandedRowKeys"
               @expand="handleExpand">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">{{ $t('common.edit') }}</a>
          <a-divider type="vertical" v-show="record.menuType !== 2" />
          <a @click="handleAddChild(record)" v-show="record.menuType !== 2">{{ $t('common.addChild') }}</a>
          <a-divider type="vertical" v-show="!record.hasChild" />
          <a-popconfirm v-show="!record.hasChild" :title="$t('common.realDelete')"
                        @confirm="() => handleDeleteNode(record.id)" placement="topLeft">
            <a>{{ $t('common.delete') }}</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <category-modal ref="modalForm" @ok="modalFormOk"></category-modal>
  </a-card>
</template>

<script>
import CategoryModal from './modules/BreakDownCategoryModal.vue'

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import API from '@/api/BreakdownCategories'
export default {
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    CategoryModal,
  },
  data() {
    return {
      // 表头
      columns: [
        {
          title: '分类名',
          align: 'left',
          dataIndex: 'name',
        },
        {
          title: '分类描述',
          align: 'center',
          dataIndex: 'remarks',
        },

        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      expandedRowKeys: [], //哪些被展开了
      hasChildrenField: 'hasChild',
      pidField: 'parentId',
      dictOptions: {},
      loadParent: false,
      superFieldList: [],
      // dataSource: mockres,
    }
  },
  watch: {
    dataSource: {
      handler: function () {
        console.log(this.dataSource)
      },
      deep: true,
    },
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      this.pageInfo.condition.level = 1
      //判断条件
      let conditionCount = 0
      Object.keys(this.pageInfo.condition).forEach((key) => {
        if (this.pageInfo.condition[key] && this.pageInfo.condition[key] != '') {
          conditionCount++
        }
      })
      if (conditionCount > 2) {
        //大于2个条件
        //this.pageInfo.condition.level=null
        delete this.pageInfo.condition.level
      }
      API.queryTreeList(this.pageInfo).then((res) => {
        this.dataSource = res.data.children
        // this.pageInfo.total = parseInt(res.total)
        this.loading = false
        this.loadDataByExpandedRows(this.dataSource) //加载子级
      })
    },
    handleExpand(expanded, record) {
      if (expanded) {
        this.expandedRowKeys.push(record.id)
        let a = []
        a.push(record)
        this.loadDataByExpandedRows(a)
      } else {
        let keyIndex = this.expandedRowKeys.indexOf(record.id)
        if (keyIndex >= 0) {
          this.expandedRowKeys.splice(keyIndex, 1)
        }
      }
    },
    fillChild(dataList, childrenMap) {
      //注意这里是递归 递归的时候判断条件
      if (dataList && dataList.length > 0) {
        dataList.forEach((data) => {
          if (this.expandedRowKeys.includes(data.id)) {
            data.children = childrenMap.get(data.id)
            this.fillChild(data.children, childrenMap)
          }
        })
        console.log(dataList, '--line362')
      }
    },
    // 根据已展开的行查询数据（用于保存后刷新时异步加载子级的数据）
    loadDataByExpandedRows(dataList) {
      if (this.expandedRowKeys.length > 0) {
        //如果有被展开的节点
        API.getChildListBatch(this.expandedRowKeys).then((res) => {
          let records = res.list
          let listMap = new Map()
          for (let item of records) {
            let pid = item[this.pidField]
            if (this.expandedRowKeys.includes(pid)) {
              let mapList = listMap.get(pid)
              if (mapList == null) {
                mapList = []
              }
              mapList.push(item)
              listMap.set(pid, mapList)
            }
          }
          this.fillChild(dataList, listMap)
        })
      }
    },
    // getDataByResult(result){
    //   if(result){
    //     return result.map(item=>{
    //       //判断是否标记了带有子节点
    //       if(item[this.hasChildrenField]=='1'){
    //         let loadChild = { id: item.id+'_loadChild', name: 'loading...', isLoading: true }
    //         item.children = [loadChild]
    //       }
    //       return item
    //     })
    //   }
    // },
    handleAdd() {
      this.loadParent = true
      let obj = {}
      obj.parentId = '0'
      obj.parentName = 'root'
      this.$refs.modalForm.add(obj)
    },

    handleAddChild(record) {
      this.loadParent = true
      let obj = {}
      obj.parentId = record.id
      obj.parentName = record.name
      this.$refs.modalForm.add(obj)
    },

    handleEdit: async function (record) {
      //
      if (record.parentId == '0') {
        record.parentName = 'root'
      } else {
        //前端自己找 一般都能找到因为要选择子菜单必须先打开父菜单
        let parent = API.selectNodeFromList(this.dataSource, record.parentId)
        //让后端找 方法前面加个 async省的后面加then
        //let parent = await API.findById(record.parentId)
        //console.log(parent,"dept")
        if (parent != null) {
          record.parentName = parent.title
        }
      }
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = this.$t('common.edit')
      this.$refs.modalForm.disableSubmit = false
    },
    handleDeleteNode(id) {
      API.realDeleteById(id).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.$store.dispatch('GetPermissionList')
        } else {
          this.$message.warning(res.errors)
        }
        this.loadData()
      })
    },
    batchDel() { },
    getSuperFieldList() { },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>