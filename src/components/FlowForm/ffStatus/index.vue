<template>
  <span v-if="isTag">
    <a-tag :color="circulateStatus.color.bg_light"
      ><span :style="{ color: circulateStatus.color.text }">{{
        circulateStatus.label
      }}</span>
    </a-tag>
  </span>
  <span v-else>
    <div
      class="color-dot"
      :style="{
        display: 'inline-block',
        marginRight: '.5em',
        borderRadius: '100%',
        width: '10px',
        height: '10px',
        backgroundColor: circulateStatus.color.bg,
        outline: `2px solid ${circulateStatus.color.bg_light}`,
      }"
    ></div>
    <span :style="{ color: circulateStatus.color.text, fontSize: '12px' }">{{
      circulateStatus.label
    }}</span>
  </span>
</template>
<script>
import baseStyle from "@/components/base/baseStyle.js"
import { StatusOptions, ProcessStatusType } from "@/constants/ProcessStatusType.js"
const { AUDITING, CHANGE, DONE, DRAFT, REJECT, REVOKE, TODO } = ProcessStatusType
function getLabelBy(value){
  return StatusOptions.find(it=>it.value === value).label
}
const statuses = {
  [DRAFT]: { label: getLabelBy(DRAFT), color: baseStyle.$secondary },
  [TODO]: { label: getLabelBy(TODO), color: baseStyle.$primary },
  [DONE]: { label: getLabelBy(DONE), color: baseStyle.$dark },
  [REVOKE]: { label: getLabelBy(REVOKE), color: baseStyle.$warning },
  [AUDITING]: { label: getLabelBy(AUDITING), color: baseStyle.$info },
  [REJECT]: { label: getLabelBy(REJECT), color: baseStyle.$danger },
  [CHANGE]: { label: getLabelBy(CHANGE), color: baseStyle.$success },
};
export default {
  name: 'ffStatus',
  props: {
    statusCode: {
      type: [String, Number]
    },
    isTag: {
      type: Boolean,
      default: false
    }

  },
  computed: {
    circulateStatus: function () {
      return statuses[this.statusCode]
    }
  },

}
</script>
<style></style>
