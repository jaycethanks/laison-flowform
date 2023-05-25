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
          :type="item.type === 3 ? 'success' : item.type === 2 ? 'warning' : item.type === 1 ? 'info' : 'error'"
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
      :value="customProp"
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
      cache: null,
    };
  },
  watch: {
    approvalType: {
      handler: function () {
        this.disablePerson = true;
        this.disableDept = true;
        this.disableRole = true;
        if (this.customProp && this.customProp.length > 0) {
          this.cache = { [this.customProp[0].type]: this.customProp };
        }

        // 先置为空
        // TODO： 人员的回显缓存ok了， 但是部门的还是有问题
        this.$emit('customEvent', []);
        switch (this.approvalType) {
          case 'applicant':
            this.disablePerson = false;
            this.disableDept = false;
            this.disableRole = false;

          case 'people':
            this.disablePerson = false;
            if (this.cache && 'person' in this.cache) {
              this.$emit('customEvent', this.cache['person']);
            }
            break;
          case 'role':
            this.disableRole = false;
            if (this.cache && 'role' in this.cache) {
              this.$emit('customEvent', this.cache['role']);
            }
            break;
          case 'department':
            this.disableDept = false;
            if (this.cache && 'dept' in this.cache) {
              this.$emit('customEvent', this.cache['dept']);
            }
            break;
        }
      },
      immediate: true,
    },
  },

  methods: {
    // TODO: handle select
    handleOk(data) {
      let arr = [];
      data.forEach((it) => {
        const taglist = it.taglist;
        switch (it.type) {
          case 'dept':
            taglist.forEach((item) => {
              item.type = 3;
            });
            break;
          case 'role':
            taglist.forEach((item) => {
              item.type = 2;
            });
            break;
          case 'person':
            taglist.forEach((item) => {
              item.type = 1;
            });
            break;
        }
        arr = arr.concat(taglist);
      });
      this.$emit('customEvent', arr);
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
