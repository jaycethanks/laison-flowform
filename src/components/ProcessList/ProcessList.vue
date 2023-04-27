<template>
  <div class="form-list-wrapper">
    <div class="head-operation-wrapper"></div>
    <div class="form-list">
      <template v-if="list.length == 0">
        <a-empty
          style="height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column"
        />
      </template>
      <div class="form-list-groups">
        <div class="group-item" v-for="(item, index) in list" :key="index">
          <div class="group-item-title">{{ item.groupName }} ({{ item.erpFormDesigns.length }})</div>
          <div class="title-hr"></div>
          <div class="group-item-desc"></div>
          <div class="group-item-body">
            <div class="process-items">
              <!-- prettier-ignore -->
              <template v-for="(_item, _index) in item.erpFormDesigns">
              <div class="process-item" :key="_index">
                <div :class="{'disabled-status':!_item.enable}" class="disabled-status-mask"></div>
                <div class="process-item-edit-icon">
                  启用状态
                  <a-switch :loading="loadingSwitch" @change="(e)=>onSwitchChange(e,_item.formDesignId)" :checked="_item.enable" size="small"/>
                </div>

                <div class="process-item-icon-title-wrap">
                  <div class="icon-box" :style="{backgroundColor:_item.designColor}">
                    <img :src="getIcon(_item.designIcon)" alt="" />
                  </div>
                  <div class="process-item-title">{{ _item.designName }}</div>
                </div>
                <div class="process-item-desc">
                    <a-tooltip placement="right">
                    <template slot="title">
                      {{ _item.designDes }}
                    </template>
                      {{ omit(_item.designDes) }}
                  </a-tooltip>

                  </div>
                <div class="process-item-operation" >
                  <a-button  type="link" icon="edit" size="small"  @click="handleEdit(_item)">编辑</a-button>
                  <a-popconfirm placement="rightBottom" ok-text="Yes" cancel-text="No" @confirm="handleDelete(_item.formDesignId)" >
                    <template slot="title">
                      确定删除？
                    </template>
                      <a-button style="color:#ff4d4f" type="link"  icon="delete" size="small" >删除</a-button>
                  </a-popconfirm>
                </div>
              </div>

              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/api/ErpConfig.js';
import icons from '@/assets/formdesign_icons/index.js';
import mock from './mock';
export default {
  data() {
    return {
      list: [],
      icons,
      loadingSwitch: false,
    };
  },
  methods: {
    async loadList() {
      // let res = await API.processFormList();
      // if (res.code === 0) {
      //   this.list = res.data;
      // }
      this.list = mock.data;
    },
    getIcon(iconName) {
      console.log(iconName, '--line69');
      let iconObj = this.icons.find((it) => it.name === iconName);
      return iconObj.file;
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
    /** util function */
    omit(str) {
      let pat = /[^\x00-\xff]/gi;
      let char = '@';
      let res = str.replace(pat, char).replace(/\s/gi, '');
      let arr = res.split('');
      let tag = arr.filter((it) => it === char);
      let perc = tag.length / arr.length;
      if (!str.length) {
        return str;
      }
      if (tag < 10) {
        // 字符串以非双音节字符为主
        return str.slice(0, 60) + '...';
      }
      if (perc > 0.3) {
        // 有大量双音节字符
        return str.slice(0, 28) + '...';
      }
    },
  },
  mounted() {
    this.loadList();
  },
};
</script>
<style scoped lang="scss">
.form-list-wrapper {
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 2px;
    height: 6px;
  }
  .head-operation-wrapper {
  }
  .form-list {
    // border: 1px solid red;
    padding: 20px;
    width: 50%;
    height: 100%;
    max-width: 1300px;
    min-width: 1200px;
    .form-list-groups {
      .group-item {
        padding-top: 32px;
        .group-item-title {
          color: #1f2d3d;
          line-height: 22px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .title-hr {
          border: 1px solid rgb(221, 221, 221);
          height: 2px;
          width: 100%;
          margin-top: 10px;
        }
        .group-item-desc {
          margin-bottom: 4px;
          color: #a1a1a1;
          font-size: 12px;
          line-height: 18px;
        }
        .group-item-body {
          .process-items {
            // border: 1px solid blue;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            .process-item {
              background: #fff;
              border-radius: 5px;
              position: relative;
              margin: 20px;
              box-shadow: 0 0 6px 0 rgb(0 0 0 / 10%);
              width: 270px;
              height: 120px;
              padding: 18px;
              position: relative;
              .disabled-status {
                z-index: 1;
                background: #ffffff9c;
              }
              .disabled-status-mask {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
              }
              .process-item-edit-icon {
                position: absolute;
                z-index: 2;
                display: flex;
                justify-content: center;
                gap: 10px;
                align-items: center;
                right: 12px;
                top: 10px;
                // border: 1px solid red;
              }
              .process-item-icon-title-wrap {
                display: flex;
                align-items: center;
                gap: 10px;
                .icon-box {
                  width: 48px;
                  height: 48px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 5px;
                  position: relative;
                  img {
                    width: 24px;
                  }
                }
                .process-item-title {
                  font-size: 14px;
                  margin-right: 16px;
                }
              }
              .process-item-desc {
                margin-top: 5px;
                font-size: 12px;
                color: rgb(179, 179, 179);
                word-break: break-all;
              }
              .process-item-operation {
                width: 100%;
                position: absolute;
                z-index: 2;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 5px;
                opacity: 0;
                transform: translateY(10px);
                border-bottom-left-radius: 5px;
                border-bottom-right-radius: 5px;
                transition: all 0.1s ease-out;
              }
              transition: all 0.1s ease-out;

              &:hover {
                transform: scale(1.02);
                box-shadow: 0 2px 20px 0 rgb(0 0 0 / 20%);
                transition: all 0.2s ease-in-out;
              }
              &:hover .process-item-operation {
                opacity: 1;
                transform: translateY(0);
                transition: all 0.3s ease-in-out;
                background: linear-gradient(270deg, white, transparent);
              }
            }
          }
        }
      }
    }
  }
}
</style>
