<template>
  <RootContainer>
    <Container>
      <TitleRow title="已选择模板" bold>
        <a-button type="primary" icon="appstore" @click="showFlowFormTemplatesSelectModal = true">添加模板</a-button>
      </TitleRow>

      <section>
        <template v-if="list.length == 0">
          <a-empty
            style="
              height: 100%;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
            "
          />
        </template>

        <template v-for="(_item, _index) in list">
          <div class="process-item-wrapper" :key="_index">
            <div class="process-item">
              <div class="process-item-content">
                <!-- description -->
                <a-tooltip placement="top">
                  <template slot="title">
                    {{ _item.designDes }}
                  </template>
                  <ff-icon :icon="_item.designIcon" style="height: 40px; width: 40px" :bgc="_item.designColor" />
                </a-tooltip>

                <div class="process-item-label">
                  <p class="process-item-lable-title">
                    {{ ellipsis(_item.designName, 13) }}
                  </p>

                  <p class="process-item-lable-subtitle">
                    {{ ellipsis(_item.designDes, 18) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- settings -->
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                <a-icon type="ellipsis" style="font-size: 20px" />
              </a>
              <!-- <a-button
                    type="link"
                    icon="ellipsis"
                    size="small"

                    @click="(e) => e.preventDefault()"
                  ></a-button> -->
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a-button type="link" icon="eye" size="small" title="流程设计" @click="showFormPreviewerModal = true"
                    >预览该模板表单</a-button
                  >
                </a-menu-item>
                <a-menu-item key="1">
                  <a-button type="link" icon="edit" size="small" title="流程设计" @click="handleEdit(_item)"
                    >设计发布该模板</a-button
                  >
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="2">
                  <a-button
                    style="color: #ff4d4f"
                    type="link"
                    icon="delete"
                    size="small"
                    @click="handleDelete(_item.formDesignId)"
                    >删除该模板</a-button
                  >
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <!-- <a-space direction="vertical">
                  <a-button type="link" icon="edit" size="small" title="流程设计" @click="handleEdit(_item)"></a-button>
                  <a-popconfirm
                    placement="rightBottom"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleDelete(_item.formDesignId)"
                  >
                    <template slot="title"> 确定删除？ </template>
                    <a-button style="color: #ff4d4f" type="link" icon="delete" size="small"></a-button>
                  </a-popconfirm>
                </a-space> -->
          </div>
        </template>
      </section>
      <a-space direction="vertical" size="large" style="width: 100%; display: block">
        <TitleRow title="已发布流程" bold> </TitleRow>

        <section>
          <template v-if="enabled_list.length == 0">
            <a-empty
              style="
                height: 100%;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
              "
            />
          </template>

          <template v-for="(_item, _index) in enabled_list">
            <div class="process-item-wrapper" :key="_index">
              <div class="process-item">
                <div class="process-item-content">
                  <a-tooltip placement="top">
                    <template slot="title">
                      {{ _item.designDes }}
                    </template>
                    <ff-icon :icon="_item.designIcon" style="height: 40px; width: 40px" :bgc="_item.designColor" />
                  </a-tooltip>

                  <div class="process-item-label">
                    <p class="process-item-lable-title">
                      {{ ellipsis(_item.designName, 13) }}
                    </p>
                    <!-- description -->

                    <p class="process-item-lable-subtitle">
                      {{ ellipsis(_item.designDes, 18) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- settings -->
              <!-- <a-space direction="vertical">
                </a-space> -->

              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                  <a-icon type="ellipsis" style="font-size: 20px" />
                </a>
                <!-- <a-button
                    type="link"
                    icon="ellipsis"
                    size="small"

                    @click="(e) => e.preventDefault()"
                  ></a-button> -->
                <a-menu slot="overlay">
                  <a-menu-item key="1">
                    <a-button type="link" icon="control" size="small" title="启用状态" @click.prevent.stop
                      >启用状态<a-switch style="margin-left: 6px" v-model="_item.enable" size="small"></a-switch
                    ></a-button>
                  </a-menu-item>
                  <a-menu-item key="2">
                    <a-button type="link" icon="edit" size="small" title="流程设计" @click="handleEdit(_item)"
                      >设计发布</a-button
                    >
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="3">
                    <a-button
                      style="color: #ff4d4f"
                      type="link"
                      icon="delete"
                      size="small"
                      @click="handleDelete(_item.formDesignId)"
                      >删除该流程</a-button
                    >
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
          </template>
        </section>
      </a-space>
      <FormPreviewerModal :visible="showFormPreviewerModal" :footer="null" @close="showFormPreviewerModal = false" />
      <FlowFormTemplatesSelectModal
        :visible="showFlowFormTemplatesSelectModal"
        @ok="showFlowFormTemplatesSelectModal = false"
        @close="showFlowFormTemplatesSelectModal = false"
      />
    </Container>
  </RootContainer>
</template>
<script>
import ellipsis from '@/utils/ellipsis.js';
import API from '@/api/ErpConfig.js';
import mock from './mock';
import FormPreviewerModal from '@/packages/FormPreviewerModal/index.vue';
import ffIcon from '@/components/FlowForm/ffIcon/index.vue';
import FlowFormTemplatesSelectModal from '@/components/FlowForm/FlowFormTemplatesSelectModal/index.vue';
import _mock from './_mock';
import FlowFormDesignerType from '@/constants/FlowFormDesignerType.js';
import Container from '@/components/base/Container/index.vue';
import TitleRow from '@/components/base/TitleRow/index.vue';
import RootContainer from '@/components/base/RootContainer/index.vue';
export default {
  components: { ffIcon, FormPreviewerModal, FlowFormTemplatesSelectModal, Container, TitleRow, RootContainer },
  data() {
    return {
      list: [],
      enabled_list: [],
      showFormPreviewerModal: false,
      showFlowFormTemplatesSelectModal: false,
    };
  },
  methods: {
    ellipsis: (str, max) => ellipsis(str, max),
    async loadList() {
      // let res = await API.processFormList();
      // if (res.code === 0) {
      //   this.list = res.data;
      // }
      this.list = mock.data;
      // TODO: 数据中需要有enable字段
      _mock.data.forEach((item) => {
        item.enable = true;
      });
      this.enabled_list = _mock.data;
    },

    async handleDelete(id) {
      this.$confirm({
        title: 'Are you sure delete this task?',
        content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
      return;
      let res = await API.realDeleteConfigById(id);
      this.loadList();
      if (res.code === 0) {
        this.$message.success('删除成功');
      } else {
        this.$message.error('删除失败');
      }
    },
    handleEdit(record) {
      this.$emit('edit', record);
      this.$router.push({
        path: '/platform/flowformDesigner',
      });
    },
  },
  mounted() {
    this.loadList();
  },
};
</script>
<style scoped lang="scss">
section {
  // border: 1px solid green;
  // padding: 20px;
  margin-bottom: 46px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  .process-item-wrapper {
    flex-shrink: 0;
    background: #fff;
    border-radius: 5px;
    position: relative;
    // margin: 10px;
    border: 1px solid #f2f2f2;

    // box-shadow: 0 0 6px 0 rgb(0 0 0 / 10%);
    width: 296px;
    // height: 100px;
    padding: 22px 30px;
    // border: 1px solid red;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    &:hover {
      border: 1px solid #ececec;
      box-shadow: 0 4px 10px 0 #515a561f;
    }
    .process-item {
      // border: 1px solid black;
      display: flex;
      align-items: center;
      gap: 10px;
      .process-item-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        .process-item-label {
          margin-right: 16px;
        }

        p {
          margin: 0;
        }
        .process-item-lable-title {
          color: #2f2f2f;
          font-size: 14px;
          font-weight: bold;
          line-height: 22px;
          margin-bottom: 4px;
        }
        .process-item-lable-subtitle {
          font-size: 12px;
          color: #999;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
