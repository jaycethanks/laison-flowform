<template>
  <div>
    <a-table size="small" bordered :data-source="dataSource" :columns="columns" :pagination="false">
      <template slot="lang" slot-scope="text, record">
        <a-input v-model="record.lang"></a-input>
      </template>
      <template slot="value" slot-scope="text, record">
        <a-input v-model="record.value"></a-input>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="() => onDelete(record.key)">
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>

      <template slot="footer">
        <a-button class="editable-add-btn" size="small" block type="link" @click="handleAdd"> 新增 </a-button>
      </template>
    </a-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataSource: [
        {
          key: '0',
          lang: 'Edward King 0',
          value: '32',
        },
        {
          key: '1',
          lang: 'Edward King 1',
          value: '32',
        },
      ],
      count: 2,
      columns: [
        {
          title: '语言',
          dataIndex: 'lang',
          // width: '30%',
          scopedSlots: { customRender: 'lang' },
        },
        {
          title: '字段值',
          dataIndex: 'value',
          scopedSlots: { customRender: 'value' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ],
    };
  },
  methods: {
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },
    onDelete(key) {
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter((item) => item.key !== key);
    },
    handleAdd() {
      const { count, dataSource } = this;
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: 32,
        address: `London, Park Lane no. ${count}`,
      };
      this.dataSource = [...dataSource, newData];
      this.count = count + 1;
    },
  },
};
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
