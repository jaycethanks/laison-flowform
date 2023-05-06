<template>
  <div class="flow-design-root">
    <a-space direction="vertical" size="large" style="width: 100%; display: block">
      <a-card title="已选择模板" :bordered="false">
        <a-button type="primary" slot="extra" icon="appstore">添加模板</a-button>
        <section class="my-template">
          <div class="my-template-content">
            <template v-if="list.length == 0">
              <a-empty
                style="
                  height: 100%;
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
                    <ff-icon :icon="_item.designIcon" :bgc="_item.designColor" />
                    <div class="process-item-label">
                      <p class="process-item-lable-title">{{ ellipsis(_item.designName, 8) }}</p>
                      <!-- description -->
                      <a-tooltip placement="top">
                        <template slot="title">
                          {{ _item.designDes }}
                        </template>
                        <p class="process-item-lable-subtitle">{{ ellipsis(_item.designDes, 10) }}</p>
                      </a-tooltip>
                    </div>
                  </div>
                </div>

                <!-- settings -->
                <a-space direction="vertical">
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
                </a-space>
              </div>
            </template>
          </div>
        </section>
      </a-card>

      <a-card title="已启用流程" :bordered="false">
        <section class="enabled-flow">已启用流程</section>
      </a-card>
    </a-space>
  </div>
</template>
<script>
import ellipsis from '@/utils/ellipsis.js';
import API from '@/api/ErpConfig.js';
import mock from './mock';
import ffIcon from '@/components/FlowForm/ffIcon/index.vue';

export default {
  components: { ffIcon },
  data() {
    return {
      list: [],
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
.flow-design-root {
  background-color: #ececec;
  padding: 20px;
  height: 100vh;
  overflow: hidden;
  .my-template {
    .my-template-content {
      // border: 1px solid green;
      // padding: 20px;
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      .process-item-wrapper {
        flex-shrink: 0;
        background: #fff;
        border-radius: 5px;
        position: relative;
        // margin: 10px;
        box-shadow: 0 0 6px 0 rgb(0 0 0 / 10%);
        width: 220px;
        // height: 100px;
        padding: 10px;
        // border: 1px solid red;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
              font-size: 16px;
              line-height: 32px;
            }
            .process-item-lable-subtitle {
              font-size: 12px;
              line-height: 16px;
            }
          }
        }
      }
    }
  }
  .enabled-flow {
    border: 2px solid purple;
  }
}
</style>
