import Expressions from '@/lib/kform/KFormDesign/module/expressions.vue';
<template>
  <div class="expression-root">
    <a-tag @click="handleTagClick(item)" v-for="item in fields" :key="item">{{ item }}</a-tag>
    <div class="operation-row">
      <main class="operation-box">
        <div class="operation-inner" v-for="(i, index) in expressions" :key="i.key">
          <a-textarea class="textarea" v-model="i.expression" />
          <a-button @click="handleDelete(i.key)" size="small" class="delete-icon" type="link">删除</a-button>
        </div>
        <!-- <a-textarea> Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, voluptas. </a-textarea> -->
        <a-button @click="handleAdd" radius="" block size="small" icon="plus">新增</a-button>
      </main>
      <aside class="tool-function-box">
        <a-collapse default-active-key="1" :bordered="false">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>
          <a-collapse-panel :key="fn.key" :header="fn.type" :style="customStyle" v-for="fn in fns">
            <ul class="expression-function-wrapper">
              <li v-for="{ name } in fn.list" :key="name">{{ name }}</li>
            </ul>
          </a-collapse-panel>
        </a-collapse>
      </aside>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fns: [
        {
          key: '1',
          type: '数学',
          list: [
            {
              name: 'SUM',
              fn: function () {},
            },
            {
              name: 'SUBTRACT',
              fn: function () {},
            },
            {
              name: 'MULTIPLY',
              fn: function () {},
            },
            {
              name: 'DIVIDE',
              fn: function () {},
            },
          ],
        },
      ],
      expressions: [
        { expression: '', key: 1 },
        { expression: '', key: 2 },
      ],
      fields: ['数量', '单价', '总额'],
      text: `A dog is `,
      customStyle: 'white-space: nowrap;font-size:12px;border-radius: 4px;border: 0;overflow: hidden',
    };
  },
  methods: {
    handleTagClick(item) {
      console.log('[item]: ', item);
    },
    handleAdd() {
      this.expressions.push({
        key: new Date().getTime(),
        expression: '',
      });
    },
    handleDelete(key) {
      const index = this.expressions.findIndex((exp) => {
        exp.key === key;
      });
      this.expressions.splice(index, 1);
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .ant-collapse-header {
  padding: 0px 18px !important;
  // padding-left: 16px !important;
}
::v-deep .ant-collapse-content.ant-collapse-content-active {
  white-space: break-spaces;
}

::v-deep .ant-collapse-arrow {
  left: 4px !important;
}
.expression-root {
  background-color: #f5f6f6;
  padding: 5px 20px;
  min-height: 200px;
  div.operation-row {
    margin-top: 10px;
    // width: 100px;
    // border: 1px solid green;

    display: flex;
    flex-wrap: nowrap;
    gap: 4px;
    main.operation-box {
      box-sizing: border-box;
      background-color: #fff;
      padding: 10px;

      line-height: 1.5;
      flex: 1;
      // width: 40%;
      .operation-inner {
        display: flex;
        .textarea {
        }
        .delete-icon {
          font-size: 10px;
          color: #ff4d4f;
          padding: 2px;
          // right: 10px;
          // top: 10px;
          // z-index: 1;
          // display: inline-block;
        }
      }
    }
    aside.tool-function-box {
      box-sizing: border-box;
      // border: 1px solid blue;
      width: 30%;
      min-width: 100px;
      .expression-function-wrapper {
        margin: 0;
        padding: 0;
        li {
          font-size: 10px;
          margin: 0;
          padding: 2px 4px;
          list-style: none;
          cursor: pointer;
          display: inline-block;
          width: 100%;
          background-color: #ececec;
          margin-top: 4px;
          border-radius: 5px;
          &:hover {
            background-color: #e0e0e0;
          }
        }
      }
    }
  }
}
</style>
