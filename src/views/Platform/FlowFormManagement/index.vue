<template>
  <RootContainer>
    <!-- wrongPage from hanleQuery mixin -->
    <EmptyPage v-if="wrongPage" description="wrong page" />
    <Container v-else>
      <TitleRow title="已选择模板" bold>
        <a-button type="primary" icon="appstore" @click="$refs.FlowFormTemplatesSelectModal.show()">添加模板</a-button>
      </TitleRow>

      <section>
        <template v-if="list.length == 0">
          <a-empty
            description="数据为空"
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

        <template v-for="(item, index) in list">
          <TitleRow size="small" :key="item.groupId" :title="item.groupName" bold> </TitleRow>
          <div class="group-wrapper" :key="index">
            <template v-for="(_item) in item.list">
              <div class="process-item-wrapper" :key="_item.id">
                <div class="process-item">
                  <div class="process-item-content">
                    <!-- description -->
                    <a-tooltip placement="top" v-show="_item.designDes">
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
                      <a-button
                        type="link"
                        icon="eye"
                        size="small"
                        title="流程设计"
                        @click="$refs.FormPreviewerModal.show(_item.id)"
                        >预览该模板表单</a-button
                      >
                    </a-menu-item>
                    <a-menu-item key="1">
                      <a-button
                        type="link"
                        icon="edit"
                        size="small"
                        title="流程设计"
                        @click="handleEdit(_item.id,FlowFormDesignerType.PLATFORM_NEW)"
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
          </div>
        </template>
      </section>

      <!-- 已发布流程 Start-->
      <TitleRow title="已发布流程" bold> </TitleRow>

      <section>
        <template v-if="enabled_list.length == 0">
          <a-empty
            description="数据为空"
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

        <template v-for="(item, index) in enabled_list">
          <TitleRow size="small" :key="item.groupId" :title="item.groupName" bold> </TitleRow>
          <div class="group-wrapper" :key="index">
            <template v-for="(_item) in item.list">
              <div class="process-item-wrapper" :key="_item.id">
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
                <a-space direction="vertical">
                  <a-switch
                    style="margin-left: 6px"
                    v-model="_item.enable"
                    @click="handleEnableChange(_item.id,_item.enable)"
                    size="small"
                  ></a-switch>
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
                      <a-menu-item key="2">
                        <a-button
                          type="link"
                          icon="edit"
                          size="small"
                          title="流程设计"
                          @click="handleEdit(_item.id,FlowFormDesignerType.PLATFORM_EDIT)"
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
                </a-space>

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
          </div>
        </template>
      </section>
      <FormPreviewerModal ref="FormPreviewerModal" :footer="null" />
      <FlowFormTemplatesSelectModal ref="FlowFormTemplatesSelectModal" @ok="handleSelect" />
    </Container>
  </RootContainer>
</template>
<script>
import ellipsis from '@/utils/ellipsis.js';
import API from '@/api/ErpConfig.js';
import FormPreviewerModal from '@/packages/FormPreviewerModal/index.vue';
import ffIcon from '@/components/FlowForm/ffIcon/index.vue';
import FlowFormTemplatesSelectModal from '@/components/FlowForm/FlowFormTemplatesSelectModal/index.vue';
import _mock from './_mock';
import FlowFormDesignerType from '@/constants/FlowFormDesignerType.js';
import Container from '@/components/base/Container/index.vue';
import TitleRow from '@/components/base/TitleRow/index.vue';
import RootContainer from '@/components/base/RootContainer/index.vue';
import {listTemplateAndPublish,addTemplate} from "@/api/platform/platformOpenAPI.js"
import handleQuery from "@/mixins/handleQuery.js"
import EmptyPage from '@/components/FlowForm/EmptyPage/index.vue';

export default {
  components: { ffIcon, FormPreviewerModal, FlowFormTemplatesSelectModal, Container, TitleRow, RootContainer,EmptyPage },
  mixins:[handleQuery],
  data() {
    return {
      FlowFormDesignerType,
      list: [],
      enabled_list: [],
      query:{//查看handleQuery的使用文档 src/mixins/handleQuery.md
        platformId:{
          type:String
        },
        bizToken:{
          type:String
        }
      }
    };
  },
  created(){
    this.loadList();
  },
  methods: {

    ellipsis: (str, max) => ellipsis(str, max),
    async handleSelect(id){
      const res = await addTemplate({id,platformId:this.computedQuery.platformId})
      if(res.status === 200){
        this.$message.success(res.msg)
      }else{
        this.$message.error(res.msg)
      }
      this.loadList();
    },
    async loadList() {
      // let res = await API.processFormList();
      // if (res.code === 0) {
      //   this.list = res.data;
      // }
      const res = await listTemplateAndPublish({platformId:this.computedQuery.platformId})
      if(res.status === 200){
        if('templateList' in res.data){
          this.list = res.data.templateList
        }
        if('publishList' in res.data){
          this.enabled_list = res.data.publishList
        }
      }

      // this.list = mock.data;
      // // TODO: 数据中需要有enable字段
      // _mock.data.forEach((item) => {
      //   item.enable = true;
      // });
      // this.enabled_list = _mock.data;
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
    handleEdit(id,type) {
      this.$router.push({
        path: '/platform/flowformDesigner',
        query:{
          type:type,
          templateId:id,
          platformId:this.computedQuery.platformId,
          bizToken:this.computedQuery.bizToken
        }
      });
    },
    async handleEnableChange(id,enable){
      console.log('[id,enable]: ',id,enable)
    }
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
  // display: flex;
  // gap: 20px;
  // flex-wrap: wrap;
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
