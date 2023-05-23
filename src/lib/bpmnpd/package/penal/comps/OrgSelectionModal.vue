<template>
  <div>
    <!-- <el-card shadow="never" :body-style="{ padding: '0' }"> -->
    <div
      class="person-incharge-wrapper"
      @click="handleClick"
      style="position: relative; border: 1px dashed #d9d9d9"
      :style="{ minHeight: minHeight + 'px' }"
    >
      <template v-for="item in customProp">
        <el-tag
          style="margin: 0 5px 5px 0"
          :type="item.type === 4 ? 'success' : item.type === 2 ? 'warning' : item.type === 1 ? 'info' : 'error'"
          :key="item.id"
          >{{ item.name }}</el-tag
        >
      </template>
      <!-- prettier-ignore -->
      <div class="add-person-inchage-icon-mask" >
          <i class="el-icon-plus"></i>
        </div>
    </div>
    <!-- </el-card> -->

    <orga-structure-modal
      :disableDept="disableDept"
      :disableRole="disableRole"
      :disablePerson="disablePerson"
      v-model="visible"
      @ok="handleOk"
    />
  </div>
</template>
<script>
import OrgaStructureModal from '@/components/laison/OrgaStructureModal/index.vue';

export default {
  name: 'OrgSelectionModal',
  components: {
    OrgaStructureModal,
  },
  props: ['customProp', 'minHeight', 'approvalType'],
  model: {
    prop: 'customProp',
    event: 'customEvent',
  },
  data() {
    return {
      visible: false,
      disableDept: true,
      disableRole: true,
      disablePerson: true,
    };
  },
  watch: {
    approvalType: {
      handler: function () {
        this.disablePerson = true;
        this.disableDept = true;
        this.disableRole = true;
        switch (this.approvalType) {
          case 'applicant':
            this.disablePerson = false;
            this.disableDept = false;
            this.disableRole = false;
            break;
          case 'people':
            this.disablePerson = false;
            break;
          case 'role':
            this.disableRole = false;
            break;
          case 'department':
            this.disableDept = false;
            break;
        }
      },
      immediate: true,
    },
  },

  methods: {
    handleOk(data) {
      let _arr = [];
      data.forEach((it) => {
        //"1-用户类型 2-角色类型 3-部门领导 4-部门 5-发起人 6-发起人领导 格式：Number",
        let temp = [];
        if (it.type === 'dept') {
          temp = it.taglist.map((_it) => {
            return {
              type: 4,
              name: _it.title,
              memberId: _it.id,
            };
          });
        } else if (it.type === 'role') {
          temp = it.taglist.map((_it) => {
            return {
              type: 2,
              name: _it.name,
              memberId: _it.id,
            };
          });
        } else if (it.type === 'person') {
          temp = it.taglist.map((_it) => {
            return {
              type: 1,
              name: _it.realname,
              memberId: _it.id,
            };
          });
        }
        _arr = _arr.concat(temp);
      });
      this.$emit('customEvent', _arr);
    },
    handleClick() {
      this.visible = true;
    },
  },
};
</script>
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
</style>
