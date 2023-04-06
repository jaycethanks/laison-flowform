<template>
  <j-modal
    :title="model.configName"
    width="80vw"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @fullScreenEvent="isFullScreen = $event"
    @ok="handleOk"
    @cancel="handleOk"
    :body-style="{ maxHeight: isFullScreen ? '' : '70vh', overflowY: 'auto' }"
  >
    <a-spin :spinning="confirmLoading">
      <a-button style="margin-bottom: 10px" class="editable-add-btn" @click="addRecord()"> 添加 </a-button>

      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: 1300 }"
        bordered
        rowKey="id"
        :columns="columns"
        :expandedRowKeys.sync="expandedRowKeys"
        :dataSource="model.dataSource"
      >
        <template v-for="col in columnNames" :slot="col" slot-scope="text, record">
          <div :key="col">
            <a-input
              v-if="record.editable"
              :value="text"
              @change="(e) => handleChange(e.target.value, record, col, e.target)"
            />
            <template v-else> {{ text }} </template>
          </div>
        </template>
        <div slot="action" slot-scope="text, record">
          <span v-if="record.editable">
            <a @click="() => save(record)">保存</a>
            <!-- <a-divider type="vertical" />
            <a-popconfirm title="确认取消?" @confirm="() => cancel(record)">
              <a>取消</a>
            </a-popconfirm> -->
          </span>
          <span v-else>
            <ExtendJsonConfigModal
              class="inl"
              v-if="showProps"
              title="新的所有属性"
              :cusProp="record.new_AllProps"
              :codeNumber="record.codeNumber"
              @cusEvent="handNewAllPropsChange"
            />
            <a-divider v-if="showProps" type="vertical" />
            <ExtendJsonConfigModal
              class="inl"
              v-if="showProps"
              title="所有属性"
              :cusProp="record.allProps"
              :codeNumber="record.codeNumber"
              @cusEvent="handAllPropsChange"
            />
            <a-divider v-if="showProps" type="vertical" />
            <ExtendJsonConfigModal
              class="inl"
              v-if="showProps"
              title="存货属性"
              :codeNumber="record.codeNumber"
              :cusProp="record.stockProps"
              @cusEvent="handStockPropsChange"
            />
            <a-divider v-if="showProps" type="vertical" />
            <!-- <ExtendJsonConfigModal
              class="inl"
              v-if="showProps"
              title="可编辑的存货"
              :cusProp="record.editableStockProps"
              :codeNumber="record.codeNumber"
              @cusEvent="handEditableStockPropsChange"
            /> -->
            <!-- <a-divider v-if="showProps" type="vertical" /> -->
            <a @click="addRecord(record)">添加</a>
            <a-divider type="vertical" />
            <a :disabled="editItem != null" @click="editRecord(record)">修改</a>
            <a-divider type="vertical" />
            <a :disabled="record.children" @click="deleteRecord(record)">删除</a>
          </span>
        </div>
      </a-table>
    </a-spin>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import API from '@/api/ErpConfig'
import ExtendJsonConfigModal from '@/views/system/modules/extendJsonConfigModal.vue'
export default {
  name: 'ErpConfigModal',
  mixins: [JeecgListMixin],
  components: {
    ExtendJsonConfigModal,
  },
  data() {
    return {
      visible: false,
      isFullScreen: false,

      expandedRowKeys: [],
      editItem: null,
      model: { dataSource: [] },
      tempObject: {}, //用于添加是作为模板对象
      columns: [],
      columnNames: [],
      confirmLoading: false,
      showProps: false,
    }
  },
  methods: {
    rowKey(record) {
      return record.codeNumber + 'tytyrytrt'
    },
    save(record) {
      console.log('=====>record', record)
      delete record['editable']
      this.editItem = null
      this.model.configJson = JSON.stringify(this.model.dataSource)
      API.update(this.model)
      this.$forceUpdate()
      console.log('record=====>', record)
    },
    handleChange(value, record, col, target) {
      console.log(value, record, col)
      record[col] = value
      this.$forceUpdate()
      target.focus()
      console.log(record)
      console.log(this.model)
    },
    cancel(record) {
      console.log('=====>record', record)
      delete record['editable']
      this.editItem = null
      this.$forceUpdate()
      console.log('record=====>', record)
    },
    addRecord(parent) {
      let item = JSON.parse(JSON.stringify(this.tempObject))
      item.codeNumber = this.randomString()
      item.id = this.randomId()
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        if (!this.expandedRowKeys.includes(parent.id)) {
          this.expandedRowKeys.push(parent.id)
        }
        window.tabss = this.$refs.table
        parent.children.push(item)
      } else {
        this.model.dataSource.push(item)
      }
      this.editRecord(item)
      console.log(this.expandedRowKeys)
      console.log(this.model)
      this.$forceUpdate()
    },
    editRecord(record) {
      console.log(record)

      this.editItem = JSON.parse(JSON.stringify(record))

      record.editable = true
      this.$forceUpdate()
    },
    deleteRecord(record) {
      this.realDeleteRecord(this.model.dataSource, record)
      this.model.configJson = JSON.stringify(this.model.dataSource)
      API.update(this.model)
      this.$forceUpdate()
    },

    realDeleteRecord(array, record) {
      for (let i = 0; i < array.length; i++) {
        if (record.codeNumber == array[i].codeNumber) {
          array.splice(i, 1) // 将使后面的元素依次前移，数组长度减1
          i-- // 如果不减，将漏掉一个元素
          return true
        } else if (array[i].children && array[i].children.length > 0) {
          let res = this.realDeleteRecord(array[i].children, record)
          if (res) {
            if (array[i].children.length == 0) {
              delete array[i]['children']
            }
          }
        }
      }
    },

    edit(record) {
      this.show(record)
    },
    async show(record) {
      if (this.model.id != record.id) {
        this.expandedRowKeys = []
      }
      delete record['editable']
      this.editItem = null
      this.model = Object.assign({}, record)
      this.model.dataSource = JSON.parse(this.model.configJson)
      this.columns = JSON.parse(this.model.columns)
      this.tempObject = {}
      this.columns.forEach((v) => {
        v.scopedSlots = { customRender: v.dataIndex }
        this.columnNames.push(v.dataIndex)
        this.tempObject[v.dataIndex] = '请填写'
      })

      this.columns.push({
        title: '操作',
        dataIndex: 'action',
        width: 350,
        fixed: 'right',
        scopedSlots: { customRender: 'action' },
      })
      this.visible = true
      //console.log(this.model, this.columns)

      if (this.model.configCode == 'chlx') {
        this.showProps = true
        // console.log(this.showProps)
        //console.log('运行到这里了')
        this.model.dataSource.forEach((i) => {
          this.setDefaultValue(i)
        })
      }
      this.$forceUpdate()
    },

    setDefaultValue(i) {
      if (!i.allProps) {
        i.allProps = '{}'
      }
      if (!i.stockProps) {
        i.stockProps = '{}'
      }
      if (!i.editableStockProps) {
        i.editableStockProps = '{}'
      }

      if (i.children && i.children.length > 0) {
        i.children.forEach((v) => {
          this.setDefaultValue(v)
        })
      }
    },

    /** 确定按钮点击事件 */
    handleOk(e) {
      this.editItem = null
      this.visible = false
      this.$emit('ok')
    },
    handAllPropsChange(data, codeNumber) {
      console.log('assddadadasdasda', data, codeNumber)
      let item = this.selectItemByCodeNumer(this.model.dataSource, codeNumber)
      item.allProps = data
      this.model.configJson = JSON.stringify(this.model.dataSource)
      API.update(this.model)
      this.$forceUpdate()
    },

    handNewAllPropsChange(data, codeNumber) {
      let item = this.selectItemByCodeNumer(this.model.dataSource, codeNumber)
      item.new_AllProps = data
      this.model.configJson = JSON.stringify(this.model.dataSource)
      API.update(this.model)
      this.$forceUpdate()
    },

    // selectItemByCodeNumer(dataSource, codeNumber) {
    //   //从所有配置里面找到 codeNumber对应的配置
    //   let codeArray = [] //比如 存货代码是 0203020302 那么 codeNumber=020302  后面4位是真正的存货编码前面6位是类型编码  那么cideArray=['02','0203','020302']

    //   let count = codeNumber.length / 2
    //   for (let i = 1; i <= count; i++) {
    //     codeArray.push(codeNumber.substring(0, 2 * i))
    //   }
    //   console.log('lihuaxxx')

    //   let defaultItem = {
    //     allProps: `{}`,
    //   }
    //   let item = {} //需要遍历的节点
    //   let returnItem = {} //找到的节点
    //   item.children = dataSource //首先遍历根节点

    //   //@jayce 22/04/25-09:47:05 :  这里的逻辑是  遍历3此  先找02类型有没有配置存货属性  配置了则使用02类型的  再找0203  再找020302
    //   for (let i = 0; i < count; i++) {
    //     if (item.children) {
    //       item.children.forEach((v) => {
    //         if (v.codeNumber == codeArray[i]) {
    //           item = v //如果找到对应的类型 将需要遍历的节点设置成这个节点
    //           if (v.allProps && v.allProps != '{}') {
    //             //如果这个节点配置了自定义form则将返回的节点设置成这个节点
    //             returnItem = v
    //           }
    //         }
    //       })
    //     }
    //   }
    //   if (Object.keys(returnItem).length > 0) {
    //     return returnItem
    //   }
    //   return defaultItem
    // },

    selectItemByCodeNumer(dataSource, codeNumber) {
      //从所有配置里面找到 codeNumber对应的配置
      let codeArray = []
      let count = codeNumber.length / 2
      for (let i = 1; i <= count; i++) {
        codeArray.push(codeNumber.substring(0, 2 * i))
      }
      console.log(codeArray)

      let item = {}
      item.children = dataSource
      console.log('1241235541214')
      let find = false
      for (let i = 0; i < count; i++) {
        if (item.children) {
          item.children.forEach((v) => {
            if (v.codeNumber == codeArray[i]) {
              find = true
              item = v
            }
          })
        }
      }
      if (find) {
        return item
      }
      return null
    },
    handStockPropsChange(data, codeNumber) {
      console.log('stockProps', data)
      let item = this.selectItemByCodeNumer(this.model.dataSource, codeNumber)
      item.stockProps = data
      this.model.configJson = JSON.stringify(this.model.dataSource)
      API.update(this.model)
      this.$forceUpdate()
    },
    handEditableStockPropsChange(data, codeNumber) {
      console.log('editableStockProps', data)
      let item = this.selectItemByCodeNumer(this.model.dataSource, codeNumber)
      item.editableStockProps = data
      this.model.configJson = JSON.stringify(this.model.dataSource)
      API.update(this.model)
      this.$forceUpdate()
    },
    validateError(msg) {
      this.$message.error(msg)
    },
    showProp() {
      console.log(this.model)
      return true
    },
    randomString() {
      let e = 8
      let t = '0123456789'
      let a = t.length
      let n = ''
      for (let i = 0; i < e; i++) {
        n += t.charAt(Math.floor(Math.random() * a))
      }
      return n
    },

    randomId() {
      let e = 10
      let t = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let a = t.length
      let n = ''
      for (let i = 0; i < e; i++) {
        n += t.charAt(Math.floor(Math.random() * a))
      }
      return n
    },
  },
}
</script>

<style scoped>
.inl {
  display: inline-block;
}
</style>
