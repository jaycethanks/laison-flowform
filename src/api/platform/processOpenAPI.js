import { axios } from '@/utils/request';
export const myApply = (pageInfo) =>
  axios({
    url: `processOpenAPI/myApply/${pageInfo.pagination.current}/${pageInfo.pagination.pageSize}`,
    method: 'post',
    data: pageInfo.condition,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      uniTenantId: pageInfo.uniTenantId,
      bizToken: pageInfo.bizToken,
    },
  });

export const myApplyList = (condition) =>
  axios({
    url: 'processOpenAPI/myApplyList',
    method: 'post',
    data: {},
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      uniTenantId: condition.uniTenantId,
      bizToken: condition.bizToken,
    },
  });

export const backTask = (condition) =>
  axios({
    url: 'processOpenAPI/backTask',
    method: 'post',
    data: {
      businessId: condition.businessId,
      curTaskId: condition.curTaskId,
      submitInfo: condition.submitInfo,
    },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      uniTenantId: condition.uniTenantId,
      bizToken: condition.bizToken,
    },
  });

export const delegateTask = (condition) =>
  axios({
    url: 'processOpenAPI/delegateTask',
    method: 'post',
    data: {
      businessId: condition.businessId,
      curTaskId: condition.curTaskId,
      submitInfo: condition.submitInfo,
    },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      uniTenantId: condition.uniTenantId,
      bizToken: condition.bizToken,
    },
  });
