<template>
  <div>
    <div ref="pdiv" :style="{ opacity: disabled ? '0.5' : '1' }" @click="handleClick">
      <a-textarea auto-size :disabled="true" v-model="selectedItemText"></a-textarea>
    </div>
    <orga-structure-modal v-model="visible" @ok="handleOk" deptType="all" />
  </div>
</template>
<script>
import OrgaStructureModal from '@/components/laison/OrgaStructureModal/index.vue'

export default {
  name: 'OrgSelectionModal',
  components: {
    OrgaStructureModal,
  },
  props: ['customProp', 'disabled', 'selected'],
  model: {
    prop: 'customProp',
    event: 'customEvent',
  },
  data() {
    return {
      visible: false,
      history: [],
    }
  },
  computed: {
    selectedItemText: function () {
      if (this.customProp != undefined && Array.isArray(this.customProp)) {
        let items = this.customProp.map((it) => {
          return `${it.name}`
        })
        return items.join(', ')
      }
      return undefined
    },
  },
  methods: {
    handleOk(data) {
      if (this.checkIfAlreadySelected(data)) {
        this.$message.warning('不可重复选择部门！')
        return
      }
      let _arr = []
      data.forEach((it) => {
        //"1-用户类型 2-角色类型 3-部门领导 4-部门 5-发起人 6-发起人领导 格式：Number",
        let temp = []
        if (it.type === 'dept') {
          temp = it.taglist.map((_it) => {
            return {
              type: 4,
              name: _it.title,
              memberId: _it.id,
            }
          })
        } else if (it.type === 'role') {
          temp = it.taglist.map((_it) => {
            return {
              type: 2,
              name: _it.name,
              memberId: _it.id,
            }
          })
        } else if (it.type === 'person') {
          temp = it.taglist.map((_it) => {
            return {
              type: 1,
              name: _it.realname,
              memberId: _it.id,
              deptId: _it.deptId,
              deptName: _it.deptName,
            }
          })
        }
        _arr = _arr.concat(temp)
      })

      this.$emit('customEvent', _arr)
    },
    handleClick() {
      if (this.disabled) return
      this.visible = true
    },
    checkIfAlreadySelected(select) {
      let selected = JSON.parse(JSON.stringify(this.selected))
      // 如果 选择项中 dutyDept 的长度也是0 那么剔除
      selected.forEach((it, ind) => {
        if (!it.dutyDept.length) {
          selected.splice(ind, 1)
        }
      })
      if (!selected.length) return
      // 找到人员已选择列表
      let p = select.find((it) => it.type === 'person')
      let pers = p && p.taglist
      if (!pers) return
      // 取出已选择列表中，所有的deptId
      let deptIdList = selected.map((it) => it.dutyDept[0].deptId)
      if (!deptIdList.length) return

      // 判断是否已经选择
      let exist = false
      pers.forEach((p) => {
        if (deptIdList.includes(p.deptId)) exist = true
      })
      return exist
    },
  },
}
</script>
<style lang="less" scoped>
/deep/ .ant-input[disabled] {
  color: #000;
  background-color: #fff;
  cursor: pointer;
  opacity: 1;
}
</style>
<style scoped>
.person-incharge-wrapper {
  padding: 20px;
}
.person-incharge-wrapper:hover {
  /* background-color: #eee; */
}
.add-person-inchage-icon-mask {
  cursor: pointer;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2196f30a;
}
.add-person-inchage-icon-mask i {
  color: #008cff34;
  font-size: 19px;
  font-weight: bold;
}
.add-person-inchage-icon-mask:hover {
  transition: all 0.3s;
  background-color: #2196f326;
  backdrop-filter: blur(1px);
}
.add-person-inchage-icon-mask:hover i {
  transition: all 0.3s;

  color: #008eff;
}
.add-person-inchage-icon-mask.org-select-modal-disabled:hover {
  cursor: not-allowed;
  background-color: #2196f30a;
  backdrop-filter: unset;
}
.add-person-inchage-icon-mask.org-select-modal-disabled:hover i {
  color: #008cff34;
}
</style>
