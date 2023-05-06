// TODO: 组件中的操作按钮需要增加权限控制， 仅登陆的管理员用户可操作
<template>
  <div class="process-list-root" ref="process-list-root" :style="{ height: 'calc(100% - 32px)' }">
    <div class="head-operation-wrapper">
      <a-button type="link">已选中：{{ allSelectedRowKeys.length }}</a-button>

      <a-list size="small" item-layout="horizontal" :data-source="filteredSelectedRow">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-button @click="handleRemoveListItem(item.designKey)" slot="actions" type="link" title="从选中列表移除">
            <a-icon type="delete" style="color: #ff4d4f"></a-icon>
          </a-button>
          <a-list-item-meta :description="ellipsis(item.designDes, 10)">
            <span slot="title" :title="item.designName" style="white-space: nowrap">{{
              ellipsis(item.designName, 8)
            }}</span>
            <div slot="avatar" class="icon-box" :style="{ backgroundColor: item.designColor }">
              <img :src="getIcon(item.designIcon)" alt="" />
            </div>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
    <section class="collapse-wrapper">
      <!-- <div class="search-box">
        <a-input></a-input>
      </div> -->
      <!-- todo: 卷动下方内容 -->
      <div class="collapse-content">
        <a-collapse :bordered="false" v-model="activeKey">
          <a-collapse-panel v-for="group in list" :key="group.groupId" :style="customStyle">
            <!-- group 设置 -->
            <a-dropdown slot="extra">
              <a-button type="link">
                <a-icon type="setting" />
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-button
                    size="small"
                    v-show="group.notEditable"
                    icon="edit"
                    type="link"
                    @click.prevent.stop="group.notEditable = false"
                    >重命名</a-button
                  >
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <template slot="header">
              <a-space>
                <a-input
                  size="small"
                  :style="{ border: group.notEditable ? 'none' : '', useSelect: 'none' }"
                  :disabled="group.notEditable"
                  @click.prevent.stop
                  @change.stop.prevent
                  v-model="group.groupName"
                />

                <a-button
                  v-show="!group.notEditable"
                  icon="check"
                  type="link"
                  :loading="ifloadingCheck"
                  @click.prevent.stop="handleGroupNameEdit(group)"
                ></a-button>
              </a-space>
            </template>
            <a-table
              :row-selection="{
                selectedRowKeys: group.selectedRowKeys,
                onChange: (selects) => onSelectChange(group, selects),
              }"
              :columns="columns"
              :data-source="group.formTemplates"
              rowKey="designKey"
              size="small"
              :pagination="false"
            >
              <template slot="formDesignId" slot-scope="text, record">
                <div class="icon-box" :style="{ backgroundColor: record.designColor }">
                  <img :src="getIcon(record.designIcon)" alt="" />
                </div>
              </template>
              <a slot="enable" slot-scope="text, record">
                <a-switch
                  :loading="loadingSwitch"
                  @change="(e) => onSwitchChange(e, record.formDesignId)"
                  :checked="record.enable"
                  size="small"
                />
              </a>
              <a slot="action" slot-scope="text">
                <a-space>
                  <a-button type="link" icon="edit" size="small" @click="handleEdit(_item)">编辑</a-button>
                  <a-popconfirm
                    placement="rightBottom"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleDelete(_item.formDesignId)"
                  >
                    <template slot="title"> 确定删除？ </template>
                    <a-button style="color: #ff4d4f" type="link" icon="delete" size="small">删除</a-button>
                  </a-popconfirm>
                </a-space>
              </a>
            </a-table>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </section>
  </div>
</template>
<script>
import API from '@/api/ErpConfig.js';
import icons from '@/assets/flowform_icons/index.js';
import mock from './mock';
import ellipsis from '@/utils/ellipsis';
const columns = [
  {
    title: '',
    dataIndex: 'formDesignId',
    key: 'formDesignId',
    width: 80,

    scopedSlots: { customRender: 'formDesignId' },
  },
  {
    title: '模板名称',
    dataIndex: 'designName',
    key: 'designName',
    width: 200,
  },
  {
    title: '描述',
    dataIndex: 'designDes',
    key: 'designDes',
    ellipsis: true,
  },
  {
    title: '版本号',
    dataIndex: 'version',
    key: 'version',
    width: 100,
  },
  {
    title: '启用状态',
    dataIndex: 'enable',
    key: 'enable',
    scopedSlots: { customRender: 'enable' },
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: 150,
  },
];

export default {
  data() {
    return {
      activeKey: [],
      ifloadingCheck: false,
      columns,
      list: [],
      icons,
      loadingSwitch: false,
      customStyle: 'background-color:#fff;border-bottom:1px solid #e5e5e5;overflow: hidden;padding:0',
      drawer: {
        visible: false,
      },
    };
  },
  computed: {
    allSelectedRowKeys: function () {
      return this.list
        .map((group) => group.selectedRowKeys)
        .reduce((prev, curr) => {
          return prev.concat(curr);
        }, []);
    },
    filteredSelectedRow: function () {
      return this.list
        .map((item) => item.formTemplates)
        .reduce((prev, curr) => {
          return prev.concat(curr);
        }, [])
        .filter((formTemplate) => this.allSelectedRowKeys.includes(formTemplate.designKey));
    },
  },
  methods: {
    ellipsis: (str, max) => ellipsis(str, max),
    handleRemoveListItem(designKey) {
      this.list.forEach((group) => {
        const index = group.selectedRowKeys.findIndex((key) => key === designKey);
        if (index !== -1) {
          group.selectedRowKeys.splice(index, 1);
        }
      });
    },
    onDrawerClose() {
      this.drawer.visible = false;
    },
    onSelectChange(group, selects) {
      group.selectedRowKeys = selects;
    },
    async loadList() {
      // TODO：  返回的数据中要求新增 groupId 字段
      mock.data.forEach((item) => {
        // !!notEditable & selectedRowKeys 仅前端运行时有效，提交后台之前，数据中的这两个字段应该移除
        item.notEditable = true;
        item.selectedRowKeys = [];

        item.groupId = Math.random().toString(36).substr(2);

        this.activeKey.push(item.groupId);
      });
      this.list = mock.data;
      console.log('[this.list]: ', this.list);
    },
    handleGroupNameEdit(group) {
      // TODO：  后端需要新增接口 handle groupName 分组名称的修改
      const { groupName, groupId } = group;
      this.ifloadingCheck = true;
      setTimeout(() => {
        group.notEditable = true;
        this.ifloadingCheck = false;
      }, 2000);
      console.log(groupName, groupId);
    },
    getIcon(iconName) {
      let iconObj = this.icons.find((it) => it.name === iconName);
      if (iconName && iconObj && iconObj.file) {
        return iconObj.file;
      }
      return null;
    },
    onSwitchChange(status, id) {
      this.changeStatus(status, id);
    },
    async changeStatus(status, id) {
      this.loadingSwitch = true;
      let res = await API.editConfigStatus({ enable: status, formDesignId: id });
      if (res.code === 0) {
        this.$message.success('修改状态成功');
      } else {
        this.$message.error('修改状态失败!');
      }
      this.loadList();
      this.loadingSwitch = false;
    },
    async handleDelete(id) {
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
    },
  },
  mounted() {
    this.loadList();
  },
};
</script>
<style scoped lang="scss">
// ::v-deep .ant-collapse {
//   overflow-y: auto;
// }
::v-deep .ant-collapse-header {
  padding: 0;
}
::v-deep .ant-input[disabled] {
  color: unset;
  width: auto;
  background-color: unset;
  cursor: unset;
  opacity: unset;
  -webkit-user-select: none; /* Chrome, Safari, Opera */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ */
  user-select: none;
}
.process-list-root {
  padding-top: 10px;
  display: flex;
  position: relative;
  user-select: none;
  // overflow-y: scroll;
  .head-operation-wrapper {
    overflow-y: scroll;
    width: 30%;
    min-width: 300px;
    flex: 1;
    padding: 4px 12px;
    position: relative;
  }
  .collapse-wrapper {
    height: 100%;
    overflow-y: scroll;
    .collapse-content {
      // border: 1px solid red;
      // overflow-y: scroll;
    }

    flex: 3;
    // border: 1px solid red !important;
  }

  .a-drawer-wapper {
  }
  .show-details-wrap {
    font-size: 14px;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 30px;
    width: 100%;
    background-color: #f8f8f8;
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
  }
  &::-webkit-scrollbar {
    width: 2px;
    height: 6px;
  }

  .icon-box {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    position: relative;
    img {
      width: 24px;
    }
  }
}
</style>
