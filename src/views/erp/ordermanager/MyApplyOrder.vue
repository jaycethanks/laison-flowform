<template>
  <div class="search">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <!--            &lt;!&ndash;订单标题&ndash;&gt;-->
            <!--            <a-col :md="5" :sm="8">-->
            <!--              <a-form-item :label="$t('order.label')">-->
            <!--                <a-input :placeholder="$t('order.InputKeyword')" v-model="pageInfo.condition.title"></a-input>-->
            <!--              </a-form-item>-->
            <!--            </a-col>-->
            <!--订单编号-->
            <a-col :md="5" :sm="8">
              <a-form-item :label="$t('OrderStats.orderNo')">
                <a-input :placeholder="$t('OrderStats.inputOrderNo')" v-model="pageInfo.condition.orderNo"></a-input>
              </a-form-item>
            </a-col>
            <!--订单状态-->
            <a-col :md="5" :sm="8">
              <a-form-item :label="$t('order.status')">
                <a-select
                  v-model="pageInfo.condition.status"
                  :placeholder="$t('order.pleaseSelect')"
                  :allowClear="true"
                >
                  <a-select-option value="0">{{ $t('order.notSubmit') }}</a-select-option>
                  <a-select-option value="1">{{ $t('order.waitAudit') }}</a-select-option>
                  <a-select-option value="2">{{ $t('order.completed') }}</a-select-option>
                  <a-select-option value="3">{{ $t('order.canceled') }}</a-select-option>
                  <a-select-option value="4">{{ $t('order.inAudit') }}</a-select-option>
                  <a-select-option value="6">{{ $t('order.back') }}</a-select-option>
                  <a-select-option value="7">已变更</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!--订单结果-->
            <a-col :md="5" :sm="8">
              <a-form-item :label="$t('order.result')">
                <a-select
                  v-model="pageInfo.condition.result"
                  :placeholder="$t('order.pleaseSelect')"
                  :allowClear="true"
                >
                  <a-select-option value="0">{{ $t('order.notSubmit') }}</a-select-option>
                  <a-select-option value="1">{{ $t('order.inAudit') }}</a-select-option>
                  <a-select-option value="2">{{ $t('order.finished') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!--订单创建时间-->
            <a-col :md="9" :sm="10">
              <a-form-item :label="$t('order.createTime')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-range-picker
                  v-model="queryTimeDefaultValue"
                  format="YYYY-MM-DD"
                  :placeholder="[$t('order.startTime'), $t('order.endTime')]"
                  @change="onDateChange"
                />
              </a-form-item>
            </a-col>
            <!--重置-->
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-col :md="6" :sm="12">
                <a-button type="primary" style="left: 10px" @click="searchQuery" icon="search">{{
                  $t('common.query')
                }}</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px; left: 10px">{{
                  $t('common.reset')
                }}</a-button>
              </a-col>
            </span>
            <!--申请订单-->
            <span style="float: right; overflow: hidden" class="table-page-search-submitButtons">
              <a-col :md="12" :sm="12">
                <a-button
                  type="primary"
                  @click="getProcessList()"
                  style="left: 10px; margin-right: 30px"
                  icon="plus-circle"
                  >{{ $t('order.StartApply') }}</a-button
                >
              </a-col>
            </span>
          </a-row>
        </a-form>
      </div>
      <!-- table区域-begin -->
      <a-row>
        <a-table
          :scroll="{ x: true }"
          bordered
          :loading="loading"
          rowKey="id"
          :dataSource="dataSource"
          :pagination="pageInfo"
          ref="table"
          :columns="columns"
          @change="handleTableChange"
        >
          <span slot="orderNo" slot-scope="text, record">
            <!-- 该组件需要指定相对元素的position为relative， 如此处 style 中的 /deep/ .ant-table-row-cell-break-word 定义 -->
            <LaisonCornerLabel
              text="翻单"
              ftColor="#fff"
              bgColor="#0f59a4"
              ftSize="12px"
              scale="0.9"
              v-if="record.type === 2"
            ></LaisonCornerLabel>
            <span>{{ text }}</span>
          </span>
          <span slot="status" slot-scope="text, record">
            <a-tag
              :color="
                record.status === 0 //待提交
                  ? ''
                  : record.status === 1 //'处理中'
                  ? 'orange'
                  : record.status === 2 //'已完成'
                  ? 'blue'
                  : record.status === 3 //'已撤回'
                  ? 'red'
                  : record.status === 4 //'审批中'
                  ? 'orange'
                  : record.status === 5 //'异常'
                  ? '#FF6C38'
                  : record.status === 6 //已驳回
                  ? 'pink'
                  : record.status === 7 || record.status === 8 //已变更
                  ? 'purple'
                  : ''
              "
            >
              {{ text }}
            </a-tag>
            <!-- 未提交 待审批 审批中 已完成 已撤回 已驳回 异常 -->
          </span>
          <span slot="result" slot-scope="text, record">
            <a-tag
              :color="
                record.result === 0
                  ? ''
                  : record.result === 1
                  ? 'orange'
                  : record.result === 2
                  ? 'geekblue'
                  : text === '异常'
                  ? '#ff0f0f'
                  : ''
              "
            >
              {{ text }}
            </a-tag>
          </span>
          <span slot="action" slot-scope="text, record">
            <!--撤回-->
            <a href="javascript:;" v-if="record.result === 1 && record.status === 1" @click="onCancelOrder(record)">
              {{ $t('erp.cancelOrder') }}
            </a>
            <a-divider type="vertical" v-if="record.result === 1 && record.status === 1" />
            <!--提交/重新提交-->
            <a href="javascript:;" v-if="record.result === 0" @click="onSubmitOrder(record)">
              {{ record.status === 0 ? $t('erp.submit') : $t('erp.reSubmit') }}
            </a>
            <a-divider type="vertical" v-if="record.result === 0" />
            <!--编辑-->
            <a href="javascript:;" v-if="record.result === 0" @click="onEditOrder(record)">
              {{ $t('erp.edit') }}
            </a>
            <a-divider type="vertical" v-if="record.result === 0" />
            <!--重新下单-->
            <a-popconfirm
              v-if="record.status === 2 && record.formDesignId != '1494137881411715072'"
              :title="$t('erp.realOrderAgain')"
              @confirm="() => onOrderAgain(record, 2)"
            >
              <a>{{ $t('erp.orderAgain') }}</a>
            </a-popconfirm>
            <a-divider type="vertical" v-if="record.status === 2 && record.formDesignId != '1494137881411715072'" />
            <!--催单-->
            <a-popconfirm
              v-if="record.result === 1"
              :title="$t('erp.realRemainder')"
              @confirm="() => onRemainderOrder(record)"
            >
              <a>{{ $t('erp.remainder') }}</a>
            </a-popconfirm>
            <a-divider type="vertical" v-if="record.result === 1" />
            <!--变更-->
            <a-popconfirm
              title="变更流程？"
              v-if="record.status === 2 || record.status === 4 || (record.status === 6 && record.result !== 0)"
              @confirm="() => onChangeOrder(record)"
            >
              <a>变更</a>
            </a-popconfirm>
            <a-divider
              v-if="record.status === 2 || record.status === 4 || (record.status === 6 && record.result !== 0)"
              type="vertical"
            />
            <!--修改-->
            <a
              href="javascript:;"
              v-if="record.result === 1 && record.taskName === '申请者归档'"
              @click="onFixOrder(record)"
            >
              修改
            </a>
            <a-divider type="vertical" v-if="record.result === 1 && record.taskName === '申请者归档'" />
            <!--删除-->
            <a-popconfirm
              v-if="record.result === 0 || record.result === 4 || record.result === 5"
              :title="$t('common.realDelete')"
              @confirm="() => onDeleteOrder(record)"
            >
              <a>{{ $t('common.delete') }}</a>
            </a-popconfirm>
            <!--          <a href='javascript:;'-->
            <!--             v-if='record.result === 0 || record.result === 4|| record.result === 5'-->
            <!--             @click='onDeleteOrder(record)'>-->
            <!--            {{ $t('erp.delete') }}-->
            <!--          </a>-->
            <a-divider type="vertical" v-if="record.result === 0 || record.result === 4 || record.result === 5" />
            <!--历史/进度-->
            <a href="javascript:;" v-if="record.status !== 0" @click="onProgressOrder(record)">
              {{ record.result === 1 ? $t('erp.progress') : $t('erp.history') }}
            </a>
            <a-divider type="vertical" v-if="record.status !== 0" />
            <!--详情-->
            <a href="javascript:;" @click="onDetailOrder(record)">
              {{ $t('erp.detail') }}
            </a>
          </span>
        </a-table>
      </a-row>
    </a-card>

    <!--流程表单-->
    <LaisonCustomeFormShow2
      ref="lcfs"
      v-model="node"
      :opts="{ type }"
      @apply_success="applyok"
    ></LaisonCustomeFormShow2>
    <!-- 
     type:
      0:申请按钮
      1-非翻单record点击编辑
      2-翻单类型record点击编辑
      3-审核-点击处理的时候
      4-查看-DoneTask
     -->

    <!-- 任务历史 -->
    <j-modal-erp :title="buildProgressTitle()" :visible="showTaskProgress" @cancel="showTaskProgress = false">
      <div v-if="showTaskProgress">
        <component :is="TaskProgressBpmn" :value="taskProgress"></component>
      </div>
    </j-modal-erp>
    <!--流程申请选择-->
    <a-drawer
      :title="$t('order.selectProcess')"
      width="23%"
      placement="right"
      :closable="false"
      @close="processModalVisible = false"
      :visible="processModalVisible"
    >
      <a-input-search
        style="margin-bottom: 10px; width: 200px"
        :placeholder="$t('order.InputProcessName')"
        @search="getProcessList($event)"
      />
      <a-empty :description="$t('order.NoProcessSelect')" v-if="activeKeyAll.length === 0" />
      <div v-else>
        <a-collapse v-model="activeKey" :bordered="true">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>
          <a-collapse-panel v-for="(value, index) in activeKeyAll" :header="value" :key="value">
            <a-list :grid="{ gutter: 10, column: 1 }" :dataSource="buildActiveValueAll(value)">
              <a-list-item slot="renderItem" slot-scope="item">
                <!-- <a-card>
                  <div slot="title">
                    <a-row>
                      <a-col span="12" :title="item.designName">{{ item.designName }}</a-col>
                      <a-col span="12" style="text-align: right">
                        <a href="javascript:void (0)" @click="launchApplication(item)">{{
                          $t('order.StartApply')
                        }}</a>
                      </a-col>
                    </a-row>
                  </div>
                  <b>{{ $t('order.Version') }}</b
                  >v.{{ item.version }}
                  <br />
                  <b>{{ $t('order.explain') }}</b
                  >{{ item.designDes }}
                </a-card> -->
                <div class="process-item" @click="launchApplication(item)">
                  <div class="process-item-icon-title-wrap">
                    <span class="process-item-version"
                      ><b>{{ $t('order.Version') }}</b
                      >v.{{ item.version }}</span
                    >
                    <div class="icon-box" :style="{ backgroundColor: item.designColor }">
                      <img :src="getIcon(item.designIcon)" alt="" />
                    </div>
                    <div class="process-item-title">{{ item.designName }}</div>
                  </div>
                  <div class="process-item-desc">
                    <b>{{ $t('order.explain') }}</b
                    >{{ item.designDes }}
                  </div>
                </div>
              </a-list-item>
            </a-list>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </a-drawer>
    <!--提交通过信息-->
    <submit-order
      :title="$t('order.confirmSubmit')"
      :suggest-label="$t('order.confirmRemark')"
      :suggest-label-warn="$t('order.confirmRemarkError')"
      ref="modalSubmit"
      @submitOk="submitOk"
    ></submit-order>

    <!--提交变更信息-->
    <submit-order
      :title="$t('order.confirmChange')"
      :suggest-label="$t('order.changeRemark')"
      :suggest-label-warn="$t('order.changeRemarkError')"
      ref="modalChange"
      @submitOk="changeOk"
    ></submit-order>

    <!--提交通过信息-->
    <back-order
      :title="$t('order.cancelOrder')"
      :back-label="$t('order.cancelOrderReason')"
      :is-cancel="true"
      :back-label-warn="$t('order.cancelOrderReasonError')"
      ref="modalCancel"
      @backOk="cancelOk"
    ></back-order>

    <fix-order ref="modalFix" @fixOk="fixOk"></fix-order>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin';
import { activitiMixin } from '@views/activiti/mixins/activitiMixin';
import JEllipsis from '@/components/jeecg/JEllipsis';
import API from '@/api/ErpBusiness';
import TaskApi from '@/api/ErpTask';
import ConfigApi from '@/api/ErpConfig';
import moment from 'moment';
import LaisonCustomeFormShow2 from '@/components/laison/LaisonCustomeFormShow2';
import ErpBusiness from '@/api/ErpBusiness';
import SubmitOrder from '@views/activiti/form/SubmitOrder';
import BackOrder from '@views/activiti/form/BackOrder';
import FixOrder from '@views/activiti/form/FixOrder';
import LaisonCornerLabel from '@/components/laison/OrgaStructureModal/LaisonCornerLabel.vue';
import JModalErp from '@/views/erp/ordermanager/modal/JModalErp.vue';
import icons from '@/views/erp/formdesign/statics/index.js';

export default {
  name: 'OrderStats',
  mixins: [JeecgListMixin, activitiMixin],
  components: {
    JEllipsis,
    LaisonCustomeFormShow2,
    SubmitOrder,
    BackOrder,
    FixOrder,
    LaisonCornerLabel,
    JModalErp,
  },
  data() {
    return {
      //type
      type: 4, // <Number> LaisonCustomeFormShow2 弹起时的类型，控制了kformDesign 的全局disabled值等
      //operateType 0-创建/编辑/翻单 3-修改
      operateType: 0,
      description: '我的发起',
      // 新增修改按钮是否显示
      orderByClause: 'update_time desc',
      show: true,
      //流程选择相关
      processModalVisible: false,
      processFormData: [],
      activeKeyAll: [],
      activeKey: [],
      // 表头
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 },
      },
      // 表头
      columns: [
        {
          title: this.$t('OrderStats.orderNo'),
          align: 'center',
          dataIndex: 'orderNo',
          scopedSlots: { customRender: 'orderNo' },
        },
        {
          title: this.$t('OrderStats.title'),
          align: 'center',
          dataIndex: 'title',
        },
        {
          title: this.$t('OrderStats.status'),
          align: 'center',
          dataIndex: 'statusName',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('OrderStats.result'),
          align: 'center',
          dataIndex: 'resultName',
          scopedSlots: { customRender: 'result' },
        },
        {
          title: this.$t('OrderStats.applyer'),
          align: 'center',
          dataIndex: 'applyer',
        },
        {
          title: this.$t('OrderStats.applyTime'),
          align: 'center',
          dataIndex: 'applyTime',
        },
        {
          title: this.$t('OrderStats.updateBy'),
          align: 'center',
          dataIndex: 'updateByName',
        },
        {
          title: this.$t('OrderStats.updateTime'),
          align: 'center',
          dataIndex: 'updateTime',
        },
        {
          title: this.$t('OrderStats.applyDept'),
          align: 'center',
          dataIndex: 'deptName',
        },
        {
          title: this.$t('common.operation'),
          dataIndex: 'action',
          fixed: 'right',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      icons,
    };
  },
  created() {
    this.pageInfo.condition.orderByClause = this.orderByClause;
    if (this.$store.getters.userInfo.id != '1') {
      this.pageInfo.condition.delFlag = 0;
    }

    //初始化查询条件的时间范围
    this.pageInfo.condition.startTime = this.moment()
      .locale('en_US')
      .add(-3, 'M')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss'); //开始时间是当前时间减去3个月
    this.pageInfo.condition.endTime = this.moment().locale('en_US').endOf('day').format('YYYY-MM-DD HH:mm:ss'); //结束时间是当天
    this.queryTimeDefaultValue[0] = this.moment(this.pageInfo.condition.startTime, 'YYYY-MM-DD');
    this.queryTimeDefaultValue[1] = this.moment(this.pageInfo.condition.endTime, 'YYYY-MM-DD');
    let config = this.$store.getters.userInfo.sysDept.config.OrderStatsListFiled;
    config = config == undefined ? 0 : config;
    this.columns.forEach((v, index) => {
      //生成导出字段
      if (v.dataIndex && v.dataIndex != 'action') {
        this.exportJsonFiled[v.title] = v.dataIndex;
      }
    });
    for (let i = 0; i < 30; i++) {
      let j = 1 << i;
      if ((config & j) != 0) {
        //为真说明这个字段需要删除
        let filedname = API.filedList[i];
        this.columns.forEach((v, index) => {
          if (v.dataIndex == filedname) {
            this.columns.splice(index, 1);
            delete this.exportJsonFiled[v.title]; //去掉不需要的导出字段
          }
        });
      }
    }
    this.loadData();
  },
  computed: {},
  methods: {
    moment,
    loadData() {
      this.loading = true;
      API.myOrder(this.pageInfo)
        .then((res) => {
          this.loading = false;
          this.dataSource = res.data.list;
          this.pageInfo.total = res.data.total;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(this.$t('common.getDataError'));
        });
    },

    getProcessList(designName) {
      this.operateType = 0;
      this.loading = true;
      ConfigApi.processListByName(designName, this.ORDER_TYPE.split(','))
        .then((res) => {
          this.loading = false;
          if (res.success) {
            this.activeKeyAll = [];
            this.processFormData = res.data;
            for (let i = 0; i < this.processFormData.length; i++) {
              this.activeKeyAll.push(this.processFormData[i].groupName);
            }
            this.activeKey = this.activeKeyAll;
            this.processModalVisible = true;
          } else {
            this.$message.error(res.errors);
          }
        })
        .catch((err) => {
          this.loading = true;
        });
    },
    buildActiveValueAll(groupName) {
      if (!this.processFormData || this.processFormData.length < 1) return [];
      for (let i = 0; i < this.processFormData.length; i++) {
        let processForm = this.processFormData[i];
        if (processForm.groupName === groupName) {
          return processForm.erpFormDesigns;
        }
      }
      return [];
    },
    /**
     * 提交
     */
    onSubmitOrder(order) {
      this.operateType = 0;
      this.$refs.modalSubmit.show(order);
    },
    //提交任务
    submitOk(order) {
      if (!order) return;
      this.loading = true;
      order.erpOrderId = order.id;
      API.submit(order)
        .then((res) => {
          if (res.code !== 0) {
            this.loading = false;
            this.$message.error(res.errors);
          } else {
            this.loadData();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.errors);
        });
    },
    onChangeOrder(order) {
      this.operateType = 0;
      this.$refs.modalChange.show(order);
    },
    //提交任务
    changeOk(order) {
      if (!order) return;
      this.loading = true;
      API.changeOrder(order)
        .then((res) => {
          if (res.code !== 0) {
            this.loading = false;
            this.$message.error(res.errors);
          } else {
            this.loadData();
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    onFixOrder(order) {
      this.operateType = 3;
      this.$refs.modalFix.show(order);
    },
    //修改客户化参数信息
    fixOk(order) {
      if (!order) return;
      this.operateType = 3;
      this.loading = true;
      this.type = 5;
      console.log('fixOk', order);
      API.fixOrder(order)
        .then((res) => {
          if (res.code !== 0 || !res.data) {
            this.loading = false;
            this.$message.error(res.errors);
          } else {
            res.data.taskId = order.taskId;
            res.data.erpOrderId = order.id;
            res.data.submitInfo = order.submitInfo;
            this.showLcfsForm(res.data);
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    /**
     * 撤单
     */
    onCancelOrder(order) {
      console.log('cancel', order);
      this.$refs.modalCancel.show(order);
    },
    cancelOk(order) {
      if (!order) return;
      this.loading = true;
      order.erpOrderId = order.id;
      TaskApi.cancelTask(order)
        .then((res) => {
          if (res.code !== 0) {
            this.loading = false;
            this.$message.error(res.errors);
          } else {
            this.loadData();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.errors);
        });
    },
    launchApplication(process) {
      // 发起申请
      this.type = 0; // 创建
      this.processModalVisible = false;
      this.loadFirstNodeFormInfo(process);
    },
    /**
     * 编辑,拿到formDesignId，展示form设计信息
     */
    onEditOrder(order) {
      this.operateType = 0;
      if (order.type == 1) {
        //如果是翻单
        this.type = 2; // 操作类型=// 2翻单 edit
      } else {
        this.type = 1; // 操作类型=// 1 申请 edit
      }

      order.nodeType = 0;
      order.orderId = order.id;
      this.loadFirstNodeFormInfo(order);
    },

    /**
     * 翻单
     */
    onOrderAgain(order, type) {
      // 后台会将回传数据添加对应的type值， 注意这里的type不同于 this.type
      // 后端返回的数据中 翻单的type 值为1
      this.operateType = 0;
      order.type = type;
      this.loading = true;
      API.turnOrder(order)
        .then((res) => {
          if (res.code !== 0) {
            this.loading = false;
            this.$message.error(res.errors);
          } else {
            this.loadData();
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    /**
     * 删除
     */
    onDeleteOrder(order) {
      this.loading = true;
      API.deleteById(order.id)
        .then((res) => {
          if (res.code !== 0) {
            this.loading = false;
            this.$message.error(res.errors);
          } else {
            this.loadData();
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    /**
     * 提交编辑信息
     */
    applyok(erpFormDesign) {
      this.loading = true;
      if (erpFormDesign && erpFormDesign.erpFormVal) {
        erpFormDesign.formData = erpFormDesign.erpFormVal.formData;
      }
      if (this.operateType === 3) {
        ErpBusiness.confirmFixOrder(erpFormDesign)
          .then((res) => {
            if (res.success) {
              this.$message.success(this.$t('erp.operateSuccess'));
              this.loadData();
            } else {
              this.loading = false;
              this.$message.error(res.errors);
            }
          })
          .catch((err) => {
            this.loading = false;
          });
      } else {
        ErpBusiness.edit(erpFormDesign)
          .then((res) => {
            if (res.success) {
              this.$message.success(this.$t('erp.operateSuccess'));
              this.loadData();
            } else {
              this.loading = false;
              this.$message.error(res.errors);
            }
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    },
    /**
     * 详情
     */
    onDetailOrder(order) {
      this.type = 4; // 查看
      order.nodeType = 2;
      order.orderId = order.id;
      this.loadFirstNodeFormInfo(order, true);
    },

    /**
     * @description: 查询第一个节点提交的信息
     * @param {*} order
     * @param { Boolean } newest - 是否查询最新的节点信息
     * @return {*}
     */
    loadFirstNodeFormInfo(order, newest) {
      let queryApi = newest ? ConfigApi.findDesignFormInfoByBusinessId : ConfigApi.findFirstDesignFormInfo;
      this.loading = true;
      queryApi(newest ? order.id : order)
        .then((res) => {
          this.loading = false;
          if (!res.success) {
            this.$message.error(res.errors);
          } else {
            this.showLcfsForm(res.data);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    hasPermission(permission) {
      return this.$store.getters.userInfo.permissions.includes(permission);
    },

    onDateChange: function (value, dateString) {
      this.pageInfo.condition.startTime = dateString[0];
      this.pageInfo.condition.endTime = dateString[1];
    },

    getIcon(iconName) {
      console.log(iconName, '--line69');
      let iconObj = this.icons.find((it) => it.name === iconName);
      return iconObj.file;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ant-table-row td {
  overflow: hidden;
  position: relative !important;
}

/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

.export-excel-wrapper {
  display: inline-block;
  margin-left: 8px;
}
</style>
<style scoped lang="scss">
.process-item {
  user-select: none;
  cursor: pointer;
  background: #fff;
  border-radius: 5px;
  position: relative;
  // margin: 20px;
  box-shadow: 0 0 6px 0 rgb(0 0 0 / 10%);
  // width: 270px;
  // height: 120px;
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

    .process-item-version {
      position: absolute;
      color: rgb(179, 179, 179);
      top: 21px;
      right: 19px;
    }

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
    box-shadow: 0 0 6px 2px rgb(0 0 0 / 11%);
    transition: all 0.2s ease-in-out;
  }
}
</style>
