<template>

  <div>

    <div ref='pdiv' @click='showSelectC'>
      <a-input :disabled='true' v-model='erpMeterNumberRecordName' :placeholder="$t('ErpMeterNumberRecord.clickSelect')"></a-input>
    </div>
    <a-modal v-model='showSelect' width='1200px' @ok='handleOk'>
      <div class='table-page-search-wrapper'>
        <a-form layout='inline' @keyup.enter.native='searchQuery'>
          <a-row :gutter='24'>
	            	            	            	            	            	            	            	            	            	            	            	            	            	            	            	            	                        <a-col :md='6' :sm='8'>
                <span style='float: left;overflow: hidden;' class='table-page-search-submitButtons'>
                  <a-button type='primary' @click='searchQuery' icon='search'>{{ $t('common.query') }}</a-button>
                </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div>
        <a-table
          size='middle'
          rowKey='id'
          width='300'
          :scroll='{x:true}'
          :columns='columns'
          :dataSource='dataSource'
          :pagination='pageInfo'
          :loading='loading'
          :customRow='itemSelect'
          @change='handleTableChange'

        >
        </a-table>
      </div>
    </a-modal>
  </div>


</template>

<script>
import API from '@/api/ErpMeterNumberRecord'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'LaisonInputErpMeterNumberRecordSelect',
  mixins: [JeecgListMixin],
  components: {},
  props: ['conditions', 'options', 'value'],
  watch: {
    value: {
      handler(newValue, oldValue) {
	      if(this.value != newValue){
	      	this.value = newValue
	      }
      },
      deep: true,
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true
    }
  },
  data() {
    return {

      loading: true,
      erpMeterNumberRecordName: null,
      showSelect: false,
      currentErpMeterNumberRecord: null,
      orderByClause:'create_time desc',
      columns: [
            {
                title: this.$t('ErpMeterNumberRecord.id'),
                align: "center",
                dataIndex: 'id'
            },
            {
                title: this.$t('ErpMeterNumberRecord.orderId'),
                align: "center",
                dataIndex: 'orderId'
            },
            {
                title: this.$t('ErpMeterNumberRecord.stockCode'),
                align: "center",
                dataIndex: 'stockCode'
            },
            {
                title: this.$t('ErpMeterNumberRecord.length'),
                align: "center",
                dataIndex: 'length'
            },
            {
                title: this.$t('ErpMeterNumberRecord.prifix'),
                align: "center",
                dataIndex: 'prifix'
            },
            {
                title: this.$t('ErpMeterNumberRecord.roleCode'),
                align: "center",
                dataIndex: 'roleCode'
            },
            {
                title: this.$t('ErpMeterNumberRecord.serialNumberLength'),
                align: "center",
                dataIndex: 'serialNumberLength'
            },
            {
                title: this.$t('ErpMeterNumberRecord.numberCount'),
                align: "center",
                dataIndex: 'numberCount'
            },
            {
                title: this.$t('ErpMeterNumberRecord.startNumber'),
                align: "center",
                dataIndex: 'startNumber'
            },
            {
                title: this.$t('ErpMeterNumberRecord.start'),
                align: "center",
                dataIndex: 'start'
            },
            {
                title: this.$t('ErpMeterNumberRecord.endNumber'),
                align: "center",
                dataIndex: 'endNumber'
            },
            {
                title: this.$t('ErpMeterNumberRecord.end'),
                align: "center",
                dataIndex: 'end'
            },
            {
                title: this.$t('ErpMeterNumberRecord.deptId'),
                align: "center",
                dataIndex: 'deptId'
            },
            {
                title: this.$t('ErpMeterNumberRecord.delFlag'),
                align: "center",
                dataIndex: 'delFlag'
            },
            {
                title: this.$t('ErpMeterNumberRecord.state'),
                align: "center",
                dataIndex: 'state'
            },
            {
                title: this.$t('ErpMeterNumberRecord.createTime'),
                align: "center",
                dataIndex: 'createTime'
            },
            {
                title: this.$t('ErpMeterNumberRecord.fileUrl'),
                align: "center",
                dataIndex: 'fileUrl'
            },
      ]
    }
  },


  created() {
    this.pageInfo.condition.orderByClause = this.orderByClause
    this.pageInfo.condition.delFlag = 0
    if (this.conditions) {
      for (let k in this.conditions) {
        this.pageInfo.condition[k] = this.conditions[k]
      }
    }
    this.loadData()

	if(this.value){
	
		 API.findById(this.value).then(res => {
		      this.currentErpMeterNumberRecord = res
		      if (this.currentErpMeterNumberRecord) {
		       this.erpMeterNumberRecordName = this.currentErpMeterNumberRecord.erpMeterNumberRecordName //自动生成的修改成res中对应的属性名
	    	  }
	     })
		
	    
	}
    


  },
  methods: {

    show() {
      this.loadData()
    },
    itemSelect(record, index) {
      return {
        on: {
          click: () => {
            this.currentErpMeterNumberRecord = record
            this.erpMeterNumberRecordName =  record.erpMeterNumberRecordName  //自动生成的修改成res中对应的属性名
           
            this.$emit('input',record);
            this.$emit('change', record)
            this.showSelect = false
          }
        }
      }

    },
    showSelectC() {
      console.log(this.value)
      if (!(this.options && this.options.disabled)) {
        
        API.findByPage(this.pageInfo).then(
        (res) => {
          this.dataSource = res.list
          this.pageInfo.total = res.total
          this.loading = false
          this.showSelect = true
        }
        
      )
      }
    },
    handleOk() {
      this.showSelect = false
    },
    loadData() {
      //this.currentErpMeterNumberRecord = null
      API.findByPage(this.pageInfo).then(
        (res) => {
          this.dataSource = res.list
          this.pageInfo.total = res.total
          this.loading = false
        }
      )
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.ant-input[disabled] {
  background-color: transparent;
  cursor: pointer;
  opacity: 1;
  color: #000;
}
</style>