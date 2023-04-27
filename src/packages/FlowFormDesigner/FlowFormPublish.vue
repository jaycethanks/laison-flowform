<template>
  <div class="publish-page-wrapper" :style="{ height: height }">
    <div class="publish-content">
      <!--  -->
      <div class="field-item">
        <div style="float: left; width: 15%">
          <!--  -->
          <div class="inside-field-item">
            <div class="field-title">
              <div class="field-main-title required-field">图标设置</div>
              <div class="field-sub-title">图标</div>
            </div>

            <div class="field-content" style="cursor: pointer" @click="$refs.iconSelect.show()">
              <iconSelect ref="iconSelect" v-model="sumbitForm.iconName" />
            </div>
          </div>
        </div>
        <div style="float: right; width: 75%">
          <!--  -->
          <div class="field-item">
            <div class="field-title">
              <div class="field-main-title required-field">表单名称</div>
              <div class="field-sub-title">最多20字符</div>
            </div>

            <div class="field-content">
              <a-input allowClear style="width: 100%" placeholder="请输入表单名称" v-model="sumbitForm.flowName" />
            </div>
          </div>
          <!--  -->
        </div>
      </div>

      <div class="field-item" style="clear: both">
        <div class="field-title">
          <div class="field-main-title required-field">所在分组</div>
          <div class="field-sub-title">请为该流程设定分组</div>
        </div>
        <div class="field-content" style="display: flex">
          <a-popover v-model="popoverVisible" :title="null" trigger="click">
            <!-- prettier-ignore -->
            <div slot="content" style="display: flex; align-items: center;gap: 5px;">
              <!-- prettier-ignore -->
              <div style="white-space: nowrap;font-weight: 600;">新增分组:</div>
              <a-input @keyup.enter="handlerAdd" :maxLength="10" allowClear placeholder="新增的组名，10个字符限制" v-model="newGroupInputModel"></a-input>
              <!-- prettier-ignore -->
              <a-button @click="handlerAdd" type="link" size="small" ><a-icon type="check"/></a-button>
              <!-- prettier-ignore -->
              <a-button @click="popoverVisible = false" type="link" size="small" ><a-icon style="color: #ff7875" type="close"/></a-button>
            </div>
            <a-button
              style="margin-right: 20px"
              type="dashed"
              shape="circle"
              icon="plus"
              @click="newGroupInputModel = ''"
            />
          </a-popover>

          <a-select v-model="sumbitForm.groupSelected" style="width: 100%">
            <!-- prettier-ignore -->
            <!-- <a-input-search ref="inputRef"  enterButton="添加" @search="addItem"></a-input-search> -->
            <a-select-option v-for="item in groupList" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </div>
      </div>

      <div class="field-item">
        <div class="field-title">
          <div class="field-main-title">表单说明</div>
          <div class="field-sub-title">请在这里简单描述该流程表单用途及注意事项，最多50字符</div>
        </div>

        <div class="field-content">
          <a-textarea allowClear :maxLength="50" v-model="sumbitForm.remark" :auto-size="{ minRows: 2, maxRows: 2 }" />
        </div>
      </div>

      <div class="field-item">
        <div class="field-title">
          <div class="field-main-title required-field">发起新流程</div>
          <div class="field-sub-title">请在这里配置可以发起该流程的人员</div>
        </div>
        <div class="field-content">
          <!-- <OrgSelectionModal v-model="sumbitForm.startMembers" :minHeight="100" /> -->
        </div>
      </div>

      <div class="field-item">
        <div class="field-title">
          <div class="field-main-title required-field">查看全部流程</div>
          <div class="field-sub-title">请在这里配置可以查看全部该流程的人员</div>
        </div>
        <div class="field-content">
          <!-- <OrgSelectionModal v-model="sumbitForm.viewMembers" :minHeight="100" /> -->
        </div>
      </div>
      <div class="field-item">
        <a-button @click="submit" type="primary">发布表单</a-button>
      </div>
    </div>
  </div>
</template>
<script>
// import OrgSelectionModal from '@/lib/bpmnpd/package/penal/comps/OrgSelectionModal.vue';
import iconSelect from '@/components/IconSelect/iconSelect.vue';
import API from '@/api/ErpConfig.js';
// 引入json转换与高亮
import convert from 'xml-js';
let index = 0;
export default {
  props: {
    height: {
      type: String,
    },
    publishEditDataInit: {
      type: Object,
    },
  },
  inject: ['jumpTo'],
  components: {
    // OrgSelectionModal,
    iconSelect,
  },
  data() {
    return {
      popoverVisible: false,
      newGroupInputModel: '',
      sumbitForm: {
        iconName: {}, //图表配置
        flowName: '', // 流程名
        groupSelected: '', //分组
        remark: '', //流程说明
        startMembers: [], //发起流程
        viewMembers: [], // 查看流程
      },
      groupList: [],
    };
  },

  created() {
    // init edit data
    if (this.publishEditDataInit != null) {
      this.sumbitForm = JSON.parse(JSON.stringify(this.publishEditDataInit));
    }
    this.loadGroupList();
  },
  methods: {
    async loadGroupList() {
      let res = await API.processFormList();
      try {
        this.groupList = res.data.map((it) => it.groupName);
      } catch (e) {}
    },

    handleInputClick(e) {
      e.preventDefault();
      this.$refs.inputRef.focus();
    },
    handlerAdd() {
      if (!this.newGroupInputModel.trim()) {
        this.$message.error('组名不可为空');
        return;
      }
      let exist = this.groupList.some((it) => it === this.newGroupInputModel.trim());
      if (exist) {
        this.$message.error('请勿重复新增');
        return;
      }
      this.groupList.push(this.newGroupInputModel);
      this.sumbitForm.groupSelected = this.newGroupInputModel;
      this.popoverVisible = false;
    },
    submit() {
      let valid = this.requiredFieldsValidate();
      valid = true;
      // todo: 记得去除 valid = true
      if (valid) {
        this.submitDataJoint();
      } else {
        this.$message.warning('存在必填字段为空，请先检查后提交！');
      }
    },

    requiredFieldsValidate() {
      if (
        Object.keys(this.sumbitForm.iconName).length === 0 ||
        this.sumbitForm.flowName.trim() === '' ||
        this.sumbitForm.groupSelected.trim() === '' ||
        this.sumbitForm.startMembers.length === 0 ||
        this.sumbitForm.startMembers.length === 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    async submitDataJoint() {
      let processJson = await this.previewProcessJson();
      let processXml = await this.previewProcessXML();
      let initDataStructure = {
        formDesignId: this.sumbitForm.formDesignId || '', // 仅在编辑时会有此id
        designKey: this.getDesignKey(processJson),
        designName: this.sumbitForm.flowName,
        designDes: this.sumbitForm.remark,
        designIcon: this.sumbitForm.iconName.name,
        designColor: this.sumbitForm.iconName.color,
        designGroupName: this.sumbitForm.groupSelected,
        formInfo: JSON.stringify(this.$store.state.kform.data),
        procModelXml: processXml,
        permissionConfig: {
          starterMembers: this.sumbitForm.startMembers,
          viewAllMembers: this.sumbitForm.viewMembers,
        },
        nodeConfigs: window.historyExtendConfig,
      };
      let _this = this;
      function interceptingValidator() {
        // 附加的验证逻辑可以写在这里， 通过返回true，否则返回false
        // 验证流程, 流程节点除了第一个节点， 其他UserTask 类型节点，必须配置 '审批配置' 指定审批人
        let temp = JSON.parse(JSON.stringify(initDataStructure.nodeConfigs));
        temp.shift(); // 首个节点可不必填写
        console.log('temp', temp);
        let blankIndex = temp.findIndex((it) => {
          return it.taskConfig.members.length === 0 && !it.taskConfig.applyerLeader;
        }); // true : not valid
        // if (blankIndex != -1) {
        //   _this.$message.error('检测到存在审批节点未指定审核人员，请检查配置')
        //   setTimeout(() => {
        //     _this.jumpTo(1)
        //   }, 500)
        //   setTimeout(() => {
        //     try {
        //       let selections = window.bpmnInstances.modeler.get('selection')
        //       let shape = window.bpmnInstances.modeler.get('elementRegistry').get(temp[blankIndex].nodeId)
        //       selections.select(shape)
        //     } catch (e) {}
        //   }, 1000)
        //   return false
        // }
        _this.$message.success('流程节配置检查通过');
        return true;
      }

      if (interceptingValidator()) {
        this.doSubmit(initDataStructure);
      }
    },
    getDesignKey(processJson) {
      return JSON.parse(processJson).elements[0].attributes.id;
    },
    async doSubmit(submitdata) {
      console.log('[submitdata]: ', submitdata);
      return;
      let res = await API.editErpConfig({
        status: 2, //0-创建 1-更新 2-部署 <Number>
        erpConfig: submitdata,
      });
      if (res.code === 0) {
        this.$message.success('流程提交成功');
        this.$emit('success');
      } else {
        this.$message.error('流程提交失败');
      }
    },
    /** 表单数据处理 */
    previewProcessXML() {
      return new Promise((resolve, reject) => {
        window.bpmnInstances.modeler.saveXML({ format: true }).then(({ xml }) => {
          resolve(xml);
        });
      });
    },
    previewProcessJson() {
      return new Promise((resolve, reject) => {
        window.bpmnInstances.modeler.saveXML({ format: true }).then(({ xml }) => {
          let xmljson = convert.xml2json(xml, { spaces: 2 });
          resolve(xmljson);
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.publish-page-wrapper {
  padding: 16px 20px;
  .publish-content {
    padding: 16px 20px;
    background-color: #ffffff;
    height: 100%;
    overflow-y: auto;
    width: 40%;
    margin: 0 auto;
    max-width: 700px;
    .publish-content::-webkit-scrollbar {
      width: 2px;
      height: 2px;
    }
    .field-item {
      padding-top: 32px;
      .field-title {
        .field-main-title {
          color: #1f2d3d;
          line-height: 22px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .field-sub-title {
          margin-bottom: 4px;
          color: #91a1b7;
          font-size: 12px;
          line-height: 18px;
        }
      }
      .field-content {
      }
      .inside-field-item {
        padding-top: 32px;
        .field-title {
          .field-main-title {
            color: #1f2d3d;
            line-height: 22px;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .field-sub-title {
            margin-bottom: 4px;
            color: #91a1b7;
            font-size: 12px;
            line-height: 18px;
          }
        }
        .field-content {
        }
      }
    }
  }
}

.required-field::before {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>
