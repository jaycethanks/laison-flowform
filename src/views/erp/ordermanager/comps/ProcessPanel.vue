<template>
  <div class="form-list-wrapper">
    <div class="head-operation-wrapper"></div>
    <div class="form-list">
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
import API from '@/api/ErpConfig.js'
import icons from '@/views/erp/formdesign/statics/index.js'

export default {
  data() {
    return {
      list: [],
      icons,
      loadingSwitch: false
    }
  },
  methods: {
    async loadList() {
      let res = await API.processFormList()
      if (res.code === 0) {
        this.list = res.data
      }
    },
    getIcon(iconName) {
      console.log(iconName, '--line69')
      let iconObj = this.icons.find(it => it.name === iconName)
      return iconObj.file
    },

    /** util function */
    omit(str) {
      let pat = /[^\x00-\xff]/gi
      let char = '@'
      let res = str.replace(pat, char).replace(/\s/gi, '')
      let arr = res.split('')
      let tag = arr.filter(it => it === char)
      let perc = tag.length / arr.length
      if (!str.length) {
        return str
      }
      if (tag < 10) {
        // 字符串以非双音节字符为主
        return str.slice(0, 60) + '...'
      }
      if (perc > 0.3) {
        // 有大量双音节字符
        return str.slice(0, 28) + '...'
      }
    }
  },
  mounted() {
    this.loadList()
  }
}
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

              transition: all 0.1s ease-out;

              &:hover {
                transform: scale(1.02);
                box-shadow: 0 2px 20px 0 rgb(0 0 0 / 20%);
                transition: all 0.2s ease-in-out;
              }
            }
          }
        }
      }
    }
  }
}
</style>
